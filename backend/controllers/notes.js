import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Fetch all topics (for the frontend Sidebar)
export const getAllTopics = async (req, res) => {
  try {
    const topics = await prisma.dsaTopic.findMany({
      include: {
        notes: { select: { id: true, title: true } } // Send the note titles so the sidebar can list them!
      }
    });
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch topics" });
  }
};

// Fetch a single specific note by its ID
export const getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await prisma.dsaNote.findUnique({
      where: { id: noteId }
    });
    
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch note" });
  }
};