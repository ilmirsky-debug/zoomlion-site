function makeArticlePrompt(title, category, keywords) {
  return `
Ты профессиональный SEO-копирайтер и эксперт по строительной технике.

Напиши статью в формате JSON.

Тема:

${title}

Категория:

${category}

Основной ключ:

${keywords[0]}

Дополнительные ключевые слова:

${keywords.join(", ")}

Требования:

— русский язык
— экспертный стиль
— без воды
— 1800–2500 слов
— уникальный текст
— без рекламы
— использовать естественные синонимы

Верни только JSON.

Формат:

{
"title":"",
"description":"",
"excerpt":"",
"sections":[
{
"title":"",
"text":[
"",
"",
""
]
}
],
"faq":[
{
"question":"",
"answer":""
}
]
}
`;
}

module.exports = {
  makeArticlePrompt,
};