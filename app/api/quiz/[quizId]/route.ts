import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const QuizIdSchema = z.object({
  quizId: z.string().min(1),
});

export async function GET(
  _req: Request,
  context: { params: Promise<{ quizId: string }> },
) {
  try {
    const params = await context.params;
    QuizIdSchema.parse(params);

    const quiz = await prisma.quiz.findUnique({
      where: { id: params.quizId },
      include: {
        quizQuestions: true,
      },
    });

    if (!quiz) {
      return NextResponse.json(
        {
          data: null,
          error: "Quiz not found.",
          status: 404,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        data: {
          ...quiz,
          questions: quiz.quizQuestions,
        },
        error: null,
        status: 200,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        data: null,
        error: error instanceof Error ? error.message : "Unable to load quiz.",
        status: 500,
      },
      { status: 500 },
    );
  }
}
