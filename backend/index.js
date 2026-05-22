import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { createServer } from 'http'; 
import { Server } from 'socket.io';  
import { GoogleGenerativeAI } from '@google/generative-ai';

import authRoutes from './routes/auth.js';
import practiceRoutes from './routes/practice.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create a native HTTP server wrapping your Express app
const httpServer = createServer(app);

// Attach Socket.io to that HTTP server (Origin '*' for testing)
const io = new Server(httpServer, {
  cors: {
    origin: '*', 
    methods: ["GET", "POST"]
  }
});

// --- Global Middlewares ---
app.use(helmet()); 
app.use(express.json()); 
app.use(cookieParser()); 
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}));

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/practice', practiceRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "Kaizen Backend is Live!" });
});

// --- Initialize the AI Engine ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// The System Prompt: This is the brain's core personality
const SYSTEM_PROMPT = `
You are a Senior Technical Engineering Manager at a top-tier tech company. 
You are conducting a live mock interview with a candidate.
Be professional, slightly strict, but fair. 
Ask one technical question at a time. Do not give them the answer.
If they give a partial answer, push them to explain the edge cases.
Keep your responses conversational, spoken-word style, and under 3 sentences so it sounds natural when converted to audio.
`;

// --- WebSocket Event Listeners ---
io.on('connection', (socket) => {
  console.log(`⚡ User connected to Interview Room: ${socket.id}`);

  // Create a dedicated "chat history" memory for this specific user's interview
  const interviewChat = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT 
  }).startChat({ history: [] });

  // 1. The Ear: Listen for tiny pieces of audio
  socket.on('audio_chunk', (audioData) => {
    // We will eventually send this audio to a transcriber. 
    console.log(`🎤 Received input from ${socket.id}`);
  });

  // 2. The Brain & Mouth: Process and Stream Response
  socket.on('stop_speaking', async (data) => {
    console.log(`🛑 User ${socket.id} finished speaking. Thinking...`);
    
    // We grab the text the user "spoke" (sent from our HTML simulator)
    const userMessage = data?.message || "Hello, I am ready for my interview.";

    try {
      // Ask Gemini to respond, and tell it to STREAM the response
      const result = await interviewChat.sendMessageStream(userMessage);
      
      // As Gemini generates words, immediately shoot them down the Walkie-Talkie
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        socket.emit('ai_response_chunk', { text: chunkText });
      }

      // Tell the frontend we are completely done talking
      socket.emit('ai_response_complete', { status: 'done' });

    } catch (error) {
      console.error("🔥 AI Error:", error);
      socket.emit('ai_response_chunk', { text: "Sorry, my brain disconnected. Let's try that again." });
      socket.emit('ai_response_complete', { status: 'error' });
    }
  });

  // 3. The Hang Up
  socket.on('disconnect', () => {
    console.log(`❌ User left the Interview Room: ${socket.id}`);
  });
});

// --- Start Engine ---
httpServer.listen(PORT, () => {
  console.log(`🚀 HTTP & WebSocket Server running on http://localhost:${PORT}`);
});