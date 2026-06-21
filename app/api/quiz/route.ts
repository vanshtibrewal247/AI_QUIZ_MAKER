import { NextResponse } from "next/server";
import { z } from "zod";
import { Difficulty, QuizMode } from "@/types/quiz";
import prisma from "@/lib/prisma";

const CreateQuizSchema = z.object({
  title: z.string().min(1),
  topic: z.string().min(1),
  difficulty: z.nativeEnum(Difficulty),
  mode: z.nativeEnum(QuizMode),
  authorId: z.string().optional(),
  questions: z
    .array(
      z.object({
        text: z.string().min(1),
        options: z.array(z.string().min(1)).min(2),
        correctAnswer: z.number().int().nonnegative(),
        explanation: z.string().optional(),
        difficulty: z.string().min(1),
        timeLimit: z.number().int().positive().optional(),
        order: z.number().int().positive().optional(),
      }),
    )
    .min(1),
});

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

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { title, topic, difficulty, mode, authorId, questions } = CreateQuizSchema.parse(payload);

    const quiz = await prisma.quiz.create({
      data: {
        title,
        topic,
        difficulty,
        mode,
        authorId,
        quizQuestions: {
          create: questions.map((question, index) => ({
            text: question.text,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            difficulty: question.difficulty,
            timeLimit: question.timeLimit,
            order: question.order ?? index + 1,
          })),
        },
      },
      include: {
        quizQuestions: true,
      },
    });

    return NextResponse.json(
      {
        data: {
          ...quiz,
          questions: quiz.quizQuestions,
        },
        error: null,
        status: 201,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        data: null,
        error: error instanceof Error ? error.message : "Unable to create quiz.",
        status: 500,
      },
      { status: 500 },
    );
  }
}
