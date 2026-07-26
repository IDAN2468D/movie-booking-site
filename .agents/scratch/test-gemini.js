const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY || "MOCK_KEY";
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    console.log("Testing Gemini API with key:", apiKey.substring(0, 10) + "...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("שלום, האם אתה עובד?");
    console.log("Success response:", result.response.text());
  } catch (error) {
    console.error("Error details:", error);
  }
}

run();
