import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "../../../src/db"
import { syncClerkUser } from "../../../src/lib/user-sync"
import { Difficulty, QuizMode } from "@/types/quiz"

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        quizQuestions: true,
      },
    });

    const data = quizzes.map((quiz) => ({
      ...quiz,
      questions: quiz.quizQuestions,
    }));

    return NextResponse.json(
      {
        data,
        error: null,
        status: 200,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        data: null,
        error: error instanceof Error ? error.message : "Unable to load quizzes.",
        status: 500,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dbUser = await syncClerkUser()
    if (!dbUser) return NextResponse.json({ error: "User sync failed" }, { status: 401 })

    const body = await request.json()
    const { title, topic, difficulty, mode, questions } = body

    // Save quiz with nested questions in one Prisma call
    const quiz = await prisma.quiz.create({
      data: {
        title,
        topic,
        difficulty: difficulty as Difficulty,
        mode: mode as QuizMode,
        author: { connect: { id: dbUser.id } },
        quizQuestions: {
          create: questions.map((q: any, index: number) => ({
            text: q.text,
            options: q.options,
            correctAnswer: Number(q.correctAnswer),
            explanation: q.explanation ?? "",
            difficulty: q.difficulty ?? difficulty,
            timeLimit: Number(q.timeLimit ?? 30),
            order: q.order ?? index + 1,
          })),
        },
      },
      include: {
        quizQuestions: true,
      },
    })

    return NextResponse.json({
      data: {
        quizId: quiz.id,
        questions: quiz.quizQuestions.map(q => ({
          id: q.id,
          quizId: q.quizId,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          timeLimit: q.timeLimit,
          order: q.order,
        })),
      },
    })
  } catch (error) {
    console.error("Create quiz error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
