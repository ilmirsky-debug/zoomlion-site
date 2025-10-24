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

    if (!token || !chatId) {
      console.error("❌ Не задан TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID");
      return res.status(500).json({ error: "Нет Telegram-конфигурации" });
    }

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const data = await tgRes.json();

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
