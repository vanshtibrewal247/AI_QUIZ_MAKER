import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "../../../../../src/db"
import { syncClerkUser } from "../../../../../src/lib/user-sync"

export async function GET(
  request: Request,
   { params }: { params: Promise<{ attemptId: string }> } 
) {
  try {
    // Auth check
    const { userId } = await auth()
     const { attemptId } = await params
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Sync Clerk user to DB
    const dbUser = await syncClerkUser()
    if (!dbUser) {
      return NextResponse.json({ error: "User sync failed" }, { status: 401 })
    }

    // Fetch quiz attempt with all related data
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        userAnswers: { include: { question: true } },
        quiz: true,
        user: true,
      },
    })

    if (!attempt) {
      return NextResponse.json(
        { error: "Attempt not found" },
        { status: 404 }
      )
    }

    // Verify the attempt belongs to the current user
    if (attempt.user.clerkId !== userId) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    return NextResponse.json({ data: attempt })
  } catch (error) {
    console.error("Get attempt error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
