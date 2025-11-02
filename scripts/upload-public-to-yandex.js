import "dotenv/config";
import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const bucket = process.env.YANDEX_BUCKET;
const endpoint = process.env.YANDEX_ENDPOINT;
const accessKeyId = process.env.YANDEX_ACCESS_KEY_ID;
const secretAccessKey = process.env.YANDEX_SECRET_ACCESS_KEY;

if (!bucket || !endpoint || !accessKeyId || !secretAccessKey) {
  console.error("❌ Ошибка: не найдены переменные окружения для Yandex Object Storage");
  process.exit(1);
}

// ✅ Создаем клиент S3 для Яндекс Облака
const s3 = new S3Client({
  region: "ru-central1",
  endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  signingRegion: "ru-central1",
});

// 📂 Папка public
const publicDir = path.join(process.cwd(), "public");

async function uploadFile(filePath, key) {
  const fileContent = fs.readFileSync(filePath);

  const uploadParams = {
    Bucket: bucket,
    Key: key,
    Body: fileContent,
    ContentType: getContentType(filePath),
  };

  try {
    await s3.send(new PutObjectCommand(uploadParams));
    console.log(`✅ Успешно загружен: ${key}`);
  } catch (err) {
    console.error(`❌ Ошибка при загрузке ${key}:`, err.message);
  }
}

// Определяем тип файла по расширению
function getContentType(filePath) {
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".webp")) return "image/webp";
  if (filePath.endsWith(".json")) return "application/json";
  return "application/octet-stream";
}

// 🚫 Исключаем папку "stock"
async function uploadAll() {
  console.log(`🪣 Загружаем файлы из ${publicDir} в бакет "${bucket}"...`);
  const allFiles = getAllFiles(publicDir).filter(f => !f.includes("\\stock\\"));

  for (const file of allFiles) {
    const key = file.replace(publicDir + "\\", "").replace(/\\/g, "/");
    await uploadFile(file, key);
  }

  console.log("🎉 Загрузка всех public-файлов завершена!");
}

// Рекурсивный поиск файлов
function getAllFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

// 🚀 Запуск
uploadAll();
