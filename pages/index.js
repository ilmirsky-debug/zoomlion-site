import { useEffect, useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";

export default function Home() {
  const [stockData, setStockData] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [heroDarkness, setHeroDarkness] = useState(0);
  const [modalImageIndex, setModalImageIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const loadStock = async () => {
      try {
        const res = await fetch(
          "https://storage.yandexcloud.net/zoomlion-files/stock/stock.json",
          { cache: "no-store" }
        );
        const data = await res.json();
        setStockData(data);
      } catch (err) {
        console.error("Ошибка загрузки stock.json:", err);
      }
    };
    loadStock();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 10);
      setHeroDarkness(Math.min(scrollY / 400, 0.4));
    };

    window.addEventListener("scroll", handleScroll);
    const handleKey = (e) => e.key === "Escape" && setModalImageIndex(null);
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  // ✅ Список техники
  const products = [
    {
      title: "Вилочные погрузчики",
      desc: "Грузоподъёмность от 1 до 18 тонн. Электрические и дизельные модели.",
      img: "/forklift.jpg",
    },
    {
      title: "Ножничные подъемники",
      desc: "Высота подъёма до 12 м. Надёжная платформа для работы на высоте.",
      img: "/lift.jpg",
    },
    {
      title: "Телескопические подъемники",
      desc: "Грузоподъёмность до 500 кг. Большой вылет стрелы.",
      img: "/telescopic.jpg",
    },
    {
      title: "Коленчатые подъемники",
      desc: "Рабочая высота до 18 метров. Отличная манёвренность.",
      img: "/articulating-boom.jpg",
    },
    {
      title: "Телескопические погрузчики",
      desc: "Грузоподъёмность до 3 тонн. Многофункциональные решения.",
      img: "/telehandler.jpg",
    },
    {
      title: "Навесное оборудование",
      desc: "Широкий ассортимент навесного для любых задач.",
      img: "/attachments.jpg",
    },
  ];

  // ✅ Возвращаем всю разметку (теперь один return)
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Head>
        <title>Zoomlion Trade — Вилочные погрузчики и подъёмники в России</title>
        <meta
          name="description"
          content="Официальный дилер Zoomlion в России. Вилочные погрузчики, подъёмники и складская техника с гарантией. Доставка по всей России."
        />
        <meta
          name="keywords"
          content="Zoomlion, погрузчики, подъёмники, складская техника, вилочный погрузчик, подъемники, дилер Zoomlion Россия, купить Zoomlion"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Zoomlion Trade — Вилочные погрузчики и подъёмники в России" />
        <meta
          property="og:description"
          content="Официальный дилер Zoomlion в России. Погрузчики и складская техника в наличии. Гарантия и доставка по всей стране."
        />
        <meta property="og:image" content="https://zoomliontrade.ru/og-image.png" />
        <meta property="og:url" content="https://zoomliontrade.ru" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ru_RU" />

        {/* Для Telegram / Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zoomlion Trade — Вилочные погрузчики и подъёмники в России" />
        <meta
          name="twitter:description"
          content="Официальный дилер Zoomlion. Надёжность, гарантия и доставка по всей России."
        />
        <meta name="twitter:image" content="https://zoomliontrade.ru/og-image.png" />

{/* --- Структурированные данные для SEO --- */}
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Zoomlion Trade",
      legalName: "ООО «Альфа Трейд»",
      url: "https://zoomliontrade.ru",
      logo: "https://zoomliontrade.ru/favicon.png",
      description:
        "Официальный дилер Zoomlion в России. Вилочные погрузчики, подъёмники и складская техника. Гарантия, сервис и доставка по всей России.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "RU",
        addressLocality: "Набережные Челны",
        streetAddress: "Производственный проезд, д. 3",
        postalCode: "423800",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+7 (937) 584-45-55",
        contactType: "sales",
        areaServed: "RU",
        availableLanguage: ["Russian"],
      },
    }),
  }}
/>

      </Head>

      {/* ===== ШАПКА ===== */}
