import { NextResponse } from "next/server";
import { z } from "zod";
import { Difficulty } from "@/types/quiz";
import { generateJSON } from "@/lib/gemini";

const GenerateQuestionsSchema = z.object({
  topic: z.string().min(1),
  difficulty: z.nativeEnum(Difficulty),
  count: z.number().int().min(1).max(20).default(5),
});

const extractText = (result: any): string => {
  const candidate = result?.response?.candidates?.[0];
  const parts = candidate?.content?.parts ?? [];
  return parts
    .filter((part: any) => typeof part === "object" && typeof part.text === "string")
    .map((part: any) => part.text)
    .join("");
};

const parseJson = <T>(text: string): T | null => {
  const cleaned = text.trim();
  const tryParse = (source: string) => {
    try {
      return JSON.parse(source) as T;
    } catch {
      return null;
    }
  };

  const direct = tryParse(cleaned);
  if (direct) {
    return direct;
  }

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return tryParse(cleaned.slice(firstBrace, lastBrace + 1));
  }

  return null;
};

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { topic, difficulty, count } = GenerateQuestionsSchema.parse(payload);

    const prompt =
    `You are a quiz generator. Generate ${count} completely unique and varied quiz questions on the topic of "${topic}" at ${difficulty} difficulty level.

Session ID: ${Math.random().toString(36).substring(2, 10)}-${Date.now()}

Rules:
- Never repeat obvious or common questions
- Mix conceptual, applied, and tricky questions
- Each question must be distinctly different from the others
- Be creative with question phrasing

Reply only with valid JSON using this exact shape:
{
  "questions": [
    {
      "text": string,
      "options": string[],
      "correctAnswer": number,
      "explanation": string,
      "difficulty": string,
      "timeLimit": number,
      "order": number
    }
  ]
}`;

    const completion = await generateJSON(prompt, "flash");
    const text = extractText(completion);
    const parsed = parseJson<{ questions: any[] }>(text);
    console.log(parsed?.questions)

    if (!parsed?.questions || !Array.isArray(parsed.questions)) {
      return NextResponse.json(
        {
          data: null,
          error: "Gemini returned invalid JSON for generated questions.",
          status: 502,
        },
        { status: 502 },
      );
    }
    console.log("Generated questions:", parsed.questions);
    return NextResponse.json(
      {
        data: { questions: parsed.questions },
        error: null,
        status: 200,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error generating questions.",
        status: 500,
      },
      { status: 500 },
    );
  }
}
