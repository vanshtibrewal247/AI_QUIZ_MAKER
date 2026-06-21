import { NextResponse } from "next/server";
import { z } from "zod";
import { generateJSON } from "@/lib/gemini";

const PerformanceInsightsSchema = z.object({
  userId: z.string().min(1),
  topic: z.string().min(1),
  performanceSummary: z.string().min(1),
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
  try {
    return JSON.parse(text.trim()) as T;
  } catch {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.slice(firstBrace, lastBrace + 1)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
};

export async function POST(req: Request) {
  try {
    let payload: unknown;
    try {
      payload = await req.json();
    } catch (error) {
      return NextResponse.json(
        {
          data: null,
          error: "Invalid JSON payload.",
          status: 400,
        },
        { status: 400 },
      );
    }

    const { userId, topic, performanceSummary } = PerformanceInsightsSchema.parse(payload);
    console.log(topic);
    console.log(performanceSummary);
    const prompt = `Review the following learner performance summary for topic \"${topic}\" and return valid JSON with keys strengths, weaknesses, and recommendedTopics.\n\nSummary:\n${performanceSummary}\n\nReturn only JSON.`;
    const completion = await generateJSON(prompt);
    const text = extractText(completion);
    const parsed = parseJson<{ strengths?: string[]; weaknesses?: string[]; recommendedTopics?: string[] }>(text);

    const strengths = Array.isArray(parsed?.strengths) ? parsed.strengths : [];
    const weaknesses = Array.isArray(parsed?.weaknesses) ? parsed.weaknesses : [];
    const recommendedTopics = Array.isArray(parsed?.recommendedTopics) ? parsed.recommendedTopics : [];

    const insightData = {
      userId,
      topic,
      strengths,
      weaknesses,
      recommendedTopics,
    };

    const insight = insightData;

    return NextResponse.json(
      {
        data: insight,
        error: null,
        status: 200,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("performance-insights error:", error instanceof Error ? {
      message: error.message,
      stack: error.stack,
    } : error);

    return NextResponse.json(
      {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error generating performance insights.",
        status: 500,
      },
      { status: 500 },
    );
  }
}
