/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },

  // ✅ добавляем поддержку картинок из внешнего хранилища (Yandex Cloud)
  images: {
    domains: ["storage.yandexcloud.net"], // Разрешаем загрузку оттуда
    formats: ["image/avif", "image/webp"], // Позволяем Next использовать современные форматы
  },
};

export default nextConfig;




