import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [stockData, setStockData] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [heroDarkness, setHeroDarkness] = useState(0);
  const [modalImageIndex, setModalImageIndex] = useState(null);

 useEffect(() => {
  const loadStock = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STATIC_BASE}/stock/stock.json?nocache=${new Date().getTime()}`, {
    cache: "no-store",
});
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

  // список техники
  const products = [
    { title: "Вилочные погрузчики", desc: "Грузоподъёмность от 1 до 18 тонн. Электрические и дизельные модели.", img: "/forklift.jpg" },
    { title: "Ножничные подъемники", desc: "Высота подъёма до 12 м. Надёжная платформа для работы на высоте.", img: "/lift.jpg" },
    { title: "Телескопические подъемники", desc: "Грузоподъёмность до 500 кг. Большой вылет стрелы.", img: "/telescopic.jpg" },
    { title: "Коленчатые подъемники", desc: "Рабочая высота до 18 метров. Отличная манёвренность.", img: "/articulating-boom.jpg" },
    { title: "Телескопические погрузчики", desc: "Грузоподъёмность до 3 тонн. Многофункциональные решения.", img: "/telehandler.jpg" },
    { title: "Навесное оборудование", desc: "Широкий ассортимент навесного для любых задач.", img: "/attachments.jpg" },
  ];

  return (

    <div className="min-h-screen bg-white text-gray-900">
{/* ===== ШАПКА ===== */}
<header
  className={`fixed top-0 left-0 w-full z-50 transition-all ${
    scrolled
      ? "bg-white/90 backdrop-blur-md shadow-sm"
      : "bg-white/70"
  }`}
>
  <nav className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
    <img
      src="https://storage.yandexcloud.net/zoomlion-files/logo.png"
      alt="Zoomlion Logo"
      className="h-10"
      loading="lazy"
    />
    <div className="hidden md:flex items-center gap-6 text-sm">
      <a href="#products" className="hover:text-lime-600">
        Продукция
      </a>
      <a href="#features" className="hover:text-lime-600">
        Преимущества
      </a>
      <a href="#service" className="hover:text-lime-600">
        Сервис
      </a>
      <a href="#contacts" className="hover:text-lime-600">
        Контакты
      </a>
    </div>
  </nav>
</header>

{/* ===== HERO ===== */}
<section
  id="hero"
  className="relative flex flex-col items-center justify-center text-center text-white overflow-hidden pt-36 pb-24"
>
  {/* Фоновая анимация Zoomlion */}
  <img
    src="https://storage.yandexcloud.net/zoomlion-files/zoomlion-animated.gif"
    alt="Анимированный логотип Zoomlion"
    className="absolute inset-0 w-full h-full object-contain object-center"
    style={{ zIndex: 0 }}
    loading="lazy"
  />

  {/* Затемнение */}
  <div
    className="absolute inset-0 bg-black/30"
    style={{ zIndex: 1 }}
  ></div>

  {/* Контент */}
  <div className="relative z-10 max-w-3xl mx-auto px-6">
    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
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
            <img
              src={`https://storage.yandexcloud.net/zoomlion-files${item.img}`}
              alt={item.title}
              loading="lazy"
              className="w-full h-56 object-cover rounded-lg mb-4"
              onError={(e) => {
                e.target.src = "https://storage.yandexcloud.net/zoomlion-files/noimage.jpg";
              }}
            />

            <h3 className="text-lg font-semibold text-stone-900">
              {item.title}
            </h3>
            <p className="text-sm text-stone-600 mt-2">{item.desc}</p>
            <p className="text-base font-medium text-stone-800 mt-3">
              {item.price}
            </p>
            <a
              href="#contacts"
              className="mt-4 inline-block text-sm font-medium text-white bg-black px-4 py-2 rounded-md hover:bg-stone-800 transition"
            >
              Запросить предложение
            </a>
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
    {[
      {
        title: "Вилочные погрузчики",
        desc: "Грузоподъёмность от 1 до 18 тонн. Электрические и дизельные модели.",
        img: "https://storage.yandexcloud.net/zoomlion-files/forklift.jpg",
      },
      {
        title: "Ножничные подъемники",
        desc: "Высота подъёма до 12 м. Надёжная платформа для работы на высоте.",
        img: "https://storage.yandexcloud.net/zoomlion-files/lift.jpg",
      },
      {
        title: "Телескопические подъемники",
        desc: "Грузоподъёмность до 500 кг. Большой вылет стрелы.",
        img: "https://storage.yandexcloud.net/zoomlion-files/telescopic.jpg",
      },
      {
        title: "Коленчатые подъемники",
        desc: "Рабочая высота до 18 метров. Отличная манёвренность.",
        img: "https://storage.yandexcloud.net/zoomlion-files/articulating-boom.jpg",
      },
      {
        title: "Телескопические погрузчики",
        desc: "Грузоподъёмность до 3 тонн. Многофункциональные решения.",
        img: "https://storage.yandexcloud.net/zoomlion-files/telehandler.jpg",
      },
      {
        title: "Навесное оборудование",
        desc: "Широкий ассортимент навесного для любых задач.",
        img: "https://storage.yandexcloud.net/zoomlion-files/attachments.jpg",
      },
    ].map((p, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1, duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow ring-1 ring-gray-200"
      >
        <img
          src={p.img}
          alt={p.title}
          className="w-full h-56 object-cover cursor-pointer hover:opacity-90 transition"
          loading="lazy"
          onClick={() => setModalImageIndex(i)}
        />
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{p.desc}</p>
          <a
            href="#contacts"
            className="inline-block bg-lime-400 text-gray-900 px-5 py-2 rounded-lg font-medium hover:bg-lime-300 transition"
          >
            Узнать подробнее
          </a>
        </div>
      </motion.div>
    ))}
  </div>
</section>


      {/* ===== ПРЕИМУЩЕСТВА ===== */}
      <section id="features" className="py-20 bg-white">
        <h2 className="text-3xl font-semibold text-center mb-12">Почему выбирают Zoomlion</h2>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 text-center">
          {[
            { icon: "⚙️", title: "Надёжность", desc: "Каждая единица техники проходит строгие испытания." },
            { icon: "🚀", title: "Производительность", desc: "Оптимальная мощность и эффективность в любых условиях." },
            { icon: "💚", title: "Экологичность", desc: "Низкие выбросы и современные технологии." },
            { icon: "🧰", title: "Сервис", desc: "Сеть обслуживания и запасных частей по всей России." },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15, duration: 0.6 }} viewport={{ once: true }} className="p-6 rounded-2xl ring-1 ring-gray-200 shadow-sm hover:shadow-lg transition">
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
            Мы обеспечиваем комплексное обслуживание техники Zoomlion по всей России:
            от поставки и пуско-наладки до гарантии, обучения персонала и поставки оригинальных запчастей.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "🚚", title: "Доставка по России", desc: "Быстрая и безопасная доставка в любой регион." },
              { icon: "🛠️", title: "Гарантия", desc: "Полное сервисное обслуживание и гарантийная поддержка." },
              { icon: "📦", title: "Запчасти", desc: "Оригинальные комплектующие всегда в наличии." },
              { icon: "📞", title: "Техподдержка", desc: "Оперативная консультация специалистов." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="bg-white p-6 rounded-2xl ring-1 ring-gray-200 shadow-sm hover:shadow-md transition">
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
        <p className="text-gray-400 mb-6">Телефон: <a href="tel:+79375844555">+7 (937) 584-45-55</a></p>
        <p className="text-gray-400 mb-6">Email: <a href="mailto:ilmir.sky@yandex.ru" className="underline">ilmir.sky@yandex.ru</a></p>
        <p className="text-gray-500 text-sm">© 2025 Zoomlion Pro. Все права защищены.</p>
      </footer>

      {/* ===== МОДАЛЬНОЕ ОКНО (просмотр фото) ===== */}
      {modalImageIndex !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]" onClick={(e) => e.target === e.currentTarget && setModalImageIndex(null)}>
          <motion.img key={products[modalImageIndex].img} src={products[modalImageIndex].img} alt={products[modalImageIndex].title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="max-w-[90%] max-h-[80vh] rounded-lg shadow-2xl" />
          <button onClick={(e) => { e.stopPropagation(); setModalImageIndex((i) => (i === 0 ? products.length - 1 : i - 1)); }} className="absolute left-6 text-white text-4xl hover:text-lime-400 transition">‹</button>
          <button onClick={(e) => { e.stopPropagation(); setModalImageIndex((i) => (i === products.length - 1 ? 0 : i + 1)); }} className="absolute right-6 text-white text-4xl hover:text-lime-400 transition">›</button>
        </div>
      )}
    </div>
  );
}
