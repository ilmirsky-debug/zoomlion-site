const TelegramBot = require("node-telegram-bot-api");
const { exec } = require("child_process");
let waitingForTopic = false;
let waitingForEdit = false;
let waitingForAiEdit = false;
let waitingForImage = false;
let lastDraftSlug = "";
const token = "8472643401:AAELIRA7dMkVHNCU4q4gAtFD5JTfmjHx0hU";

const bot = new TelegramBot(token, { polling: true });
function loadArticle(slug) {
  const articlePath = `/home/zoomlion-server/zoomlion-site/content/blog/${slug}.js`;
  delete require.cache[require.resolve(articlePath)];
  const articleFile = require(articlePath);
  return { articlePath, article: articleFile.article };
}

function saveArticle(articlePath, article) {
  const fs = require("fs");
  fs.writeFileSync(
    articlePath,
    `export const article = ${JSON.stringify(article, null, 2)};\n`
  );
}

function makePreview(article) {
  const sections = (article.sections || [])
    .map((section, index) => `${index + 1}. ${section.title}`)
    .join("\n");

  const keywords = (article.keywords || [])
    .slice(0, 10)
    .map((keyword) => `• ${keyword}`)
    .join("\n");

  const faqCount = article.faq ? article.faq.length : 0;

  return (
    `📝 Обновлённый черновик\n\n` +
    `Заголовок:\n${article.title}\n\n` +
    `Описание:\n${article.description}\n\n` +
    `Ключевые слова:\n${keywords}\n\n` +
    `Разделы:\n${sections}\n\n` +
    `FAQ: ${faqCount} вопросов\n\n` +
    `Будущий URL:\nhttps://zoomliontrade.ru/blog/${article.slug}`
  );
}

function applyHumanEdits(article, editText) {
  const lower = editText.toLowerCase();

  if (lower.includes("ключев")) {
    const afterColon = editText.split(":").slice(1).join(":");
    const rawKeywords = afterColon || editText;

    const newKeywords = rawKeywords
      .split(/[,;\n]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 2)
      .filter((item) => !item.toLowerCase().includes("добавь"))
      .filter((item) => !item.toLowerCase().includes("ключев"));

    article.keywords = Array.from(
      new Set([...(article.keywords || []), ...newKeywords])
    );
  }

  const removeTitleMatch = editText.match(/убери слово\s+«?([^».\n]+)»?\s+из заголовка/i);
  if (removeTitleMatch) {
    const phrase = removeTitleMatch[1].trim();
    article.title = article.title.replace(new RegExp(phrase, "gi"), "").replace(/\s+/g, " ").trim();
  }

  const sectionMatch = editText.match(/добавь раздел про\s+([^.\n]+)/i);
  if (sectionMatch) {
    const topic = sectionMatch[1].trim();

    article.sections = article.sections || [];
    article.sections.push({
      title: topic.charAt(0).toUpperCase() + topic.slice(1),
      text: [
        `Раздел «${topic}» важен при выборе техники, потому что напрямую влияет на расходы, удобство эксплуатации и стабильность работы.`,
        `Перед покупкой стоит заранее оценить доступность сервиса, условия поставки, сроки обслуживания и наличие запасных частей. Это помогает снизить риск простоев и точнее рассчитать стоимость владения.`,
      ],
    });
  }

  if (lower.includes("надежност") || lower.includes("надёжност")) {
    article.content = article.content || [];
    article.content.push(
      "Отдельное внимание стоит уделить надёжности техники Zoomlion. Для бизнеса важна не только цена покупки, но и стабильная работа оборудования, доступность обслуживания и минимальные простои в сезон высокой нагрузки."
    );
  }

  article.editorNotes = article.editorNotes || [];
  article.editorNotes.push({
    date: new Date().toISOString(),
    text: editText,
  });

  return article;
}

// тест
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🤖 Бот готов к работе.", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Проверить сборку", callback_data: "check_build" },
        ],
[
  { text: "📝 Новая статья", callback_data: "new_article" },
],
        [
          { text: "🟢 Опубликовать", callback_data: "publish" },
          { text: "❌ Отклонить", callback_data: "reject" },
        ],
      ],
    },
  });
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;

if (query.data === "publish") {
  await bot.sendMessage(chatId, "🚀 Начинаю публикацию сайта...");

  exec(
    "cd /home/zoomlion-server/zoomlion-site && git pull origin main && npm run build && pm2 restart zoomlion-site",
    async (error, stdout, stderr) => {
      if (error) {
        await bot.sendMessage(
          chatId,
          "❌ Ошибка публикации.\n\n" + (stderr || stdout).slice(0, 3000)
        );
      } else {
        await bot.sendMessage(
          chatId,
          "✅ Сайт успешно опубликован и перезапущен."
        );
      }
    }
  );
}

if (query.data === "edit_draft") {
  if (!lastDraftSlug) {
    await bot.sendMessage(chatId, "❌ Нет активного черновика для правок.");
  } else {
    waitingForAiEdit = true;

    await bot.sendMessage(
      chatId,
      "✏️ Напиши правки обычным сообщением.\n\nНапример:\nУбери слово «переплачивать» из заголовка. Добавь раздел про сервис и запчасти. Добавь ключевые слова: мини-погрузчик цена, Zoomlion ZS080V купить."
    );
  }
}  
if (query.data === "ai_edit") {
  if (!lastDraftSlug) {
    await bot.sendMessage(chatId, "❌ Нет активного черновика для ИИ-доработки.");
  } else {
    waitingForAiEdit = true;

    await bot.sendMessage(
      chatId,
      "🧠 Напиши, что именно доработать с помощью ИИ..."
    );
  }
}

if (query.data === "attach_image") {
  if (!lastDraftSlug) {
    await bot.sendMessage(chatId, "❌ Нет активного черновика.");
  } else {
    const { article } = loadArticle(lastDraftSlug);

    const prompt =
      `Create a realistic professional commercial image for a blog article.\n\n` +
      `Topic: ${article.title}\n\n` +
      `Image requirements:\n` +
      `- photorealistic construction or warehouse machinery scene\n` +
      `- modern Zoomlion-style green industrial equipment\n` +
      `- clean background, professional advertising look\n` +
      `- no text on image\n` +
      `- no watermark\n` +
      `- no people close-up\n` +
      `- 16:9 aspect ratio\n` +
      `- high detail\n` +
      `- suitable for a business blog hero image\n` +
      `- natural daylight\n` +
      `- realistic proportions`;

        await bot.sendMessage(
      chatId,
      `🖼 Промпт для изображения:\n\n${prompt}\n\n` +
        `Сохрани готовую картинку под именем:\n\n` +
        `public/blog/${lastDraftSlug}.jpg\n\n` +
        `В статье должно быть:\n` +
        `/blog/${lastDraftSlug}.jpg`
    );
  }
}

