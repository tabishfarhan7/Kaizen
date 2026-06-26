import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

// Needed to construct file paths in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("🌱 Starting mass database seeding...");

  // 1. Read the JSON files
  const companiesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'companies.json'), 'utf-8'));
  const mcqsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'mcqs.json'), 'utf-8'));
  
  let codingData = [];
  try {
     codingData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'coding.json'), 'utf-8'));
  } catch (e) {
     console.log("⚠️ No coding.json found, skipping coding challenges.");
  }

  // --- SEED COMPANIES ---
  console.log(`🏢 Seeding ${companiesData.length} Companies...`);
  for (const company of companiesData) {
    await prisma.company.upsert({
      where: { name: company.name },
      update: { logoUrl: company.logoUrl || "" },
      create: { name: company.name, logoUrl: company.logoUrl || "" }
    });
  }

  // Fetch all companies from DB so we have their IDs for linking
  const allCompanies = await prisma.company.findMany();
  
  // --- SEED MCQs ---
  console.log(`📝 Seeding ${mcqsData.length} MCQs...`);
  for (const mcq of mcqsData) {
    
    // 🔥 SMART MAPPING: Automatically handles different property names AI might have used!
    const questionText = mcq.questionText || mcq.question || mcq.title;
    const correctAnswer = mcq.correctAnswer || mcq.answer || mcq.correct;
    const difficulty = (mcq.difficulty || mcq.level || "MEDIUM").toUpperCase();
    const explanation = mcq.explanation || mcq.reason || mcq.description || "No explanation provided.";
    const options = mcq.options || mcq.choices || [];
    const companyNames = mcq.companyNames || mcq.companies || [];

    // Failsafe: If a question is completely broken/empty, skip it so the script doesn't crash
    if (!questionText) {
        console.log(`⚠️ Skipping a broken MCQ: Data is missing the question text.`);
        continue; 
    }

    const linkedCompanies = allCompanies
      .filter(c => companyNames.includes(c.name))
      .map(c => ({ id: c.id }));

    await prisma.mcqQuestion.upsert({
      where: { questionText: questionText },
      update: { companies: { connect: linkedCompanies } },
      create: {
        questionText: questionText,
        options: options,
        correctAnswer: correctAnswer,
        difficulty: difficulty,
        explanation: explanation,
        companies: { connect: linkedCompanies }
      }
    });
  }

  // --- SEED CODING CHALLENGES ---
  if (codingData.length > 0) {
    console.log(`💻 Seeding ${codingData.length} Coding Challenges...`);
    for (const challenge of codingData) {
        
        const title = challenge.title || challenge.name;
        const companyNames = challenge.companyNames || challenge.companies || [];

        if (!title) continue;

        const linkedCompanies = allCompanies
            .filter(c => companyNames.includes(c.name))
            .map(c => ({ id: c.id }));

        await prisma.codingChallenge.upsert({
            where: { title: title },
            update: { companies: { connect: linkedCompanies } },
            create: {
                title: title,
                description: challenge.description || "No description provided.",
                difficulty: (challenge.difficulty || "MEDIUM").toUpperCase(),
                tags: challenge.tags || [],
                starterCode: challenge.starterCode || "",
                testCases: challenge.testCases || [],
                companies: { connect: linkedCompanies }
            }
        });
    }
  }

  console.log("✅ Seeding complete.");
}

main()
  .catch((error) => {
    console.error("❌ Fatal Seeding Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });