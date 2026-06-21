const fs = require('fs');
const path = require('path');
const envFile = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
envFile.split(/\r?\n/).forEach(line => {
  const match = line.match(/^\s*([^#=]+)=(.*)$/);
  if (match) {
    let key = match[1].trim();
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
});
console.log('GOOGLE_API_KEY_PRESENT:', !!process.env.GOOGLE_API_KEY);
const { GoogleGenerativeAI } = require('@google/generative-ai');
const apiKey = process.env.GOOGLE_API_KEY;
console.log('API_KEY:', apiKey ? 'loaded' : 'missing');
const googleAI = new GoogleGenerativeAI(apiKey);
(async () => {
  try {
    const model = googleAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
    const prompt = 'Test prompt for Gemini.';
    const res = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'text/plain' }
    });
    console.log('RESULT:', res.response?.candidates?.[0]?.content?.parts?.map(p => p.text).join(''));
  } catch (err) {
    console.error('ERR_NAME', err.name || err.constructor.name);
    console.error('ERR_MESSAGE', err.message);
    console.error('ERR_STACK', err.stack);
    if (err.errorDetails) console.error('ERR_DETAILS', JSON.stringify(err.errorDetails, null, 2));
  }
})();
