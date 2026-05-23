import { prisma } from '../db.js';

async function main() {
  console.log("🌱 Planting seeds in the Kaizen database...");

  // 1. Plant a dummy MCQ
  await prisma.mcqQuestion.upsert({
    where: {
      question: "What is the worst-case time complexity of QuickSort?"
    },
    update: {},
    create: {
      question: "What is the worst-case time complexity of QuickSort?",
      options: ["O(n)", "O(n log n)", "O(n^2)", "O(1)"],
      correctAnswer: "O(n^2)",
      companyTags: ["Google", "Amazon"],
      explanation: "If the pivot element is consistently the greatest or smallest element, QuickSort degrades to O(n^2)."
    }
  });

  // 2. Plant a dummy Coding Challenge
  await prisma.codingChallenge.upsert({
    where: {
      title: "Two Sum"
    },
    update: {},
    create: {
      title: "Two Sum",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      difficulty: "Easy",
      tags: ["Arrays", "Hash Table"],
      starterCode: "function twoSum(nums, target) {\n  // Write your code here\n}",
      testCases: [
        { input: "[2,7,11,15], 9", output: "[0,1]" },
        { input: "[3,2,4], 6", output: "[1,2]" }
      ],
      timeLimitMs: 2000
    }
  });

  console.log("✅ Seeding complete! The database has data.");
}

// Run the main function and close the connection when done
main()
  .catch((error) => {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
