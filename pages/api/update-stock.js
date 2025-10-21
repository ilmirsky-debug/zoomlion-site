import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не разрешён" });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "stock", "stock.json");
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2), "utf8");
    return res.status(200).json({ message: "Файл успешно обновлён" });
  } catch (err) {
    console.error("Ошибка записи файла:", err);
    return res.status(500).json({ error: "Ошибка при сохранении файла" });
  }
}
