require("dotenv").config({
  path: ".env.local",
});

const { slugify } = require("./lib/slug");
const { createArticle } = require("./lib/article");
const { makeKeywords } = require("./lib/keywords");
const { makeImagePrompt } = require("./lib/imagePrompt");
const { writeArticleFile, writeImagePromptFile } = require("./lib/writer");
const { registerArticle } = require("./lib/register");
const { generateArticleDraftWithDeepSeek } = require("./lib/deepseek");

function detectCategory(title) {
  const lower = title.toLowerCase();

  if (lower.includes("подъемник") || lower.includes("подъёмник"))
    return "Подъемники";

  if (lower.includes("погрузчик"))
    return "Погрузчики";

  if (lower.includes("экскаватор"))
    return "Экскаваторы";

  return "Техника";
}

async function main() {

  const title = process.argv.slice(2).join(" ").trim();

  if (!title) {
    console.log("Укажи тему статьи");
    process.exit(1);
  }

  const slug = slugify(title);

  const category = detectCategory(title);

  const keywords = makeKeywords(title, category);

  console.log("🤖 Генерирую статью через DeepSeek...\n");

  const draft = await generateArticleDraftWithDeepSeek(
    title,
    category,
    keywords
  );

  const image = `/blog/${slug}.jpg`;

  const article = createArticle({

    slug,

    title: draft.title,

    description: draft.description,

    excerpt: draft.excerpt,

    category,

    image,

    keywords,

    sections: draft.sections,

    faq: draft.faq,

    related: [],

  });

  const articlePath = writeArticleFile(article);

  const promptPath = writeImagePromptFile(
    slug,
    makeImagePrompt(draft.title)
  );

  registerArticle(article);

  console.log("\n✅ Готово\n");

  console.log(articlePath);

  console.log(promptPath);

}

main().catch(console.error);