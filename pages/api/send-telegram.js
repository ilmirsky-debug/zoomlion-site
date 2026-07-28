import https from "https";
import dns from "dns";

const telegramHttpsAgent = new https.Agent({
  keepAlive: true,
});

const telegramLookup = (hostname, options, callback) => {
  if (hostname === "api.telegram.org") {
    return callback(null, "149.154.167.220", 4);
  }

  return dns.lookup(hostname, options, callback);
};
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { name, phone, comment, product } = req.body;

  const message = `
📦 *Новая заявка Zoomlion*
👤 Имя: ${name}
📞 Телефон: ${phone}
📝 Комментарий: ${comment || "—"}
${product ? `🚜 Товар: ${product}` : ""}
`;

  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
console.log("BOT TOKEN:", process.env.TELEGRAM_BOT_TOKEN ? "✅ Есть" : "❌ Нет");
console.log("CHAT ID:", process.env.TELEGRAM_CHAT_ID ? "✅ Есть" : "❌ Нет");


    if (!token || !chatId) {
      console.error("❌ Не задан TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID");
      return res.status(500).json({ error: "Нет Telegram-конфигурации" });
    }

    const data = await new Promise((resolve, reject) => {
  const body = JSON.stringify({
    chat_id: chatId,
    text: message,
    parse_mode: "Markdown",
  });

  const req = https.request(
    {
      hostname: "149.154.167.220",
      port: 443,
      servername: "api.telegram.org",
      path: `/bot${token}/sendMessage`,
      method: "POST",
      agent: telegramHttpsAgent,
      headers: {
        Host: "api.telegram.org",
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    },
    (response) => {
      let result = "";

      response.on("data", (chunk) => {
        result += chunk;
      });

      response.on("end", () => {
        try {
          const parsed = JSON.parse(result);

console.log("Telegram response:", parsed);

resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    }
  );

  req.on("error", reject);

  req.write(body);
  req.end();
});

    if (data.ok) {
      return res.status(200).json({ ok: true });
    } else {
      console.error("Ошибка Telegram API:", data);
      return res.status(500).json({ error: "Ошибка Telegram API" });
    }
  } catch (error) {
    console.error("Ошибка при отправке:", error);
    return res.status(500).json({ error: "Ошибка при отправке" });
  }
}
