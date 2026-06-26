import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Compiles a completed interview transcript, runs AI evaluation, 
 * and updates the database record with scores and comprehensive feedback.
 * @param {string} interviewId - The UUID/ID of the target MockInterview record.
 */
export const evaluateInterviewSession = async (interviewId) => {
    try {
        console.log(`📊 Starting AI evaluation for interview session: ${interviewId}`);

        // 1. Fetch the interview details along with all associated messages
        const interview = await prisma.mockInterview.findUnique({
            where: { id: interviewId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!interview || interview.messages.length === 0) {
            console.warn(`⚠️ Evaluation skipped: No messages found for session ${interviewId}`);
            return;
        }

        // 2. Format the messages into a clean text transcript for the AI evaluator
        const formattedTranscript = interview.messages
            .map(msg => `${msg.sender}: ${msg.text}`)
            .join('\n');

        // 3. Initialize the Gemini Model specifically tuned for grading
        const model = genAI.getGenerativeModel({
            model: 'gemini-3.5-flash',
            generationConfig: {
                responseMimeType: 'application/json' // Force a clean JSON response structural object
            },
            systemInstruction: `
                You are an expert technical hiring manager and engineering lead. 
                Analyze the provided transcript of a technical mock interview for the role of a ${interview.role}.
                
                Provide an objective assessment containing:
                1. An overall score from 0 to 100.
                2. Key technical strengths identified.
                3. Clear areas for improvement.
                4. A concise text summary of actionable feedback.

                You MUST respond strictly in the following JSON format:
                {
                    "score": number,
                    "strengths": ["strength1", "strength2"],
                    "improvements": ["improvement1", "improvement2"],
                    "summary": "string text summary"
                }
            `
        });

        const prompt = `Analyze this mock interview transcript:\n\n${formattedTranscript}`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // 4. Parse structured feedback data
        const evaluationData = JSON.parse(responseText);

        // 5. Commit metrics to PostgreSQL
        // Combining strengths, improvements, and summary into a cohesive feedback block
        const detailedFeedbackText = `
### Summary
${evaluationData.summary}

### Key Strengths
${evaluationData.strengths.map(s => `- ${s}`).join('\n')}

### Areas for Improvement
${evaluationData.improvements.map(i => `- ${i}`).join('\n')}
        `.trim();

        await prisma.mockInterview.update({
            where: { id: interviewId },
            data: {
                score: evaluationData.score,
                feedback: detailedFeedbackText,
                status: 'COMPLETED' // Hardens the status setting
            }
        });

        console.log(`✅ Evaluation complete for session ${interviewId}. Assigned Score: ${evaluationData.score}`);

    } catch (error) {
        console.error(`❌ Failed to run automated evaluation for session ${interviewId}:`, error);
    }
};