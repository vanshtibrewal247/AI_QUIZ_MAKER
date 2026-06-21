import { PrismaClient, Difficulty, QuizMode } from "../app/generated/prisma/client";
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("🌱 Starting seed...");

    // Create test user with hardcoded ID (simulating Clerk userId)
    const testUserId = "user_test_" + Date.now();
    const user = await prisma.user.create({
      data: {
        id: testUserId,
        email: `test-${Date.now()}@example.com`,
        name: "Test User",
      },
    });
    console.log("✅ Created test user:", user.id);

    // Create test quiz
    const quiz = await prisma.quiz.create({
      data: {
        title: "Test Quiz",
        topic: "TypeScript Basics",
        difficulty: Difficulty.EASY,
        mode: QuizMode.PRACTICE,
        authorId: user.id,
      },
    });
    console.log("✅ Created test quiz:", quiz.id);

    // Create test question
    const question = await prisma.question.create({
      data: {
        quizId: quiz.id,
        text: "What is TypeScript?",
        options: JSON.stringify([
          "A programming language",
          "A library",
          "A framework",
          "A bundler",
        ]),
        correctAnswer: 0,
        explanation:
          "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.",
        difficulty: "EASY",
        order: 1,
      },
    });
    console.log("✅ Created test question:", question.id);

    // Create test quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: quiz.id,
        score: 100,
        totalQuestions: 1,
        timeTaken: 45,
        completedAt: new Date(),
      },
    });
    console.log("✅ Created test quiz attempt:", attempt.id);

    // Clean up test data
    console.log("🧹 Cleaning up test data...");
    // await prisma.userAnswer.deleteMany({ where: { attempt: { id: attempt.id } } });
    // await prisma.quizAttempt.delete({ where: { id: attempt.id } });
    // await prisma.question.delete({ where: { id: question.id } });
    // await prisma.quiz.delete({ where: { id: quiz.id } });
    // await prisma.user.delete({ where: { id: user.id } });
    // console.log("✅ Cleaned up test data");

    console.log("🎉 Seed completed successfully! Prisma and Neon DB are connected.");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
