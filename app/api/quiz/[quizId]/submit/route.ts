import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const SubmitQuizSchema = z.object({
  userId: z.string().min(1),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        selectedAnswer: z.number().int(),
        isCorrect: z.boolean(),
        timeSpent: z.number().int().min(0),
      }),
    )
    .min(1),
});

export async function POST(
  req: Request,
  context: { params: Promise<{ quizId: string }> },
) {
  try {
    const params = await context.params;
    const payload = await req.json();
    const { userId, answers } = SubmitQuizSchema.parse(payload);

    const quiz = await prisma.quiz.findUnique({ where: { id: params.quizId }, include: { quizQuestions: true } });
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

    const score = answers.filter((answer: any) => answer.isCorrect).length;
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId: params.quizId,
        score,
        totalQuestions: answers.length,
        timeTaken: answers.reduce((total: number, answer: any) => total + answer.timeSpent, 0),
        userAnswers: {
          create: answers.map((answer: any) => ({
            questionId: answer.questionId,
            selectedAnswer: answer.selectedAnswer,
            isCorrect: answer.isCorrect,
            timeSpent: answer.timeSpent,
          })),
        },
      },
      include: {
        userAnswers: true,
      },
    });

    return NextResponse.json(
      {
        data: attempt,
        error: null,
        status: 201,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        data: null,
        error: error instanceof Error ? error.message : "Unable to submit quiz attempt.",
        status: 500,
      },
      { status: 500 },
    );
  }
}
