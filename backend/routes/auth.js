import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.js';

const router = express.Router();

// When a POST request hits /register, run the registerUser function
router.post('/register', registerUser);

// When a POST request hits /login, run the loginUser function
router.post('/login', loginUser);

// THIS IS THE MISSING LINE:
export default router;