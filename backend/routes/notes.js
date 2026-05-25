import express from 'express';
import { getAllTopics, getNoteById } from '../controllers/notes.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/topics', protectRoute, getAllTopics);
router.get('/:noteId', protectRoute, getNoteById);

export default router;