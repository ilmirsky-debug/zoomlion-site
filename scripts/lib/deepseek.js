const OpenAI = require("openai");
const { makeArticlePrompt } = require("./articlePrompt");

function cleanJson(text) {
  return String(text || "")
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();
}

async function generateArticleDraftWithDeepSeek(title, category, keywords) {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY не найден в .env.local");
  }

  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  });

  const prompt = makeArticlePrompt(title, category, keywords);

  const response = await client.chat.completions.create({
    model: "deepseek-v4-flash",
    messages: [
      {
        role: "system",
        content:
          "Ты SEO-редактор и эксперт по спецтехнике. Верни только валидный JSON без markdown.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.5,
    max_tokens: 6000,
    response_format: { type: "json_object" },
  });

  const text = response.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("DeepSeek вернул пустой ответ");
  }

  return JSON.parse(cleanJson(text));
}

module.exports = { generateArticleDraftWithDeepSeek };