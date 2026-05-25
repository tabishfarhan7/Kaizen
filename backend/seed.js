import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const google = await prisma.company.upsert({
    where: { name: "Google" },
    update: {},
    create: {
      name: "Google",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
    }
  });

  await prisma.mcqQuestion.upsert({
    where: {
      questionText: "What is the worst-case time complexity of QuickSort?"
    },
    update: {
      companies: {
        connect: [{ id: google.id }]
      }
    },
    create: {
      questionText: "What is the worst-case time complexity of QuickSort?",
      options: ["O(n log n)", "O(n^2)", "O(n)", "O(1)"],
      correctAnswer: "O(n^2)",
      difficulty: "MEDIUM",
      explanation: "QuickSort degrades to O(n^2) when the pivot chosen is consistently the smallest or largest element.",
      companies: {
        connect: [{ id: google.id }]
      }
    }
  });

// --- SEEDING DSA NOTES ---
  console.log("Seeding DSA Topics & Notes...");

  // 1. Create a Dynamic Programming topic
  const dpTopic = await prisma.dsaTopic.upsert({
    where: { name: 'Dynamic Programming' },
    update: {},
    create: { name: 'Dynamic Programming' }
  });

  // 2. Create a specific note for DP
  await prisma.dsaNote.create({
    data: {
      title: "0/1 Knapsack & House Robber Patterns",
      content: "## The Core Idea\nDynamic Programming is just recursion with caching (memoization). \n\n### The House Robber Pattern\nYou cannot rob adjacent houses. The recurrence relation is: `dp[i] = max(dp[i-1], nums[i] + dp[i-2])`.\n\n### 0/1 Knapsack\nInclude the item, or exclude the item. Build a 2D array where rows are items and columns are capacities.",
      topicId: dpTopic.id
    }
  });

  // 3. Create a Sorting Algorithms topic
  const sortingTopic = await prisma.dsaTopic.upsert({
    where: { name: 'Sorting Algorithms' },
    update: {},
    create: { name: 'Sorting Algorithms' }
  });

  // 4. Create a specific note for Sorting
  await prisma.dsaNote.create({
    data: {
      title: "Merge Sort vs Quick Sort",
      content: "## Quick Sort\nPick a pivot, partition the array, and recursively sort. Best for arrays. Time complexity is `O(n log n)`, but worst case is `O(n^2)`.\n\n## Merge Sort\nDivide the array in half, sort halves, and merge. Highly stable. Great for Linked Lists.",
      topicId: sortingTopic.id
    }
  });



  console.log("Seeding complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


  