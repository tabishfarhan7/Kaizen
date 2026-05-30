import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { createServer } from 'http';

// --- Import the Separated WebSocket Service ---
import { setupInterviewSocket } from './services/interviewSocket.js'; 

// --- Route Imports ---
import notesRoutes from './routes/notes.js';
import interviewRoutes from './routes/interviews.js';
import authRoutes from './routes/auth.js';
import practiceRoutes from './routes/practice.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Global Middlewares ---
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  // This dynamically accepts whatever local port your frontend happens to be runn
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
}));

// --- REST API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/interviews', interviewRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Kaizen Backend is Live!' });
});

// --- Server & WebSocket Initialization ---
// 1. Create a native HTTP server wrapping your Express app
const httpServer = createServer(app);

// 2. Attach the live interview WebSocket engine to the HTTP server
setupInterviewSocket(httpServer);

// --- Start the Engine ---
httpServer.listen(PORT, () => {
  console.log(`🚀 REST API running on port ${PORT}`);
  console.log(`🔌 WebSocket Engine active on ws://localhost:${PORT}/ws/interview`);
});