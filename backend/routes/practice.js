import express from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import { getChallenges, getCompanyMcqs } from '../controllers/practice.js';

const router = express.Router();

// Notice the "protectRoute" in the middle. 
// No one gets to the data without passing the security check first.
router.get('/challenges', protectRoute, getChallenges);
router.get('/mcqs', protectRoute, getCompanyMcqs);

export default router;