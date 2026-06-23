async function main() {
  const article = JSON.parse(process.argv[2]);
  const instructions = process.argv[3];

  const prompt = `
Ты SEO-редактор сайта Zoomlion Trade.

Тебе передана статья в JSON и правки редактора.

Задача:
- применить правки к статье;
- сохранить структуру JSON;
- не удалять поля slug, title, description, excerpt, category, date, image, keywords, content, sections, faq;
- если просят добавить раздел — добавь его в sections;
- если просят добавить ключевые слова — добавь их в keywords;
- если просят изменить заголовок — измени title;
- верни ТОЛЬКО валидный JSON без markdown.

Статья:
${JSON.stringify({
  slug: article.slug,
  title: article.title,
  description: article.description,
  excerpt: article.excerpt,
  category: article.category,
  image: article.image,
  keywords: article.keywords,
  content: article.content,
  sections: article.sections,
  faq: article.faq,
})}

Правки редактора:
${instructions}
`;

  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "qwen2.5:1.5b",
      prompt,
      stream: false,
      format: "json",
      options: {
        temperature: 0.2,
      },
    }),
  });

  const data = await response.json();
  console.log(data.response);
}

main();
