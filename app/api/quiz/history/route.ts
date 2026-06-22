import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "../../../../src/db"
import { syncClerkUser } from "../../../../src/lib/user-sync"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await syncClerkUser()
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: dbUser.id },
      include: { quiz: true },
      orderBy: { completedAt: "desc" },
      take: 20,
    })

    return NextResponse.json({ data: { attempts } })
  } catch (error) {
    console.error("History fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
