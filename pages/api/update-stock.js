import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не разрешён" });
  }

  try {
    // === 1. Подготовка данных ===
    const data = JSON.stringify(req.body, null, 2);
    const filePath = path.join(process.cwd(), "public", "stock", "stock.json");

    // === 2. Сохраняем локально (для localhost) ===
    fs.writeFileSync(filePath, data, "utf-8");

    // === 3. Отправляем изменения в GitHub ===
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO = process.env.GITHUB_REPO;
    const FILE_PATH = process.env.GITHUB_FILE_PATH;
    const BRANCH = process.env.GITHUB_BRANCH || "main";

    const url = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

    // Получаем текущее состояние файла (нужно для SHA)
    const currentFile = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    }).then((r) => r.json());

    // === 4. Обновляем содержимое ===
    const update = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        message: "Обновление stock.json через админку",
        content: Buffer.from(data).toString("base64"),
        sha: currentFile.sha,
        branch: BRANCH,
      }),
    });

    if (!update.ok) {
      const errorText = await update.text();
      console.error("GitHub error:", errorText);
      return res.status(500).json({ error: "Ошибка обновления на GitHub" });
    }

    return res.status(200).json({ message: "✅ Файл успешно обновлён" });
  } catch (err) {
    console.error("Ошибка обновления stock.json:", err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
}
