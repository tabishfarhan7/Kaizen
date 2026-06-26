import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Fetch past interviews for the User Dashboard
// @route   GET /api/interviews
export const getInterviewHistory = async (req, res) => {
  try {
    const history = await prisma.mockInterview.findMany({
      where: { userId: req.user.id }, // Secured via your auth middleware
      orderBy: { createdAt: 'desc' }, // Newest first
      select: {
        id: true,
        role: true,
        status: true,
        score: true,
        createdAt: true,
      }
    });
    
    res.status(200).json(history);
  } catch (error) {
    console.error('❌ Error fetching interview history:', error);
    res.status(500).json({ error: "Failed to fetch interview history" });
  }
};

// @desc    Get full transcript of a specific interview
// @route   GET /api/interviews/:id
export const getInterviewDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await prisma.mockInterview.findUnique({
      where: { id: id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' } // Chronological order for the chat UI
        }
      }
    });

    // Make sure it exists AND belongs to the logged-in user
    if (!interview || interview.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access to this interview" });
    }

    res.status(200).json(interview);
  } catch (error) {
    console.error('❌ Error fetching interview details:', error);
    res.status(500).json({ error: "Failed to fetch interview details" });
  }
};