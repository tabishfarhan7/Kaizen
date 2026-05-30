import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 1. Start a new interview session
export const startInterview = async (req, res) => {
  try {
    const { role } = req.body; // e.g., "Full-Stack Developer", "Frontend"
    
    // We get the userId from the Bouncer (authMiddleware)
    const newInterview = await prisma.mockInterview.create({
      data: {
        userId: req.user.id, 
        role: role || "General Software Engineer"
      }
    });

    // Return the ID so the frontend knows which session to save to later
    res.status(201).json(newInterview);
  } catch (error) {
    res.status(500).json({ error: "Failed to start interview session" });
  }
};

// 2. Save the final transcript and AI score
export const saveInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { transcript, score, feedback } = req.body;

    // Make sure the interview belongs to the logged-in user
    const interview = await prisma.mockInterview.findUnique({ where: { id } });
    if (!interview || interview.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access to this interview" });
    }

    // Update the existing row with the final AI data
    const updatedInterview = await prisma.mockInterview.update({
      where: { id },
      data: {
        transcript,
        score,
        feedback
      }
    });

    res.status(200).json(updatedInterview);
  } catch (error) {
    res.status(500).json({ error: "Failed to save interview data" });
  }
};

// 3. Fetch past interviews for the User Dashboard
export const getInterviewHistory = async (req, res) => {
  try {
    const history = await prisma.mockInterview.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' } // Newest first
    });
    
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch interview history" });
  }
};