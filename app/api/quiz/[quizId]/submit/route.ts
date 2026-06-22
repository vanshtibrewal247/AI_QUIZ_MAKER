import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "../../../../../src/db"
import { syncClerkUser } from "../../../../../src/lib/user-sync"

export async function POST(
  request: Request,
   { params }: { params: Promise<{ quizId: string }> } 
) {
  try {
    // Auth check
    const { userId } = await auth()
     const { quizId } = await params 
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Sync Clerk user to DB
    const dbUser = await syncClerkUser()
    if (!dbUser) {
      return NextResponse.json({ error: "User sync failed" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { answers, totalTimeTaken } = body as {
      answers: Array<{
        questionId: string
        selectedAnswer: number
        timeSpent: number
      }>
      totalTimeTaken: number
    }

    // Fetch all questions for this quiz
    const questions = await prisma.question.findMany({
      where: { quizId:  quizId },
    })

    if (!questions.length) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      )
    }

    // Calculate score
    const correctCount = answers.filter((a) =>
      questions.find((q) => q.id === a.questionId)?.correctAnswer === a.selectedAnswer
    ).length

    const score = (correctCount / questions.length) * 100

    // Save quiz attempt with answers
    const attempt = await prisma.quizAttempt.create({
      data: {
        // userId: dbUser.id,
        user: { connect: { id: dbUser.id } },  
        quiz: { connect: { id: quizId } },
        // quizId: params.quizId,
        score,
        totalQuestions: questions.length,
        timeTaken: totalTimeTaken,
        completedAt: new Date(),
        userAnswers: {
          create: answers.map((a) => ({
            questionId: a.questionId,
            selectedAnswer: a.selectedAnswer,
            isCorrect:
              questions.find((q) => q.id === a.questionId)?.correctAnswer ===
              a.selectedAnswer,
            timeSpent: a.timeSpent,
          })),
        },
      },
      include: { userAnswers: true },
    })

    return NextResponse.json({
      data: {
        attemptId: attempt.id,
        score,
        correctCount,
        totalQuestions: questions.length,
      },
    })
  } catch (error) {
    console.error("Quiz submit error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