<header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm">
  <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">
    {/* Явно указываем маленький логотип */}
    <img
      src="/logo.png"
      alt="Zoomlion"
      className="block h-10 w-auto object-contain"
      style={{ maxWidth: 220 }}
    />

    {/* Навигация — теперь должна поместиться */}
    <nav className="flex items-center gap-6 text-gray-800 font-medium text-sm">
      <a href="#products" className="hover:text-lime-600 transition">Продукция</a>
      <a href="#features" className="hover:text-lime-600 transition">Преимущества</a>
      <a href="#service" className="hover:text-lime-600 transition">Сервис</a>
      <a href="#contacts" className="hover:text-lime-600 transition">Контакты</a>
    </nav>
  </div>
</header>

{/* ===== HERO ===== */}
<section
  id="hero"
  className="relative flex flex-col items-center justify-center text-center text-white overflow-hidden pt-28 pb-16"
>
  {/* Анимированный GIF */}
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <img
      src="https://storage.yandexcloud.net/zoomlion-files/zoomlion-animated.gif"
      alt="Анимированный логотип Zoomlion"
      className="max-w-[700px] w-[70%] h-auto object-contain opacity-90 translate-y-10"
      loading="lazy"
      style={{ zIndex: 0 }}
    />
  </div>

  {/* Полупрозрачный тёмный слой */}
  <div className="absolute inset-0 bg-black/35" style={{ zIndex: 1 }} />

  {/* Текст */}
  <div className="relative z-10 max-w-3xl mx-auto px-6">
    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg leading-tight">
      Профессиональная складская техника{" "}
      <span className="text-lime-400">Zoomlion</span>
    </h1>

    <p className="text-lg text-gray-100 mb-8 drop-shadow-md">
      Официальный дилер в России. Надёжность, производительность и сервис.
    </p>

    <a
      href="#contacts"
      className="inline-block bg-lime-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-lime-300 transition"
    >
      Получить консультацию
    </a>
  </div>
</section>


      {/* ===== ТЕХНИКА В НАЛИЧИИ ===== */}
      <section id="stock" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-stone-900 mb-12">
            Техника в наличии
          </h2>

          {stockData.length === 0 ? (
            <p className="text-center text-gray-500">Загрузка данных...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {stockData.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -6 }}
                  className="bg-stone-50 rounded-2xl p-6 shadow-sm ring-1 ring-black/5 hover:shadow-lg transition"
                >
                  {/* Контейнер фиксированной высоты */}
                  <div className="w-full h-56 overflow-hidden rounded-lg mb-4">
                    <img
                      src={`https://storage.yandexcloud.net/zoomlion-files${item.img}`}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://storage.yandexcloud.net/zoomlion-files/noimage.jpg";
                      }}
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-600 mt-2">{item.desc}</p>
                  <p className="text-base font-medium text-stone-800 mt-3">
                    {item.price}
                  </p>
                  <button
  onClick={(e) => {
    e.preventDefault();
    console.log("Кнопка нажата в Техника в наличии!", item.title);
    setSelectedProduct(item.title || item.id || null);
    setShowForm(true);
  }}
  className="mt-4 inline-block text-sm font-medium text-white bg-black px-4 py-2 rounded-md hover:bg-stone-800 transition"
>
  Запросить предложение
