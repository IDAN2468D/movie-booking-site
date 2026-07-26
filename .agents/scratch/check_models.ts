import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

async function listModels() {
  try {
    const modelsToTest = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-3.1-flash-lite-preview',
      'gemini-1.5-flash',
      'gemini-1.5-flash-8b'
    ];

    for (const name of modelsToTest) {
      console.log(`Testing model: ${name}...`);
      try {
        const model = genAI.getGenerativeModel({ model: name });
        const result = await model.generateContent("Hi");
        console.log(`✅ ${name} works! Response: ${result.response.text().substring(0, 20)}...`);
      } catch (err: any) {
        console.log(`❌ ${name} failed: ${err.message}`);
      }
    }

  } catch (err) {
    console.error("Error checking models:", err);
  }
}

listModels();
