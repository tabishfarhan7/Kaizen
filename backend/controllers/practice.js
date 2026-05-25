    import { prisma } from '../db.js';

// Get a list of coding challenges
export const getChallenges = async (req, res) => {
  try {
    // Fetch only the summary details so we don't overload the frontend
    const challenges = await prisma.codingChallenge.findMany({
      select: { id: true, title: true, difficulty: true, tags: true }
    });
    
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch coding challenges." });
  }
};

// Get MCQs, optionally filtered by company (e.g., ?company=Google)
export const getCompanyMcqs = async (req, res) => {
  try {
    const { company } = req.query;
    
    // If they asked for a specific company, filter by it. Otherwise, get all.
    const filter = company
      ? { companies: { some: { name: String(company) } } }
      : {};
    
    const mcqs = await prisma.mcqQuestion.findMany({
      where: filter,
      take: 10 // Only return 10 questions at a time for the test
    });
    
    res.status(200).json(mcqs);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch MCQs." });
  }
};
