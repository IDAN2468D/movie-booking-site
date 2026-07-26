const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "MOCK_KEY");

async function callGeminiWithRetry(
  modelNames,
  fn,
  maxRetries = 2,
  initialDelay = 1000
) {
  const models = Array.isArray(modelNames) ? modelNames : [modelNames];
  let lastError;
  
  for (const modelName of models) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        return await fn(model);
      } catch (err) {
        lastError = err;
        console.error(`Gemini model ${modelName} failed:`, err.message);
        break; 
      }
    }
  }
  throw lastError;
}

async function testChat() {
  const modelNames = ['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];
  try {
    const result = await callGeminiWithRetry(modelNames, async (model) => {
      console.log("Using model instance:", model.model);
      
      const chatModel = genAI.getGenerativeModel({
        model: model.model,
        systemInstruction: "אתה עוזר סינמטי מועיל."
      });

      const chat = chatModel.startChat({
        history: []
      });

      const res = await chat.sendMessage("היי, תמליץ לי על סרט מתח טוב");
      return { text: res.response.text(), modelName: model.model };
    });

    console.log("Success result:", result);
  } catch (error) {
    console.error("Overall error:", error);
  }
}

testChat();
