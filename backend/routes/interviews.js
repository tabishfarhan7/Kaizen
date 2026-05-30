import express from 'express';
import { startInterview, saveInterview, getInterviewHistory } from '../controllers/interviews.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

// The Bouncer must protect all of these!
router.post('/start', protectRoute, startInterview);
router.put('/:id/save', protectRoute, saveInterview);
router.get('/history', protectRoute, getInterviewHistory);

export default router;