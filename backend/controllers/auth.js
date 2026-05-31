import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../db.js'; 

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  targetRole: z.string().optional(),
  targetCompanies: z.array(z.string()).optional()
});

export const registerUser = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email: validatedData.email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validatedData.password, salt);

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        passwordHash: passwordHash,
        targetRole: validatedData.targetRole || "Full-Stack Developer",
        targetCompanies: validatedData.targetCompanies || []
      }
    });

    // Fallback secret just in case your .env isn't loading properly during testing
    const secret = process.env.JWT_SECRET || "fallback_secret_key";
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // FIXED: Added 'token' to the JSON response so the React Test Harness can save it!
    res.status(201).json({ 
        message: "Registration successful!", 
        user: { id: user.id, name: user.name },
        token: token 
    });

  } catch (error) {
    console.error("🔥 THE REAL ERROR:", error);
    // FIXED: Now sends the actual error message to your browser Network tab so we can see it
    res.status(400).json({ 
        error: error.errors || error.message || "Server Error during registration." 
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials." });

    const secret = process.env.JWT_SECRET || "fallback_secret_key";
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // FIXED: Added 'token' to the JSON response here as well
    res.status(200).json({ 
        message: "Login successful!", 
        user: { id: user.id, name: user.name },
        token: token
    });

  } catch (error) {
    console.error("🔥 THE REAL ERROR (LOGIN):", error);
    res.status(500).json({ error: error.message || "Server error during login." });
  }
};