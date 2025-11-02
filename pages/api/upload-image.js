import formidable from "formidable";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new S3Client({
  region: "ru-central1",
  endpoint: process.env.YANDEX_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.YANDEX_ACCESS_KEY_ID,
    secretAccessKey: process.env.YANDEX_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не разрешён" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Ошибка парсинга формы:", err);
      return res.status(500).json({ error: "Ошибка при обработке формы" });
    }

    const file = files.file[0];
    const fileStream = fs.createReadStream(file.filepath);
    const fileName = `stock/${file.originalFilename}`;

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.YANDEX_BUCKET,
          Key: fileName,
          Body: fileStream,
          ContentType: file.mimetype,
        })
      );

      const fileUrl = `https://${process.env.YANDEX_BUCKET}.storage.yandexcloud.net/${fileName}`;
      return res.status(200).json({ url: fileUrl });
    } catch (error) {
      console.error("Ошибка загрузки в Yandex:", error);
      return res.status(500).json({ error: "Ошибка при загрузке в Yandex" });
    }
  });
}
