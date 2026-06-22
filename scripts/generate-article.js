const fs = require("fs");
const path = require("path");

function transliterate(text) {
  const map = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e",
    ж: "zh", з: "z", и: "i", й: "j", к: "k", л: "l", м: "m",
    н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
    ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };

  return text
    .toLowerCase()
    .split("")
    .map((char) => map[char] ?? char)
    .join("");
}

function slugify(text) {
  return transliterate(text)
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "");
}
function toImportName(slug) {
  return (
    slug
      .split("-")
      .map((part, index) =>
        index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join("") + "Article"
  );
}

function updateBlogIndex(slug) {
  const indexPath = path.join(__dirname, "../content/blog/index.js");
  const importName = toImportName(slug);
  const importLine = `import { article as ${importName} } from "./${slug}";`;

  let content = fs.readFileSync(indexPath, "utf8");

  if (!content.includes(importLine)) {
    content = importLine + "\n" + content;
  }

  const entryLine = `  [${importName}.slug]: ${importName},`;

  if (!content.includes(entryLine)) {
    content = content.replace(
      /export const articles = \{\n/,
      `export const articles = {\n${entryLine}\n`
    );
  }

  fs.writeFileSync(indexPath, content);
}
function generateArticle(title) {
  const slug = slugify(title);

  const article = {
    slug,
    title,
    description: `${title} — подробное руководство по выбору техники.`,
    excerpt: `Практическое руководство: ${title}.`,
    category: "Погрузчики",
    date: new Date().toISOString().slice(0, 10),
    image: "/hero1.png",

    content: [
      `${title} — базовое руководство по выбору техники.`,
      "Разберём ключевые параметры и ошибки при выборе.",
    ],

    sections: [
      {
        title: "Основные параметры",
        text: [
          "Важно учитывать условия эксплуатации и характеристики техники.",
        ],
        quote:
          "Правильный выбор техники экономит деньги и повышает эффективность.",
      },
      {
        title: "Частые ошибки",
        text: [
          "Главная ошибка — выбор без анализа условий работы.",
        ],
      },
    ],
  };

  const filePath = path.join(
    __dirname,
    `../content/blog/${slug}.js`
  );

  fs.writeFileSync(
  filePath,
  `export const article = ${JSON.stringify(article, null, 2)}`
);

updateBlogIndex(slug);

console.log("Created:", filePath);
}

generateArticle(process.argv[2]);