if (query.data === "reject") {
  await bot.sendMessage(chatId, "❌ Отклонено.");
}
if (query.data === "new_article") {
  waitingForTopic = true;

  await bot.sendMessage(
    chatId,
    "📝 Напиши тему новой статьи.\n\nНапример:\nКак выбрать телескопический погрузчик"
  );
}
if (query.data === "publish_draft") {
  await bot.sendMessage(chatId, "🚀 Публикую черновик...");

  exec(
    'cd /home/zoomlion-server/zoomlion-site && git add . && git commit -m "Add generated blog article" || true && git push origin main && npm run build',
    async (error, stdout, stderr) => {
      if (error) {
        await bot.sendMessage(
          chatId,
          "❌ Ошибка публикации черновика.\n\n" + (stderr || stdout).slice(0, 3000)
        );
      } else {
        await bot.sendMessage(
  chatId,
  "✅ Черновик опубликован. Перезапускаю сайт..."
);

exec(
  "pm2 restart zoomlion-site",
  async () => {
    await bot.sendMessage(chatId, "✅ Сайт перезапущен.");
  }
);
      }
    }
  );
}  
bot.answerCallbackQuery(query.id);
});
bot.on("message", async (msg) => {
if (waitingForImage && msg.photo) {
  waitingForImage = false;

  if (!lastDraftSlug) {
    await bot.sendMessage(msg.chat.id, "❌ Нет активного черновика.");
    return;
  }

  await bot.sendMessage(msg.chat.id, "📥 Получил изображение. Сохраняю...");

  const fs = require("fs");
  const https = require("https");

  const photo = msg.photo[msg.photo.length - 1];
  const file = await bot.getFile(photo.file_id);
  const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

  const imagePath = `/home/zoomlion-server/zoomlion-site/public/blog/${lastDraftSlug}.jpg`;
  const imageUrl = `/blog/${lastDraftSlug}.jpg`;

  fs.mkdirSync("/home/zoomlion-server/zoomlion-site/public/blog", {
    recursive: true,
  });

  const downloadFile = () =>
    new Promise((resolve, reject) => {
      const out = fs.createWriteStream(imagePath);

      https
        .get(fileUrl, (response) => {
          response.pipe(out);
          out.on("finish", () => {
            out.close(resolve);
          });
        })
        .on("error", reject);
    });

  await downloadFile();

  const { articlePath, article } = loadArticle(lastDraftSlug);
  article.image = imageUrl;
  saveArticle(articlePath, article);

  await bot.sendMessage(
    msg.chat.id,
    `✅ Изображение прикреплено к статье:\n${imageUrl}`
  );

  return;
}
if (msg.text === "/imageprompt") {
  if (!lastDraftSlug) {
    await bot.sendMessage(msg.chat.id, "❌ Нет активного черновика.");
    return;
  }

  const { article } = loadArticle(lastDraftSlug);

  const prompt =
    `Create a realistic professional commercial image for a blog article.\n\n` +
    `Topic: ${article.title}\n\n` +
    `Image requirements:\n` +
    `- photorealistic construction or warehouse machinery scene\n` +
    `- modern Zoomlion-style green industrial equipment\n` +
    `- clean background, professional advertising look\n` +
    `- no text on image\n` +
    `- no watermark\n` +
    `- no people close-up\n` +
    `- 16:9 aspect ratio\n` +
    `- high detail\n` +
    `- suitable for a business blog hero image\n` +
    `- natural daylight\n` +
    `- realistic proportions`;

  await bot.sendMessage(msg.chat.id, prompt);

  return;
}
if (waitingForAiEdit) {
  if (!msg.text) return;

  waitingForAiEdit = false;

  if (!lastDraftSlug) {
    await bot.sendMessage(msg.chat.id, "❌ Нет активного черновика.");
    return;
  }

  await bot.sendMessage(
    msg.chat.id,
    "🧠 ИИ-доработка запущена. Это может занять 1–3 минуты..."
  );

  const { articlePath, article } = loadArticle(lastDraftSlug);

  exec(
    `cd /home/zoomlion-server/zoomlion-site && timeout 180s node scripts/ai-edit-article.js '${JSON.stringify(article).replace(/'/g, "'\\''")}' '${msg.text.replace(/'/g, "'\\''")}'`,
    async (error, stdout, stderr) => {
      if (error) {
        await bot.sendMessage(
          msg.chat.id,
          "❌ ИИ не успел или не смог применить правки.\n\n" +
            (stderr || stdout || String(error)).slice(0, 1500)
        );
        return;
      }

      try {
        const updatedArticle = JSON.parse(stdout);
        saveArticle(articlePath, updatedArticle);

        await bot.sendMessage(msg.chat.id, makePreview(updatedArticle).slice(0, 3900), {
          reply_markup: {
            inline_keyboard: [
              [{ text: "🟢 Опубликовать черновик", callback_data: "publish_draft" }],
              [{ text: "✏️ Внести правки", callback_data: "edit_draft" }],
              [{ text: "🧠 ИИ-доработка", callback_data: "ai_edit" }],
[
  { text: "🖼 Изображение", callback_data: "attach_image" },
],              
[{ text: "❌ Отклонить", callback_data: "reject" }],
            ],
          },
        });
      } catch (parseError) {
        await bot.sendMessage(
          msg.chat.id,
          "❌ ИИ вернул некорректный JSON.\n\n" + stdout.slice(0, 1500)
        );
      }
    }
  );

  return;
}  
if (waitingForEdit) {
  if (!msg.text) return;

  waitingForEdit = false;

  if (!lastDraftSlug) {
    await bot.sendMessage(msg.chat.id, "❌ Нет активного черновика.");
    return;
  }

  try {
    const { articlePath, article } = loadArticle(lastDraftSlug);
    const updatedArticle = applyHumanEdits(article, msg.text);
saveArticle(articlePath, updatedArticle);

    await bot.sendMessage(msg.chat.id, makePreview(updatedArticle).slice(0, 3900), {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🟢 Опубликовать черновик", callback_data: "publish_draft" }],
          [{ text: "✏️ Внести правки", callback_data: "edit_draft" }],
[{ text: "🧠 ИИ-доработка", callback_data: "ai_edit" }],
[{ text: "🖼 Изображение", callback_data: "attach_image" }],
          [{ text: "❌ Отклонить", callback_data: "reject" }],
        ],
      },
    });
  } catch (error) {
    await bot.sendMessage(
      msg.chat.id,
      "❌ Не удалось применить правки.\n\n" + String(error).slice(0, 1000)
    );
  }

  return;
}

  if (msg.text && msg.text.startsWith("/keywords ")) {
    if (!lastDraftSlug) {
      await bot.sendMessage(msg.chat.id, "❌ Нет активного черновика.");
      return;
    }

  const newKeywords = msg.text
    .replace("/keywords", "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);

  const articlePath = `/home/zoomlion-server/zoomlion-site/content/blog/${lastDraftSlug}.js`;

  delete require.cache[require.resolve(articlePath)];
  const articleFile = require(articlePath);
  const article = articleFile.article;

  article.keywords = Array.from(
    new Set([...(article.keywords || []), ...newKeywords])
  );

  const fs = require("fs");

  fs.writeFileSync(
    articlePath,
    `export const article = ${JSON.stringify(article, null, 2)};\n`
  );

  await bot.sendMessage(
    msg.chat.id,
    `✅ Ключевые слова добавлены:\n\n${newKeywords.map((k) => "• " + k).join("\n")}`
  );

  return;
}  
if (!waitingForTopic) return;
  if (!msg.text) return;
  if (msg.text.startsWith("/")) return;

  waitingForTopic = false;

  await bot.sendMessage(
    msg.chat.id,
    `⏳ Тема принята:\n\n${msg.text}\n\nСоздаю черновик статьи...`
  );

  exec(
    `cd /home/zoomlion-server/zoomlion-site && node scripts/generate-article.js "${msg.text}"`,
    async (error, stdout, stderr) => {
      if (error) {
        await bot.sendMessage(
          msg.chat.id,
          "❌ Ошибка создания статьи.\n\n" + (stderr || stdout).slice(0, 3000)
        );
            } else {
        const slugMatch = stdout.match(/Slug:\s*(.+)/);
        const slug = slugMatch ? slugMatch[1].trim() : "";
lastDraftSlug = slug;
        const articlePath = slug
          ? `/home/zoomlion-server/zoomlion-site/content/blog/${slug}.js`
          : null;

        let preview = "✅ Черновик статьи создан.\n\n" + stdout.slice(0, 1000);

        if (articlePath) {
          const articleFile = require(articlePath);
          const article = articleFile.article;

          const sections = article.sections
            .map((section, index) => `${index + 1}. ${section.title}`)
            .join("\n");

          const keywords = article.keywords
            .slice(0, 8)
            .map((keyword) => `• ${keyword}`)
            .join("\n");

          const faqCount = article.faq ? article.faq.length : 0;

          preview =
            `📝 Черновик статьи создан\n\n` +
            `Заголовок:\n${article.title}\n\n` +
            `Описание:\n${article.description}\n\n` +
            `Ключевые слова:\n${keywords}\n\n` +
            `Разделы:\n${sections}\n\n` +
            `FAQ: ${faqCount} вопросов\n\n` +
            `Будущий URL:\nhttps://zoomliontrade.ru/blog/${article.slug}`;
        }

        await bot.sendMessage(msg.chat.id, preview.slice(0, 3900), {
          reply_markup: {
            inline_keyboard: [
             [
  { text: "🟢 Опубликовать черновик", callback_data: "publish_draft" },
],
[
  { text: "✏️ Внести правки", callback_data: "edit_draft" },
],
[
  { text: "🧠 ИИ-доработка", callback_data: "ai_edit" },
],
[{ text: "🖼 Изображение", callback_data: "attach_image" }],
[
  { text: "❌ Отклонить", callback_data: "reject" },
],
            ],
          },
        });
      }
    }
  );
});

