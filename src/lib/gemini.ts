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

export async function generateJSON(prompt: string, model?: string): Promise<GenerateContentResult> {
  const client = model === "flash" ? geminiFlash : geminiFlash;
 
  return client.generateContent({
    contents: buildContent(prompt),
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 1.5,
       topP: 0.95,
        topK: 64,
        maxOutputTokens: 4096,
    },
  });
}

export async function streamText(prompt: string, model?: string): Promise<GenerateContentStreamResult> {
  const client = model === "flash" ? geminiFlash : geminiFlash;

  return client.generateContentStream({
    contents: buildContent(prompt),
    generationConfig: {
      responseMimeType: "text/plain",
    },
  });
}
