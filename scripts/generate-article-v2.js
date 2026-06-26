const { slugify } = require("./lib/slug.js");
const { createArticle } = require("./lib/article.js");
const { makeKeywords } = require("./lib/keywords.js");
const { makeImagePrompt } = require("./lib/imagePrompt.js");
const { writeArticleFile, writeImagePromptFile } = require("./lib/writer.js");
const { registerArticle } = require("./lib/register.js");

function detectCategory(title) {
  const lower = title.toLowerCase();

  if (lower.includes("подъемник") || lower.includes("подъёмник")) {
    return "Подъемники";
  }

  if (lower.includes("погрузчик")) {
    return "Погрузчики";
  }

  if (lower.includes("экскаватор")) {
    return "Экскаваторы";
  }

  return "Техника";
}

function makeSections(title, keywords) {
  const mainKeyword = keywords[0];

  return [
    {
      title: "Для каких задач подходит техника",
      text: [
        `${title} — тема, которая важна для компаний, выбирающих технику под реальные рабочие условия.`,
        `При выборе важно учитывать не только цену, но и задачи, интенсивность эксплуатации, условия площадки и доступность сервиса.`,
      ],
    },
    {
      title: "Ключевые характеристики",
      text: [
        `Перед покупкой стоит оценить рабочие параметры, грузоподъёмность, высоту работы, габариты, тип привода и требования к обслуживанию.`,
        `Правильно подобранный ${mainKeyword} помогает снизить простои, повысить производительность и избежать лишних затрат.`,
      ],
    },
    {
      title: "Сервис и стоимость владения",
      text: [
        `Стоимость владения включает не только цену покупки, но и обслуживание, расходники, запчасти, доставку, обучение операторов и возможные простои.`,
        `Для бизнеса особенно важно заранее понимать, насколько быстро можно получить сервисную поддержку и необходимые комплектующие.`,
      ],
    },
    {
      title: "Типичные ошибки при выборе",
      text: [
        `Частая ошибка — выбирать технику только по минимальной цене без анализа условий эксплуатации.`,
        `Также важно не игнорировать запас по характеристикам, качество сервиса, условия гарантии и наличие расходных материалов.`,
      ],
    },
    {
      title: "Преимущества техники Zoomlion",
      text: [
        `Техника Zoomlion востребована благодаря сочетанию функциональности, современной конструкции и широкого модельного ряда.`,
        `Для компаний это возможность подобрать оборудование под склад, строительную площадку, производство или арендный парк.`,
      ],
    },
    {
      title: "Как принять решение",
      text: [
        `Перед покупкой стоит сравнить несколько моделей, уточнить условия поставки, проверить сервисную поддержку и сопоставить характеристики с задачами объекта.`,
        `Если техника подбирается под конкретный проект, лучше заранее обсудить рабочие условия со специалистом.`,
      ],
    },
  ];
}

function makeFaq(title, keywords) {
  const mainKeyword = keywords[0];

  return [
    {
      question: `Как выбрать ${mainKeyword}?`,
      answer:
        "Нужно учитывать задачи, условия эксплуатации, характеристики техники, доступность сервиса и полную стоимость владения.",
    },
    {
      question: "Что важнее: цена или характеристики?",
      answer:
        "Ориентироваться только на цену рискованно. Важно сравнивать ресурс, надёжность, обслуживание, запчасти и возможные простои.",
    },
    {
      question: "Почему стоит учитывать сервис?",
      answer:
        "Даже хорошая техника требует обслуживания. Быстрый сервис и наличие запчастей помогают сократить простои и снизить расходы.",
    },
    {
      question: "Можно ли подобрать технику под конкретный объект?",
      answer:
        "Да. Для этого нужно знать задачи, покрытие, режим работы, ограничения по габаритам и требуемые рабочие параметры.",
    },
  ];
}

function main() {
  const title = process.argv.slice(2).join(" ").trim();

  if (!title) {
    console.error("Укажи тему статьи");
    process.exit(1);
  }

  const slug = slugify(title);
  const category = detectCategory(title);
  const keywords = makeKeywords(title, category);
  const sections = makeSections(title, keywords);
  const faq = makeFaq(title, keywords);
  const image = `/blog/${slug}.jpg`;

  const description = `Подробный разбор: ${keywords[0]}. Характеристики, условия эксплуатации, сервис, стоимость владения и рекомендации по выбору.`;

  const article = createArticle({
    slug,
    title,
    description,
    excerpt: description,
    category,
    image,
    keywords,
    sections,
    faq,
    related: [],
  });

  const imagePrompt = makeImagePrompt(title);

  const articlePath = writeArticleFile(article);
  const promptPath = writeImagePromptFile(slug, imagePrompt);
  registerArticle(article);

  console.log("✅ Статья создана");
  console.log(`Title: ${title}`);
  console.log(`Slug: ${slug}`);
  console.log(`Category: ${category}`);
  console.log(`Article: ${articlePath}`);
  console.log(`Image: ${image}`);
  console.log(`Prompt: ${promptPath}`);
}

main();