</button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== НАША ПРОДУКЦИЯ ===== */}
      <section id="products" className="bg-gray-50 py-20">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Наша продукция
        </h2>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          {products.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow ring-1 ring-gray-200"
            >
              <div className="w-full h-56 overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onClick={() => setModalImageIndex(i)}
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{p.desc}</p>

                <button
  onClick={(e) => {
    e.preventDefault();
    console.log("Кнопка нажата!");
    setSelectedProduct(p.title);
    setShowForm(true);
  }}
  className="mt-4 inline-block text-sm font-medium text-white bg-black px-4 py-2 rounded-md hover:bg-stone-800 transition"
>
  Запросить предложение
</button>

              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== ПРЕИМУЩЕСТВА ===== */}
      <section id="features" className="py-20 bg-white">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Почему выбирают Zoomlion
        </h2>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 text-center">
          {[
            {
              icon: "⚙️",
              title: "Надёжность",
              desc: "Каждая единица техники проходит строгие испытания.",
            },
            {
              icon: "🚀",
              title: "Производительность",
              desc: "Оптимальная мощность и эффективность в любых условиях.",
            },
            {
              icon: "💚",
              title: "Экологичность",
              desc: "Низкие выбросы и современные технологии.",
            },
            {
              icon: "🧰",
              title: "Сервис",
              desc: "Сеть обслуживания и запасных частей по всей России.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl ring-1 ring-gray-200 shadow-sm hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== СЕРВИС И ПОДДЕРЖКА ===== */}
      <section id="service" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold mb-6">Сервис и поддержка</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-10">
            Мы обеспечиваем комплексное обслуживание техники Zoomlion по всей
            России: от поставки и пуско-наладки до гарантии, обучения персонала
            и поставки оригинальных запчастей.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🚚",
                title: "Доставка по России",
                desc: "Быстрая и безопасная доставка в любой регион.",
              },
              {
                icon: "🛠️",
                title: "Гарантия",
                desc: "Полное сервисное обслуживание и гарантийная поддержка.",
              },
              {
                icon: "📦",
                title: "Запчасти",
                desc: "Оригинальные комплектующие всегда в наличии.",
              },
              {
                icon: "📞",
                title: "Техподдержка",
                desc: "Оперативная консультация специалистов.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl ring-1 ring-gray-200 shadow-sm hover:shadow-md transition"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ФУТЕР ===== */}
      <footer id="contacts" className="bg-gray-900 text-white py-16 text-center">
        <h3 className="text-2xl font-semibold mb-4">Свяжитесь с нами</h3>
        <p className="text-gray-400 mb-6">
          Телефон: <a href="tel:+79375844555">+7 (937) 584-45-55</a>
        </p>
        <p className="text-gray-400 mb-6">
          Email:{" "}
          <a href="mailto:ilmir.sky@yandex.ru" className="underline">
            ilmir.sky@yandex.ru
          </a>
        </p>
        <p className="text-gray-500 text-sm">© 2025 Zoomlion Pro. Все права защищены.</p>
      </footer>

      {/* ===== МОДАЛЬНОЕ ОКНО (просмотр фото) ===== */}
      {modalImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
          onClick={(e) => e.target === e.currentTarget && setModalImageIndex(null)}
        >
          <motion.img
            key={products[modalImageIndex].img}
            src={products[modalImageIndex].img}
            alt={products[modalImageIndex].title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-[90%] max-h-[80vh] rounded-lg shadow-2xl"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setModalImageIndex((i) => (i === 0 ? products.length - 1 : i - 1));
            }}
            className="absolute left-6 text-white text-4xl hover:text-lime-400 transition"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setModalImageIndex((i) => (i === products.length - 1 ? 0 : i + 1));
            }}
            className="absolute right-6 text-white text-4xl hover:text-lime-400 transition"
          >
            ›
          </button>
        </div>
      )}

            {/* ===== МОДАЛЬНОЕ ОКНО ===== */}
{showForm && (
  <div
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
    onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
  >
    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center relative">
      <button
        onClick={() => setShowForm(false)}
        className="absolute top-3 right-4 text-gray-400 hover:text-black text-2xl"
      >
        ×
      </button>

      <h2 className="text-2xl font-semibold mb-4">Запросить предложение</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const name = e.target.name.value;
          const phone = e.target.phone.value;
          const comment = e.target.comment.value;

          const res = await fetch("/api/send-telegram", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, comment }),
          });

          if (res.ok) {
            alert("✅ Заявка отправлена!");
            setShowForm(false);
          } else {
            alert("❌ Ошибка при отправке. Попробуйте позже.");
          }
        }}
        className="space-y-4"
      >
        <input
          name="name"
          placeholder="Ваше имя"
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          name="phone"
          placeholder="Телефон"
          required
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          name="comment"
          placeholder="Комментарий (по желанию)"
          className="w-full border px-4 py-2 rounded"
        />

        {/* ✅ Кнопка */}
        <button
          type="submit"
          className="w-full bg-lime-500 hover:bg-lime-400 text-white py-2 rounded font-medium transition"
        >
          Отправить
        </button>

        {/* ✅ Добавлен блок согласия */}
        <p className="text-xs text-gray-600 mt-2 text-center">
          Нажимая на кнопку, вы соглашаетесь с{" "}
          <a
            href="/confidential"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lime-600 underline hover:text-lime-800"
          >
            политикой конфиденциальности
          </a>.
        </p>
      </form>
    </div>
  </div>
)}


