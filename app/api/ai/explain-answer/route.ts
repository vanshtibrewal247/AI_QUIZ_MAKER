import { z } from "zod";
import { streamText } from "@/lib/gemini";

const ExplainAnswerSchema = z.object({
  questionText: z.string().min(1),
  selectedAnswer: z.string().min(1),
  explanationContext: z.string().optional(),
});

const extractChunkText = (chunk: any): string => {
  const candidate = chunk?.candidates?.[0];
  const parts = candidate?.content?.parts ?? [];
  return parts
    .filter((part: any) => typeof part === "object" && typeof part.text === "string")
    .map((part: any) => part.text)
    .join("");
};

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { questionText, selectedAnswer, explanationContext } = ExplainAnswerSchema.parse(payload);

    const prompt = `Explain why the selected answer \"${selectedAnswer}\" is correct or incorrect for the following question:\n\n${questionText}\n\n${explanationContext ?? ""}`;
    const result = await streamText(prompt, "flash");
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = extractChunkText(chunk);
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error: unknown) {
    return new Response(
      JSON.stringify({
        data: null,
        error: error instanceof Error ? error.message : "Unknown error streaming explanation.",
        status: 500,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
