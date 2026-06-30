const { makeArticlePrompt } = require("./articlePrompt");

async function generateArticleDraftWithOllama(
  title,
  category,
  keywords,
  model = "qwen2.5:14b"
) {
  const prompt = makeArticlePrompt(title, category, keywords);

  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      options: {
        temperature: 0.6,
        num_ctx: 8192,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama HTTP ${response.status}`);
  }

  const data = await response.json();

  let text = (data.response || "").trim();

  // убираем ```json ... ```
  text = text
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(text);
}

module.exports = {
  generateArticleDraftWithOllama,
};