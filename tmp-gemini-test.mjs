import { GoogleGenerativeAI } from "@google/generative-ai";
const apiKey = process.env.GOOGLE_API_KEY;
console.log('API_KEY loaded:', Boolean(apiKey));
const googleAI = new GoogleGenerativeAI(apiKey);
const model = googleAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
const prompt = 'Test prompt for Gemini.';
try {
  const res = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'text/plain' }
  });
  console.log('result', JSON.stringify(res, null, 2).slice(0,1000));
} catch (err) {
  console.error('ERR', err);
}
