import { useEffect, useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";


export default function Home() {
  const [stockData, setStockData] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [heroDarkness, setHeroDarkness] = useState(0);
  const [modalImageIndex, setModalImageIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [offsetY, setOffsetY] = useState(0); // ✅ параллакс

  // ✅ Загружаем stock.json
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

  // ✅ Обработка скролла и клавиш
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 10);
      setHeroDarkness(Math.min(scrollY / 400, 0.4));
      setOffsetY(scrollY);
    };

    const handleKey = (e) => e.key === "Escape" && setModalImageIndex(null);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  // ✅ SEO и микроразметка для товаров
  const productsSchema = stockData.map((item) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title,
    image: `https://zoomliontrade.ru${item.img}`,
    description: item.desc,
    brand: {
      "@type": "Brand",
      name: "Zoomlion",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      price: item.price.replace(/[^\d]/g, ""),
      availability: "https://schema.org/InStock",
      url: "https://zoomliontrade.ru/",
    },
  }));

  // ✅ Категории (блок карточек)
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



// внутри Home():
const router = useRouter();
const isNoIndexPage =
  router.pathname.startsWith("/admin") ||
  router.pathname.startsWith("/confidential");
 
 return (
    <div className="min-h-screen bg-white text-gray-900">
      <Head>
        {/* ✅ SEO базовые мета-теги */}
        <title>
          Вилочные погрузчики и подъёмники — купить Zoomlion и другие бренды в
          России
        </title>
        <meta
          name="description"
          content="Продажа вилочных погрузчиков и подъёмников. Дизельные и электрические модели Zoomlion и других брендов. Гарантия, доставка по всей России. Бесплатная консультация и подбор техники."
        />
        <meta
          name="keywords"
          content="вилочный погрузчик, купить вилочный погрузчик, дизельный вилочный погрузчик, электрический вилочный погрузчик, складская техника, подъемники, погрузчики Zoomlion, Zoomlion Trade, погрузчик цена, вилочный погрузчик Россия"
        />

        {/* ✅ Open Graph */}
        <meta
          property="og:title"
          content="Вилочные погрузчики и подъёмники — Zoomlion и другие бренды"
        />
        <meta
          property="og:description"
          content="Официальный дилер вилочных погрузчиков Zoomlion. Продажа дизельных и электрических моделей. Бесплатная доставка и сервис по всей России."
        />
        <meta property="og:image" content="https://zoomliontrade.ru/og-image.png" />
        <meta property="og:url" content="https://zoomliontrade.ru" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ru_RU" />

        {/* ✅ Telegram / Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Купить вилочный погрузчик — Zoomlion и другие бренды"
        />
        <meta
          name="twitter:description"
          content="Продажа вилочных погрузчиков и подъёмников Zoomlion. Дизельные, электрические — доставка по всей России."
        />
        <meta
          name="twitter:image"
          content="https://zoomliontrade.ru/og-image.png"
        />

        {/* ✅ Organization JSON-LD */}
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
                "Продажа вилочных погрузчиков Zoomlion и других брендов. Официальный дилер в России. Гарантия, доставка, сервис.",
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
{/* ✅ Robots meta tag for SEO */}
<meta
  name="robots"
  content={isNoIndexPage ? "noindex, nofollow" : "index, follow"}
/>


        {/* ✅ Product Schema (динамический) */}
        {stockData.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(productsSchema),
            }}
          />
        )}
      </Head>



      {/* ===== ШАПКА ===== */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm">
  <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3">
    {/* ✅ Логотип с фиксированной шириной */}
    <img
      src="/logo.png"
      alt="Zoomlion"
      className="h-8 md:h-10 w-auto object-contain max-w-[180px] md:max-w-[200px]"
    />

    {/* ✅ Навигация адаптируется под ширину */}
    <nav className="hidden sm:flex items-center gap-5 text-gray-800 font-medium text-sm md:text-base">
      <a href="#products" className="hover:text-lime-600 transition">Продукция</a>
      <a href="#features" className="hover:text-lime-600 transition">Преимущества</a>
      <a href="#service" className="hover:text-lime-600 transition">Сервис</a>
      <a href="#contacts" className="hover:text-lime-600 transition">Контакты</a>
    </nav>
  </div>
</header>


     import Image from "next/image";

{/* ===== HERO ===== */}
<section
  id="hero"
  className="relative flex flex-col items-center justify-center text-center text-white overflow-hidden min-h-screen"
>
  <div
    className="absolute inset-0 will-change-transform"
    style={{
      transform: `translateY(${offsetY * 0.2}px) scale(1.05)`,
      transition: "transform 0.3s ease-out",
    }}
  >
    <Image
      src="/zoomlion-hero.jpg"
      alt="Zoomlion Hero"
      width={1920}
      height={1080}
      priority
      fetchPriority="high"
      className="w-full h-full object-cover object-center"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />
  </div>

  <div className="relative z-10 max-w-3xl mx-auto px-6">
    <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-300 drop-shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
      Складская техника <span className="text-white">Zoomlion</span>
    </h1>
    <p className="text-lg md:text-xl text-gray-200 mb-10 font-medium drop-shadow-lg">
      Официальный дилер в России. Надёжность, производительность и сервис.
    </p>
    <a
      href="#contacts"
      className="inline-block bg-lime-400 text-gray-900 px-8 md:px-10 py-3 rounded-full font-semibold hover:bg-lime-300 shadow-lg hover:shadow-lime-300/40 transition-all duration-300 transform hover:-translate-y-1"
    >
      Получить консультацию
    </a>
  </div>

  <div className="absolute bottom-10 animate-bounce text-lime-400 text-2xl opacity-80">↓</div>
</section>

      {/* ===== ТЕХНИКА В НАЛИЧИИ ===== */}
      <section id="stock" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-stone-900 mb-12">Техника в наличии</h2>
          {stockData.length === 0 ? (
            <p className="text-center text-gray-500">Загрузка данных...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {stockData.map((item, i) => (
                <motion.div key={i} whileHover={{ y: -6 }} className="bg-stone-50 rounded-2xl p-6 shadow-sm ring-1 ring-black/5 hover:shadow-lg transition">
                  <div className="w-full h-56 overflow-hidden rounded-lg mb-4">
                    <img
                      src={`https://storage.yandexcloud.net/zoomlion-files${item.img}`}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://storage.yandexcloud.net/zoomlion-files/noimage.jpg";
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-900">{item.title}</h3>
                  <p className="text-sm text-stone-600 mt-2">{item.desc}</p>
                  <p className="text-base font-medium text-stone-800 mt-3">{item.price}</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
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
{/* ===== НАША ПРОДУКЦИЯ ===== */} <section id="products" className="bg-gray-50 py-20"> <h2 className="text-3xl font-semibold text-center mb-10"> Наша продукция </h2> <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6"> {products.map((p, i) => ( <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.6 }} viewport={{ once: true }} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow ring-1 ring-gray-200" > <div className="w-full h-56 overflow-hidden"> <img src={p.img} alt={p.title} className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300" loading="lazy" onClick={() => setModalImageIndex(i)} /> </div> <div className="p-6 text-center"> <h3 className="text-lg font-semibold mb-2">{p.title}</h3> <p className="text-gray-600 text-sm mb-4">{p.desc}</p> <button onClick={(e) => { e.preventDefault(); console.log("Кнопка нажата!"); setSelectedProduct(p.title); setShowForm(true); }} className="mt-4 inline-block text-sm font-medium text-white bg-black px-4 py-2 rounded-md hover:bg-stone-800 transition" > Запросить предложение </button> </div> </motion.div> ))} </div> </section>

{/* ===== ПРЕИМУЩЕСТВА ===== */} <section id="features" className="py-20 bg-white"> <h2 className="text-3xl font-semibold text-center mb-12"> Почему выбирают Zoomlion </h2> <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 text-center"> {[ { icon: "⚙️", title: "Надёжность", desc: "Каждая единица техники проходит строгие испытания.", }, { icon: "🚀", title: "Производительность", desc: "Оптимальная мощность и эффективность в любых условиях.", }, { icon: "💚", title: "Экологичность", desc: "Низкие выбросы и современные технологии.", }, { icon: "🧰", title: "Сервис", desc: "Сеть обслуживания и запасных частей по всей России.", }, ].map((f, i) => ( <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15, duration: 0.6 }} viewport={{ once: true }} className="p-6 rounded-2xl ring-1 ring-gray-200 shadow-sm hover:shadow-lg transition" > <div className="text-5xl mb-4">{f.icon}</div> <h3 className="font-semibold text-lg mb-2">{f.title}</h3> <p className="text-gray-600 text-sm">{f.desc}</p> </motion.div> ))} </div> </section>

{/* ===== СЕРВИС И ПОДДЕРЖКА ===== */} <section id="service" className="py-20 bg-gray-50"> <div className="max-w-5xl mx-auto text-center px-6"> <h2 className="text-3xl font-semibold mb-6">Сервис и поддержка</h2> <p className="text-gray-600 max-w-3xl mx-auto mb-10"> Мы обеспечиваем комплексное обслуживание техники Zoomlion по всей России: от поставки и пуско-наладки до гарантии, обучения персонала и поставки оригинальных запчастей. </p> <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"> {[ { icon: "🚚", title: "Доставка по России", desc: "Быстрая и безопасная доставка в любой регион.", }, { icon: "🛠️", title: "Гарантия", desc: "Полное сервисное обслуживание и гарантийная поддержка.", }, { icon: "📦", title: "Запчасти", desc: "Оригинальные комплектующие всегда в наличии.", }, { icon: "📞", title: "Техподдержка", desc: "Оперативная консультация специалистов.", }, ].map((item, i) => ( <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="bg-white p-6 rounded-2xl ring-1 ring-gray-200 shadow-sm hover:shadow-md transition" > <div className="text-4xl mb-3">{item.icon}</div> <h3 className="font-semibold text-lg mb-2">{item.title}</h3> <p className="text-gray-600 text-sm">{item.desc}</p> </motion.div> ))} </div> </div> </section>

      {/* ===== ФУТЕР ===== */}
      <footer id="contacts" className="bg-gray-900 text-white py-16 text-center">
        <h3 className="text-2xl font-semibold mb-4">Свяжитесь с нами</h3>
        <p className="text-gray-400 mb-6">Телефон: <a href="tel:+79375844555">+7 (937) 584-45-55</a></p>
        <p className="text-gray-400 mb-6">Email: <a href="mailto:ilmir.sky@yandex.ru" className="underline">ilmir.sky@yandex.ru</a></p>
        <p className="text-gray-500 text-sm">© 2025 Zoomlion Pro. Все права защищены.</p>
      </footer>

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
              <input name="name" placeholder="Ваше имя" required className="w-full border px-4 py-2 rounded" />
              <input name="phone" placeholder="Телефон" required className="w-full border px-4 py-2 rounded" />
              <textarea name="comment" placeholder="Комментарий (по желанию)" className="w-full border px-4 py-2 rounded" />
              <button type="submit" className="w-full bg-lime-500 hover:bg-lime-400 text-white py-2 rounded font-medium transition">
                Отправить
              </button>
              <p className="text-xs text-gray-600 mt-2 text-center">
                Нажимая на кнопку, вы соглашаетесь с{" "}
                <a href="/confidential" target="_blank" rel="noopener noreferrer" className="text-lime-600 underline hover:text-lime-800">
                  политикой конфиденциальности
                </a>.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
