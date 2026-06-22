const TelegramBot = require("node-telegram-bot-api");
const { exec } = require("child_process");
let waitingForTopic = false;
const token = "8472643401:AAELIRA7dMkVHNCU4q4gAtFD5JTfmjHx0hU";

const bot = new TelegramBot(token, { polling: true });

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
    'cd /home/zoomlion-server/zoomlion-site && git add . && git commit -m "Add generated blog article" && git push origin main && npm run build && pm2 restart zoomlion-site',
    async (error, stdout, stderr) => {
      if (error) {
        await bot.sendMessage(
          chatId,
          "❌ Ошибка публикации черновика.\n\n" + (stderr || stdout).slice(0, 3000)
        );
      } else {
        await bot.sendMessage(
          chatId,
          "✅ Черновик опубликован. Сайт обновлён."
        );
      }
    }
  );
}  
bot.answerCallbackQuery(query.id);
});
bot.on("message", async (msg) => {
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
        await bot.sendMessage(
  msg.chat.id,
  "✅ Черновик статьи создан.\n\n" + stdout.slice(0, 3000),
  {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🟢 Опубликовать черновик", callback_data: "publish_draft" },
        ],
        [
          { text: "❌ Отклонить", callback_data: "reject" },
        ],
      ],
    },
  }
);
      }
    }
  );
});
