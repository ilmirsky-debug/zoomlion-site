const { exec, execFile } = require("child_process");

const PROJECT_DIR = "/home/zoomlion-server/zoomlion-site";

global.telegramState = global.telegramState || {
  waitingForTopic: {},
};

async function sendMessage(chatId, text, options = {}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      ...options,
    }),
  });
}

async function answerCallbackQuery(callbackQueryId) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
    }),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true });
  }

  const update = req.body;
res.status(200).json({ ok: true });
  try {
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const text = msg.text || "";

      if (text === "/start") {
        await sendMessage(chatId, "🤖 Бот готов к работе.", {
          reply_markup: {
            inline_keyboard: [
              [{ text: "📝 Новая статья", callback_data: "new_article" }],
              [{ text: "✅ Проверить сборку", callback_data: "check_build" }],
              [
                { text: "🟢 Опубликовать", callback_data: "publish" },
                { text: "❌ Отклонить", callback_data: "reject" },
              ],
            ],
          },
        });
      }

      if (global.telegramState.waitingForTopic[chatId]) {
        if (!text || text.startsWith("/")) {
          return res.status(200).json({ ok: true });
        }

        global.telegramState.waitingForTopic[chatId] = false;

        await sendMessage(
          chatId,
          `⏳ Тема принята:\n\n${text}\n\nСоздаю черновик статьи...`
        );

        execFile(
          "node",
          ["scripts/generate-article.js", text],
          { cwd: PROJECT_DIR },
          async (error, stdout, stderr) => {
            if (error) {
              await sendMessage(
                chatId,
                "❌ Ошибка создания статьи.\n\n" + (stderr || stdout).slice(0, 3000)
              );
            } else {
              await sendMessage(
                chatId,
                "✅ Черновик статьи создан.\n\n" + stdout.slice(0, 3000),
                {
                  reply_markup: {
                    inline_keyboard: [
                      [
                        {
                          text: "🟢 Опубликовать черновик",
                          callback_data: "publish_draft",
                        },
                      ],
                      [{ text: "❌ Отклонить", callback_data: "reject" }],
                    ],
                  },
                }
              );
            }
          }
        );
      }
    }

    if (update.callback_query) {
      const query = update.callback_query;
      const chatId = query.message.chat.id;

      await answerCallbackQuery(query.id);

      if (query.data === "new_article") {
        global.telegramState.waitingForTopic[chatId] = true;

        await sendMessage(
          chatId,
          "📝 Напиши тему новой статьи.\n\nНапример:\nКак выбрать телескопический погрузчик"
        );
      }

      if (query.data === "check_build") {
        await sendMessage(chatId, "⏳ Проверяю сборку...");

        exec(`cd ${PROJECT_DIR} && npm run build`, async (error, stdout, stderr) => {
          if (error) {
            await sendMessage(
              chatId,
              "❌ Сборка завершилась с ошибкой.\n\n" + (stderr || stdout).slice(0, 3000)
            );
          } else {
            await sendMessage(chatId, "✅ Сборка успешно прошла.");
          }
        });
      }

      if (query.data === "publish_draft") {
        await sendMessage(chatId, "🚀 Публикую черновик...");

        exec(
          `cd ${PROJECT_DIR} && git add . && (git commit -m "Add generated blog article" || true) && git push origin main && npm run build && pm2 restart zoomlion-site`,
          async (error, stdout, stderr) => {
            if (error) {
              await sendMessage(
                chatId,
                "❌ Ошибка публикации черновика.\n\n" + (stderr || stdout).slice(0, 3000)
              );
            } else {
              await sendMessage(chatId, "✅ Черновик опубликован. Сайт обновлён.");
            }
          }
        );
      }

      if (query.data === "publish") {
        await sendMessage(chatId, "🚀 Начинаю публикацию сайта...");

        exec(
          `cd ${PROJECT_DIR} && git pull origin main && npm run build && pm2 restart zoomlion-site`,
          async (error, stdout, stderr) => {
            if (error) {
              await sendMessage(
                chatId,
                "❌ Ошибка публикации.\n\n" + (stderr || stdout).slice(0, 3000)
              );
            } else {
              await sendMessage(chatId, "✅ Сайт успешно опубликован и перезапущен.");
            }
          }
        );
      }

      if (query.data === "reject") {
        await sendMessage(chatId, "❌ Отклонено.");
      }
    }

return;
} catch (error) {
  console.error(error);
  return;
}
}
