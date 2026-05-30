import { WebSocketServer } from 'ws';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

export const setupInterviewSocket = (server) => {
    // 💡 Lazy Initialization ensures process.env.GEMINI_API_KEY is loaded!
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Attach WebSocket server to the existing HTTP server
    const wss = new WebSocketServer({ server, path: '/ws/interview' });

    wss.on('connection', async (ws) => {
        console.log('🟢 New Client Connected to Interview Stream');

        // Create a dedicated Gemini Chat Session using the exact active model string
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-3.5-flash', 
            systemInstruction: systemInstruction 
        });
        
        const chatSession = model.startChat({ history: [] });

        // Helper to safely send JSON strings to the client
        const sendJson = (payload) => {
            if (ws.readyState === 1) { // 1 means WebSocket.OPEN
                ws.send(JSON.stringify(payload));
            }
        };

        // Welcome the client and let them know the system is ready
        sendJson({
            type: 'ready',
            message: 'Interview WebSocket connected. Send transcribed text using type "user_transcript".'
        });

        ws.on('message', async (message) => {
            try {
                // Convert buffer to string safely before parsing
                const data = JSON.parse(message.toString());

                if (data.type === 'user_transcript') {
                    console.log('🗣️ User says:', data.text);
                    
                    // Signal the frontend that the AI has started processing
                    sendJson({ type: 'ai_response_start' });

                    // Send text to Gemini and request a streaming response
                    const result = await chatSession.sendMessageStream(data.text);

                    // Stream chunks back to the frontend instantly
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        if (chunkText) {
                            sendJson({ 
                                type: 'ai_response_chunk', 
                                text: chunkText 
                            });
                        }
                    }

                    // Tell the frontend the AI is done talking
                    sendJson({ type: 'ai_response_complete' });
                }
            } catch (error) {
                console.error('❌ WebSocket/Gemini Error:', error);
                sendJson({ type: 'error', message: 'Failed to process audio transcript.' });
                sendJson({ type: 'ai_response_complete', status: 'error' });
            }
        });

        ws.on('close', () => {
            console.log('🔴 Client Disconnected from Interview Stream');
        });
    });
};