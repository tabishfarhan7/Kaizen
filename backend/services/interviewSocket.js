import { WebSocketServer } from 'ws';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';
// 📊 Import the automated grading engine service
import { evaluateInterviewSession } from './evaluationService.js'; 

const prisma = new PrismaClient();

const systemInstruction = `
You are a strict, professional Senior Technical Software Engineering Interviewer conducting a live mock interview.
You must ask exactly one question at a time and then wait for the candidate's response.
After each candidate response, briefly evaluate the answer before asking the next question.
Be professional, slightly strict, and fair.
Do not reveal full solutions unless the candidate explicitly asks to stop the interview.
If an answer is partial, ask one focused follow-up about tradeoffs, edge cases, complexity, or implementation details.
Keep responses conversational, spoken-word friendly, and under four sentences.
DO NOT use markdown, bolding, code blocks, or bullet points. Speak in plain text.
`;

// 🔊 Direct API call to ElevenLabs TTS with Graceful Fallback
const convertTextToSpeechBinary = async (text) => {
    try {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        const voiceId = process.env.ELEVENLABS_VOICE_ID || "pNInz6obpgmo512wGvCw"; // Fallback to Rachel

        if (!apiKey) {
            console.warn("⚠️ ElevenLabs API Key missing in .env! Skipping cloud audio.");
            return Buffer.from([]);
        }

        console.log(`⏳ Calling ElevenLabs API for voice ID: ${voiceId}...`);

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
            method: "POST",
            headers: {
                "Accept": "audio/mpeg",
                "xi-api-key": apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_flash_v2_5", 
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5
                }
            }
        )});

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ ElevenLabs API Blocked (${response.status}):`, errorText);
            return Buffer.from([]);
        }

        const arrayBuffer = await response.arrayBuffer();
        console.log("✅ Audio buffer generated successfully!");
        return Buffer.from(arrayBuffer);

    } catch (error) {
        console.error("❌ Audio Fetch Error:", error);
        return Buffer.from([]);
    }
};

export const setupInterviewSocket = (server) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const wss = new WebSocketServer({ server, path: '/ws/interview' });

    wss.on('connection', async (ws) => {
        console.log('🟢 New Client Connected to Interview Stream');

        const model = genAI.getGenerativeModel({ 
            model: 'gemini-3.5-flash', 
            systemInstruction: systemInstruction 
        });
        
        const chatSession = model.startChat({ history: [] });
        let currentInterviewId = null;

        const sendJson = (payload) => {
            if (ws.readyState === 1) ws.send(JSON.stringify(payload));
        };

        const sendAudioBinary = (buffer) => {
            if (ws.readyState === 1 && buffer.length > 0) {
                ws.send(buffer); 
            }
        };

        sendJson({
            type: 'ready',
            message: 'Interview WebSocket connected with STT & TTS Hybrid Audio capability.'
        });

        ws.on('message', async (rawData, isBinary) => {
            try {
                // 🎤 CASE A: Client sent raw audio buffer (Microphone Stream)
                if (isBinary) {
                    console.log(`🎙️ Received user audio chunk: ${rawData.length} bytes`);
                    return; 
                }

                // 📄 CASE B: Client sent JSON text packet
                const data = JSON.parse(rawData.toString());

                if (data.type === 'user_transcript') {
                    console.log('🗣️ User transcript received:', data.text);
                    
                    // 1. Lazy-initialize the Interview Session in the database if not already created
                    if (!currentInterviewId) {
                        let targetUserId = data.userId;
                        
                        if (!targetUserId) {
                            const defaultUser = await prisma.user.findFirst();
                            targetUserId = defaultUser?.id;
                        }

                        if (!targetUserId) {
                            console.error('❌ Cannot log session: No active users exist in the PostgreSQL instance.');
                            sendJson({ type: 'error', message: 'No authenticated context or profile matching record found.' });
                            return;
                        }

                        const session = await prisma.mockInterview.create({
                            data: {
                                userId: targetUserId,
                                role: data.role || 'Full-Stack Developer',
                                status: 'STARTED'
                            }
                        });
                        currentInterviewId = session.id;
                        console.log(`💾 PostgreSQL session generated under transaction identifier: ${currentInterviewId}`);
                    }

                    // 2. Commit User Message into historical relational records
                    await prisma.interviewMessage.create({
                        data: {
                            interviewId: currentInterviewId,
                            sender: 'USER',
                            text: data.text
                        }
                    });
                    
                    sendJson({ type: 'ai_response_start' });

                    const result = await chatSession.sendMessageStream(data.text);
                    
                    let sentenceBuffer = '';
                    let totalResponseText = '';

                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        if (!chunkText) continue;

                        sendJson({ type: 'ai_response_chunk', text: chunkText });
                        sentenceBuffer += chunkText;
                        totalResponseText += chunkText;

                        if (/[.!?]/.test(chunkText)) {
                            const cleanSentence = sentenceBuffer.trim();
                            if (cleanSentence.length > 0) {
                                console.log(`🔊 Processing speech for: "${cleanSentence}"`);
                                
                                sendJson({ type: 'ai_sentence_complete', sentence: cleanSentence });
                                
                                const audioBuffer = await convertTextToSpeechBinary(cleanSentence);
                                sendAudioBinary(audioBuffer);
                            }
                            sentenceBuffer = ''; 
                        }
                    }

                    if (sentenceBuffer.trim().length > 0) {
                        const cleanSentence = sentenceBuffer.trim();
                        sendJson({ type: 'ai_sentence_complete', sentence: cleanSentence });
                        const audioBuffer = await convertTextToSpeechBinary(cleanSentence);
                        sendAudioBinary(audioBuffer);
                    }

                    // 3. Commit AI Prompt text into database history context
                    await prisma.interviewMessage.create({
                        data: {
                            interviewId: currentInterviewId,
                            sender: 'AI',
                            text: totalResponseText
                        }
                    });

                    sendJson({ type: 'ai_response_complete' });
                }
            } catch (error) {
                console.error('❌ WebSocket/Gemini Error:', error);
                sendJson({ type: 'error', message: 'Failed to process incoming stream.' });
                sendJson({ type: 'ai_response_complete', status: 'error' });
            }
        });

        ws.on('close', async () => {
            console.log('🔴 Client Disconnected from Interview Stream');
            if (currentInterviewId) {
                try {
                    // 1. Immediately settle database connection status
                    await prisma.mockInterview.update({
                        where: { id: currentInterviewId },
                        data: { status: 'COMPLETED' }
                    });
                    console.log(`💾 Session ${currentInterviewId} updated status definition to: COMPLETED`);

                    // 2. Launch grading calculations out-of-band as a background worker thread
                    // This evaluates the complete transcript string and updates scores/markdown feedback
                    evaluateInterviewSession(currentInterviewId);

                } catch (dbError) {
                    console.error('❌ Failed updating session exit bounds:', dbError);
                }
            }
        });
    });
};