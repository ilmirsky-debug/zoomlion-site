import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // путь до stock.json
    const filePath = path.join(process.cwd(), "public", "stock", "stock.json");
console.log("📁 Сохраняем файл в:", filePath);


    if (req.method === "POST") {
      fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2), "utf-8");
      console.log("✅ Stock.json успешно обновлён!");
      return res.status(200).json({ message: "Stock updated successfully" });
    }

    if (req.method === "GET") {
      const data = fs.readFileSync(filePath, "utf-8");
      return res.status(200).json(JSON.parse(data));
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });

  } catch (err) {
    console.error("❌ Ошибка при работе с stock.json:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}
