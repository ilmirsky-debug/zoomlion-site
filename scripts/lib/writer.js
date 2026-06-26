const fs = require("fs");
const path = require("path");

function writeArticleFile(article) {
  const filePath = path.join(
    process.cwd(),
    "content",
    "blog",
    `${article.slug}.js`
  );

  const content =
    `export const article = ${JSON.stringify(article, null, 2)};\n`;

  fs.writeFileSync(filePath, content, "utf8");

  return filePath;
}

function writeImagePromptFile(slug, prompt) {
  const dir = path.join(process.cwd(), "public", "blog");
  fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${slug}.prompt.txt`);
  fs.writeFileSync(filePath, prompt, "utf8");

  return filePath;
}

module.exports = { writeArticleFile, writeImagePromptFile };