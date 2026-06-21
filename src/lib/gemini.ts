import {
  Content,
  GoogleGenerativeAI,
  GenerativeModel,
  GenerateContentRequest,
  GenerateContentStreamResult,
  GenerateContentResult,
} from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error("Missing GOOGLE_API_KEY environment variable.");
}

const googleAI = new GoogleGenerativeAI(apiKey);

const geminiFlash: GenerativeModel = googleAI.getGenerativeModel({ model: "gemini-3.5-flash" });

const buildContent = (prompt: string): Content[] => [
  {
    role: "user",
    parts: [
      {
        text: prompt,
      },
    ],
  },
];

const extractText = (result: GenerateContentResult | GenerateContentStreamResult): string => {
  const candidate = result?.response?.candidates?.[0];
  const parts = candidate?.content?.parts ?? [];
  return parts
    .filter((part: any) => typeof part === "object" && typeof part.text === "string")
    .map((part: any) => part.text)
    .join("");
};

export async function generateJSON(prompt: string, model?: string): Promise<GenerateContentResult> {
  const client = model === "flash" ? geminiFlash : geminiFlash;

  try {
    return await client.generateContent({
      contents: buildContent(prompt),
      generationConfig: {
        responseMimeType: "text/plain",
      },
    });
  } catch (error) {
    console.error("gemini generateJSON error:", error);
    throw error;
  }
}

export async function streamText(prompt: string, model?: string): Promise<GenerateContentStreamResult> {
  const client = model === "flash" ? geminiFlash : geminiFlash;

  try {
    return await client.generateContentStream({
      contents: buildContent(prompt),
      generationConfig: {
        responseMimeType: "text/plain",
      },
    });
  } catch (error) {
    console.error("gemini streamText error:", error);
    throw error;
  }
}
