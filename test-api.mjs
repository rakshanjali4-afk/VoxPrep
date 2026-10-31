import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.log('API key not found in .env');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

try {
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: 'Reply with only: VoxPrep API is working!'
  });

  console.log('API KEY WORKING');
  console.log(response.text);
} catch (error) {
  console.log('API TEST FAILED');
  console.log(error.message);
}