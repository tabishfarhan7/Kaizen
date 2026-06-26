import express from 'express';
import { getInterviewHistory, getInterviewDetails } from '../controllers/interviews.js';
import { protectRoute } from '../middleware/authMiddleware.js'; // Adjust path if needed

const router = express.Router();

// Apply the auth middleware to all routes in this file
router.use(protectRoute);

// Get all interviews for the dashboard
router.get('/', getInterviewHistory);

// Get the full transcript for a single interview
router.get('/:id', getInterviewDetails);

export default router;