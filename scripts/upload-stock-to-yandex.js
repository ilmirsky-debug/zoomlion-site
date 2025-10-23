import "dotenv/config";
import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const bucket = process.env.YANDEX_BUCKET;
const endpoint = process.env.YANDEX_ENDPOINT;
const accessKeyId = process.env.YANDEX_ACCESS_KEY_ID;
const secretAccessKey = process.env.YANDEX_SECRET_ACCESS_KEY;

// Проверка окружения
if (!bucket || !endpoint || !accessKeyId || !secretAccessKey) {
  console.error("❌ Ошибка: не найдены переменные окружения для Yandex Object Storage");
  process.exit(1);
}

// Создаем клиент S3
const s3 = new S3Client({
  region: "ru-central1",
  endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// 📁 Папка public (всё, кроме stock)
const publicDir = path.join(process.cwd(), "public");

async function uploadFile(filePath, key) {
  const fileContent = fs.readFileSync(filePath);
  const contentType =
    key.endsWith(".png") ? "image/png" :
    key.endsWith(".gif") ? "image/gif" :
    "image/jpeg";

  const uploadParams = {
    Bucket: bucket,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
  };

  try {
    await s3.send(new PutObjectCommand(uploadParams));
    console.log(`✅ Успешно загружен: ${key}`);
  } catch (err) {
    console.error(`❌ Ошибка при загрузке ${key}:`, err.message);
  }
}

async function uploadAll(dir, prefix = "") {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      if (item === "stock") continue; // пропускаем stock
      await uploadAll(fullPath, `${prefix}${item}/`);
    } else {
      const key = `${prefix}${item}`;
      await uploadFile(fullPath, key);
    }
  }
}

async function main() {
  console.log(`🪣 Загружаем файлы из public (кроме /stock) в бакет "${bucket}"...`);
  await uploadAll(publicDir);
  console.log("🎉 Загрузка завершена!");
}

main();
