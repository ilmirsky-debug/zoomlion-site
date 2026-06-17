import { useEffect, useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";
import SupportModal from "../components/SupportModal"; // добавить
import Link from "next/link";
import dynamic from "next/dynamic";

const HeroSwiperClient = dynamic(
  () => import("../components/HeroSwiperClient"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[95vh] min-h-[650px] bg-stone-200 animate-pulse" />
    ),
  }
);





export default function Home() {
  const [stockData, setStockData] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const [activeStockCategory, setActiveStockCategory] = useState("all");
  const [scrolled, setScrolled] = useState(false);
  const [heroDarkness, setHeroDarkness] = useState(0);
  const [modalImageIndex, setModalImageIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [offsetY, setOffsetY] = useState(0); // ✅ параллакс
// ==== SUPPORT MODAL STATE ====
const [openModal, setOpenModal] = useState(false);
const [modalContent, setModalContent] = useState(null);

// Глобальная функция, чтобы открывать форму из любой страницы
useEffect(() => {
  window.openForm = (productName) => {
    setSelectedProduct(productName);
    setShowForm(true);
  };
}, []);



// ✅ Загружаем локальный stock.json
useEffect(() => {
  const loadStock = async () => {
    try {
      const res = await fetch("/stock/stock.json");
      const data = await res.json();
      setStockData(data);
    } catch (err) {
      console.error("Ошибка загрузки stock.json:", err);
    }
  };
  loadStock();
}, []);

const openSupport = (type) => {
  switch (type) {
    case "select":
      setModalContent(
        <div>
          <h3 className="text-2xl font-bold mb-4">Подбор техники</h3>
          <p className="text-stone-700 leading-relaxed mb-4">
            Помогаем подобрать технику под любые задачи: склад, производство, строительство.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-stone-700">
            <li>Дизельные вилочные погрузчики</li>
            <li>Электрические вилочные погрузчики</li>
            <li>Телескопические погрузчики</li>
            <li>Подъёмники для высотных работ</li>
            <li>Мини-погрузчики</li>
          </ul>
        </div>
      );
      break;

    case "service":
      setModalContent(
        <div>
          <h3 className="text-2xl font-bold mb-4">Гарантия и сервис</h3>
          <p className="text-stone-700 leading-relaxed">
            Гарантия до 2 лет. Собственный сервис и склад запчастей.
          </p>
        </div>
      );
      break;

    case "delivery":
      setModalContent(
        <div>
          <h3 className="text-2xl font-bold mb-4">Доставка по России</h3>
          <p className="text-stone-700">
            Доставим технику в любой регион РФ авто- и ж/д транспортом.
          </p>
        </div>
      );
      break;

    case "benefits":
      setModalContent(
        <div>
          <h3 className="text-2xl font-bold mb-4">Преимущества компании</h3>
          <p className="text-stone-700">Работаем быстро, честно и с гарантией результата.</p>
        </div>
      );
      break;
  }

  setOpenModal(true);
};


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
      desc: "Грузоподъёмность от 1 до 25 тонн. Электрические и дизельные модели.",
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
      desc: "Высота подъёма до 82 м. Многофункциональные решения.",
      img: "/telehandler.jpg",
    },
    {
      title: "Мини-погрузчики",
      desc: "Широкий ассортимент техники с навесным оборудованием для любых задач.",
      img: "/ZS080V.png",
    },
  ];



// внутри Home():
const router = useRouter();
const isNoIndexPage =
  router.pathname.startsWith("/admin") ||
  router.pathname.startsWith("/confidential");
const stockCategories = [
  { slug: "all", title: "Все" },
  { slug: "forklifts", title: "Вилочные погрузчики" },
  { slug: "mini-loaders", title: "Мини-погрузчики" },
  { slug: "telehandlers", title: "Телескопические погрузчики" },
  { slug: "scissor-lifts", title: "Ножничные подъёмники" },
  { slug: "articulated-lifts", title: "Коленчатые подъёмники" },
  { slug: "telescopic-lifts", title: "Телескопические подъёмники" },
];

const visibleStock =
  activeStockCategory === "all"
    ? stockData.slice(0, 9)
    : stockData
        .filter((item) => item.category === activeStockCategory)
        .slice(0, 9);
 
 return (
    <div className="min-h-screen bg-white text-gray-900">
      <Head>
        {/* ✅ SEO базовые мета-теги */}
        <title>
          Вилочные погрузчики, мини-погрузчики и подъёмники — купить Zoomlion и другие бренды в
          России
        </title>
        <meta
          name="description"
          content="Продажа вилочных погрузчиков, мини-погрузчкиов и подъёмников. Дизельные и электрические модели Zoomlion и других брендов. Гарантия, доставка по всей России. Бесплатная консультация и подбор техники."
        />
        <meta
          name="keywords"
          content="вилочный погрузчик, купить вилочный погрузчик, дизельный вилочный погрузчик, электрический вилочный погрузчик, мини-погрузчики, купить мини-погрузчик, подъемники, погрузчики Zoomlion (Зумлион), Zoomlion Trade, погрузчик цена, вилочный погрузчик Россия"
        />

        {/* ✅ Open Graph */}
        <meta
          property="og:title"
          content="Вилочные погрузчики, мини-погрузчики и подъёмники — Zoomlion и другие бренды"
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
                "Подъемная техника Zoomlion и других брендов. Официальный дилер в России. Гарантия, доставка, сервис.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "RU",
                addressLocality: "Набережные Челны",
                streetAddress: "Производственный проезд, д. 3",
                postalCode: "423800",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+7 (919) 622-85-55",
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
<header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
  <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-2,5">

    <img
      src="/logo.png"
      alt="Zoomlion"
      className="h-8 md:h-9 w-auto object-contain max-w-[180px] md:max-w-[220px]"
    />

    <nav className="hidden lg:flex items-center gap-8 text-gray-800 font-medium">
  <a href="#products" className="hover:text-lime-600 transition">
    Продукция
  </a>

  <a href="#features" className="hover:text-lime-600 transition">
    Преимущества
  </a>

  <a href="#service" className="hover:text-lime-600 transition">
    Сервис
  </a>

  <Link
    href="/blog"
    className="hover:text-lime-600 transition"
  >
    Блог
  </Link>

  <a href="#contacts" className="hover:text-lime-600 transition">
    Контакты
  </a>
</nav>

    <div className="hidden md:flex items-center gap-5">
      <a
        href="tel:+79196224555"
        className="text-gray-900 font-semibold whitespace-nowrap hover:text-lime-600 transition"
      >
        +7 919 622-45-55
      </a>

      <button
        onClick={() => window.openForm && window.openForm("Заказать обратный звонок")}
        className="bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold px-5 py-2 rounded-full shadow-md transition-all hover:-translate-y-1"
      >
        Заказать звонок
      </button>
    </div>

    <button
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className="lg:hidden text-3xl font-bold text-gray-900"
      aria-label="Открыть меню"
    >
      ☰
    </button>
  </div>

  {mobileMenuOpen && (
  <div className="lg:hidden fixed top-[64px] left-0 right-0 z-[9999] bg-white shadow-2xl border-t border-gray-200">
    <div className="px-6 py-6 flex flex-col gap-5 text-gray-900 text-lg font-semibold">
      <a onClick={() => setMobileMenuOpen(false)} href="#products">
        Продукция
      </a>

      <a onClick={() => setMobileMenuOpen(false)} href="#features">
        Преимущества
      </a>

      <a onClick={() => setMobileMenuOpen(false)} href="#service">
        Сервис
      </a>

      <a onClick={() => setMobileMenuOpen(false)} href="#contacts">
        Контакты
      </a>

      <a href="tel:+79196224555" className="text-lime-600 font-bold">
        +7 919 622-45-55
      </a>

      <button
        onClick={() => {
          setMobileMenuOpen(false);
          window.openForm && window.openForm("Заказать обратный звонок");
        }}
        className="bg-lime-400 text-gray-900 px-5 py-3 rounded-full font-semibold shadow-md"
      >
        Заказать звонок
      </button>
    </div>
  </div>
)}
</header>


          {/* ===== HERO ===== */}
      <HeroSwiperClient />
{/* ===== ПОПУЛЯРНАЯ ТЕХНИКА В НАЛИЧИИ ===== */}
<section id="popular-stock" className="pt-6 pb-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    <div className="mb-12">
  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
    <div className="max-w-4xl">
      <p className="text-lime-600 font-semibold mb-2 uppercase tracking-wide">
        В наличии на складе
      </p>

      <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 leading-tight">
        Техника для склада, строительства и высотных работ
      </h2>

      <p className="mt-4 text-stone-600 text-base md:text-lg max-w-2xl">
        Вилочные погрузчики, мини-погрузчики, ножничные, коленчатые и телескопические подъёмники Zoomlion и других брендов.
      </p>
    </div>

    <Link
      href="/catalog/forklifts"
      className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-black text-white font-semibold hover:bg-stone-800 transition shadow-lg"
    >
      Смотреть весь каталог →
    </Link>
  </div>
</div>

<div className="flex flex-wrap gap-3 mb-10">
  {stockCategories.map((cat) => (
    <button
      key={cat.slug}
      onClick={() => setActiveStockCategory(cat.slug)}
      className={`px-5 py-3 rounded-xl font-semibold border transition ${
        activeStockCategory === cat.slug
          ? "bg-lime-500 border-lime-500 text-black"
          : "bg-white border-stone-300 text-stone-700 hover:border-lime-500"
      }`}
    >
      {cat.title}
    </button>
  ))}
</div>    
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {visibleStock.map((item) => {
        const image =
  item.images && item.images.length > 0 && item.images[0]
    ? item.images[0]
    : item.img || "/stock/noimage.jpg";

        return (
          <article
            key={item.slug}
            className="group bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative h-80 bg-gradient-to-br from-stone-50 via-white to-stone-100 overflow-hidden">
  <img
    src={image}
    alt={item.title}
    className="w-full h-full object-contain p-5 group-hover:scale-105 transition duration-500"
    loading="lazy"
    onError={(e) => {
      e.currentTarget.src = "/stock/noimage.jpg";
    }}
  />
</div>

<div className="p-5">

  <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-lime-100 text-lime-700 text-sm font-semibold">
    ● В наличии
  </div>

  <h3 className="text-xl font-extrabold text-stone-900 mb-3 line-clamp-2">
    {item.title}
  </h3>

  <div className="flex items-center justify-between mb-6">
  <div>
    <p className="text-sm text-stone-500 mb-1">
      Цена
    </p>

    <p className="text-2xl font-extrabold text-stone-900">
      {item.price}
    </p>
  </div>

  <div className="text-lime-600 text-sm font-semibold">
    ✓ В наличии
  </div>
</div>

              <div className="flex flex-wrap gap-2 mb-4 text-sm">
                {item.capacity && (
                  <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700">
                    Г/п: {item.capacity}
                  </span>
                )}

                {item.liftHeight && (
                  <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700">
                    Высота: {item.liftHeight}
                  </span>
                )}

                {item.drive && (
                  <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700">
                    {item.drive}
                  </span>
                )}
              </div>

              <p className="text-xl font-bold text-stone-900 mb-5">
                {item.price}
              </p>

<div className="grid grid-cols-2 gap-3">

  <button
    onClick={() => window.openForm && window.openForm(item.title)}
    className="px-4 py-3 bg-lime-500 text-black rounded-2xl font-bold hover:bg-lime-400 transition-all hover:-translate-y-1"
  >
    КП
  </button>

  <Link
    href={`/product/${item.slug}`}
    className="px-4 py-3 text-center bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all hover:-translate-y-1"
  >
    Подробнее
  </Link>

</div>
            </div>
          </article>
        );
      })}
    </div>
  </div>
</section>
{/* ===== ПОЧЕМУ ВЫБИРАЮТ НАС ===== */}
<section
  id="features"
  className="relative bg-gradient-to-br from-stone-950 via-black to-stone-900 text-white py-16 overflow-hidden"
>
  <div className="absolute -top-24 -left-24 w-72 h-72 bg-lime-400/10 rounded-full blur-3xl" />
<div className="absolute bottom-0 right-0 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl" />
  <div className="relative max-w-7xl mx-auto px-6">
    <p className="text-lime-400 font-semibold mb-3 uppercase tracking-wide">
      Наши преимущества
    </p>

    <h2 className="text-3xl md:text-4xl font-extrabold mb-8">
      Почему выбирают нас
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="relative rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm overflow-hidden hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 before:absolute before:inset-0 before:bg-lime-400/0 before:blur-2xl before:transition before:duration-300 hover:before:bg-lime-400/10">
        <div className="mb-4">
  <svg className="relative z-10 w-10 h-10 text-lime-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 3l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.8 6.7 19.1l1-5.8-4.2-4.1 5.9-.9L12 3z" />
  </svg>
</div>
        <h3 className="relative z-10 text-lg font-bold mb-2">Официальный дилер</h3>
        <p className="relative z-10 text-stone-400 text-sm leading-6">
          Поставляем технику Zoomlion и других брендов с гарантией и документами.
        </p>
      </div>

      <div className="relative rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm overflow-hidden hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 before:absolute before:inset-0 before:bg-lime-400/0 before:blur-2xl before:transition before:duration-300 hover:before:bg-lime-400/10">
        <div className="mb-4">
  <svg className="relative z-10 w-10 h-10 text-lime-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M14.7 6.3a5 5 0 01-6.4 6.4L3 18l3 3 5.3-5.3a5 5 0 006.4-6.4l-3 3-2-2 3-3z" />
  </svg>
</div>
        <h3 className="relative z-10 text-lg font-bold mb-2">Сервис и запчасти</h3>
        <p className="relative z-10 text-stone-400 text-sm leading-6">
          Помогаем с обслуживанием, подбором расходников и технической поддержкой.
        </p>
      </div>

      <div className="relative rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm overflow-hidden hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 before:absolute before:inset-0 before:bg-lime-400/0 before:blur-2xl before:transition before:duration-300 hover:before:bg-lime-400/10">
        <div className="mb-4">
  <svg className="relative z-10 w-10 h-10 text-lime-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 7h12v8H3V7zm12 3h3l3 3v2h-6v-5zM7 19a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z"/>
  </svg>
</div>
        <h3 className="relative z-10 text-lg font-bold mb-2">Доставка по России</h3>
        <p className="relative z-10 text-stone-400 text-sm leading-6">
          Организуем доставку техники до склада, строительной площадки или производства.
        </p>
      </div>

      <div className="relative rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm overflow-hidden hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 before:absolute before:inset-0 before:bg-lime-400/0 before:blur-2xl before:transition before:duration-300 hover:before:bg-lime-400/10">
        <div className="mb-4">
  <svg className="relative z-10 w-10 h-10 text-lime-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
</div>
        <h3 className="text-lg font-bold mb-2">Подбор под задачу</h3>
        <p className="text-stone-400 text-sm leading-6">
          Подберём модель под высоту подъёма, грузоподъёмность, тип работ и бюджет.
        </p>
      </div>
    </div>
  </div>
</section>

{/* ===== ТЕХНИКА В НАЛИЧИИ ===== */}
<section id="stock" className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-3xl md:text-4xl font-bold text-center text-stone-900 mb-14">
      Техника в наличии
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

      {/* === Компонент категории === */}
      {[
        {
          title: "Вилочные погрузчики",
          desc: "Техника для склада и производства",
          link: "/catalog/forklifts",
        },
        {
          title: "Телескопические погрузчики",
          desc: "Грузоподъёмность до 4,5 тонн",
          link: "/catalog/telehandlers",
        },
        {
          title: "Ножничные подъёмники",
          desc: "Высота подъёма до 16 м",
          link: "/catalog/scissor-lifts",
        },
        {
          title: "Коленчатые подъёмники",
          desc: "Высотные работы",
          link: "/catalog/articulated-lifts",
        },
        {
          title: "Телескопические подъёмники",
          desc: "Рабочая высота до 82 м",
          link: "/catalog/telescopic-lifts",
        },
        {
          title: "Мини-погрузчики",
          desc: "Компактные и маневренные машины",
          link: "/catalog/mini-loaders",
        },
      ].map((cat, index) => (
        <Link
          key={index}
          href={cat.link}
          className="group block p-8 bg-white border border-stone-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-green-500 transition-all duration-300"
        >
          <h3 className="text-xl font-semibold mb-2 text-stone-900">
            {cat.title}
          </h3>
          <p className="text-stone-600 mb-6">{cat.desc}</p>

          <button className="mt-4 inline-flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl font-medium shadow hover:bg-green-700 transition">
            Смотреть технику
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5l6 6-6 6M19.5 10.5H4.5"
              />
            </svg>
          </button>
        </Link>
      ))}
    </div>
  </div>
</section>



{/* ===== SEO / ABOUT SECTION ===== */}
<section className="py-20 bg-stone-50 border-t border-stone-200">
  <div className="max-w-6xl mx-auto px-6">
    
    <div className="grid md:grid-cols-2 gap-14 items-center">
      {/* --- LEFT SIDE TEXT CONTENT --- */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6 leading-tight">
          Вилочные погрузчики и подъёмная техника <br />
          <span className="text-lime-600">для склада, стройки и логистики</span>
        </h2>

        <p className="text-stone-700 text-lg leading-relaxed mb-4">
          Поставляем <strong>дизельные</strong> и <strong>электрические вилочные погрузчики</strong>, мини-погрузчики, 
          ножничные, телескопические и коленчатые подъёмники для любых задач. 
          В наличии техника грузоподъёмностью от 1 до 18 тонн.
        </p>

        <p className="text-stone-700 leading-relaxed mb-4">
          Если вам нужно <strong>купить вилочный погрузчик</strong> или подобрать технику под задачи склада, 
          мы предложим оптимальные модели разных производителей — не только Zoomlion. 
          Поможем выбрать лучшее решение по цене, характеристикам и срокам.
        </p>

        <div className="bg-white p-5 rounded-2xl shadow-sm ring-1 ring-stone-200 mt-6">
          <h3 className="text-lg font-semibold mb-3 text-stone-900">
            Почему выбирают нас:
          </h3>
          <ul className="space-y-2 text-stone-700">
            <li className="flex items-center gap-2">
              <span className="text-lime-500 text-xl">●</span>
              Официальные поставки и техника в наличии
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lime-500 text-xl">●</span>
              Подбор моделей под любые задачи
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lime-500 text-xl">●</span>
              Гарантия и сервисная поддержка
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lime-500 text-xl">●</span>
              Доставка по всей России
            </li>
          </ul>
        </div>
      </div>

      {/* --- RIGHT SIDE IMAGE CARD --- */}
      <div className="relative">
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-lime-300 rounded-full opacity-30 blur-2xl" />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-green-300 rounded-full opacity-20 blur-2xl" />

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden ring-1 ring-stone-200">
          <img
            src="/forklift.jpg"
            alt="Вилочный погрузчик"
            className="w-full h-72 object-cover"
            loading="lazy"
          />
          <div className="p-6">
            <h4 className="text-xl font-semibold text-stone-900 mb-2">
              Погрузчики для вашего бизнеса
            </h4>
            <p className="text-stone-600">
              Подберём оптимальную модель, подготовим полный комплект документов 
              и доставим в любой регион.
            </p>
          </div>
        </div>
      </div>
    </div>


  </div>
</section>
{/* ===== ANIMATED FAQ SECTION ===== */}
<section id="faq" className="py-20 bg-white">
  <div className="max-w-5xl mx-auto px-6">
    <h2 className="text-3xl md:text-4xl font-bold text-center text-stone-900 mb-14">
      Часто задаваемые вопросы
    </h2>

    <div className="space-y-6">
      {[
        {
          q: "Какой вилочный погрузчик лучше выбрать — дизельный или электрический?",
          a: "Если техника работает внутри склада — лучше электрический погрузчик, он тихий и экологичный. Если на улице или стройке — дизельный, он мощнее и выносливее."
        },
        {
          q: "Какая высота подъёма считается оптимальной?",
          a: "Для складов — 3–4,5 м. Для стеллажей высокого хранения — 5–7 м. Для стройки — 4,5–6 м."
        },
        {
          q: "Сколько стоит вилочный погрузчик?",
          a: "Базовые дизельные модели начинаются от 950 000 ₽. Электрические — от 1,2 млн ₽. Цена зависит от высоты подъёма, комплектации и типа двигателя."
        },
        {
          q: "Какие бывают виды погрузчиков?",
          a: "Дизельные, электрические, газ-бензиновые, бензиновые, телескопические, мини-погрузчики."
        },
        {
          q: "Можно ли доставить технику в регионы?",
          a: "Да. Доставляем по всей России — авто и ж/д транспортом. Есть фото- и видео-отчёт перед отправкой."
        }
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="bg-stone-50 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition"
        >
          <details className="group p-6 cursor-pointer">
            <summary className="flex justify-between items-center text-lg font-semibold text-stone-900 list-none">
              {item.q}
              <span className="text-lime-500 text-2xl transition-transform group-open:rotate-45">
                +
              </span>
            </summary>

            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: "auto"
              }}
              transition={{ duration: 0.3 }}
              className="mt-4 text-stone-700 leading-relaxed overflow-hidden"
            >
              {item.a}
            </motion.p>
          </details>
        </motion.div>
      ))}
    </div>
  </div>

  {/* FAQ MICRODATA FOR SEO */}
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Какой вилочный погрузчик лучше выбрать — дизельный или электрический?",
            acceptedAnswer: {
              "@type": "Answer",
              text:
                "Если техника работает в помещении — выбирайте электрический. Для улицы — дизельный."
            }
          },
          {
            "@type": "Question",
            name: "Какая высота подъёма считается оптимальной?",
            acceptedAnswer: {
              "@type": "Answer",
              text:
                "Для складов — 3–4,5 м. Для высокого хранения — 5–7 м."
            }
          },
          {
            "@type": "Question",
            name: "Сколько стоит вилочный погрузчик?",
            acceptedAnswer: {
              "@type": "Answer",
              text:
                "Дизельные модели стоят от 950 000 млн ₽, электрические — от 1,2 млн ₽."
            }
          },
          {
            "@type": "Question",
            name: "Какие бывают виды погрузчиков?",
            acceptedAnswer: {
              "@type": "Answer",
              text:
                "Дизельные, электрические, газ-бензиновые, бензиновые, телескопические, мини-погрузчики."
            }
          },
          {
            "@type": "Question",
            name: "Можно ли доставить технику в регионы?",
            acceptedAnswer: {
              "@type": "Answer",
              text:
                "Да, доставляем по всей России авто- и ж/д транспортом."
            }
          }
        ]
      })
    }}
  />
</section>


{/* ===== НАША ПРОДУКЦИЯ ===== */} <section id="products" className="bg-gray-50 py-20"> <h2 className="text-3xl font-semibold text-center mb-10"> Наша продукция </h2> <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6"> {products.map((p, i) => ( <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.6 }} viewport={{ once: true }} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow ring-1 ring-gray-200" > <div className="w-full h-56 overflow-hidden"> <img src={p.img} alt={p.title} className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300" loading="lazy" onClick={() => setModalImageIndex(i)} /> </div> <div className="p-6 text-center"> <h3 className="text-lg font-semibold mb-2">{p.title}</h3> <p className="text-gray-600 text-sm mb-4">{p.desc}</p> <button onClick={(e) => { e.preventDefault(); console.log("Кнопка нажата!"); setSelectedProduct(p.title); setShowForm(true); }} className="mt-4 inline-block text-sm font-medium text-white bg-black px-4 py-2 rounded-md hover:bg-stone-800 transition" > Запросить предложение </button> </div> </motion.div> ))} </div> </section>


{/* ===== СЕРВИС И ПОДДЕРЖКА ===== */}
<section id="support" className="py-20 bg-stone-50">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-3xl font-semibold text-center text-stone-900 mb-12">
      Сервис и поддержка
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

      {/* КНОПКА 1 */}
      <button
        onClick={() => { setModalContent("diagnostics"); setOpenModal(true); }}
        className="group bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-all border border-stone-200 hover:-translate-y-1"
      >
        <div className="text-lime-500 text-4xl mb-3">🛠️</div>
        <h3 className="text-lg font-semibold text-stone-900 mb-2">
          Диагностика и ремонт
        </h3>
        <p className="text-stone-600 text-sm group-hover:text-stone-800 transition">
          Профессиональный ремонт вилочных погрузчиков и подъёмников.
        </p>
      </button>

      {/* КНОПКА 2 */}
      <button
        onClick={() => { setModalContent("parts"); setOpenModal(true); }}
        className="group bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-all border border-stone-200 hover:-translate-y-1"
      >
        <div className="text-lime-500 text-4xl mb-3">🔧</div>
        <h3 className="text-lg font-semibold text-stone-900 mb-2">
          Запчасти
        </h3>
        <p className="text-stone-600 text-sm group-hover:text-stone-800 transition">
          Оригинальные запчасти на складскую технику всех брендов.
        </p>
      </button>

      {/* КНОПКА 3 */}
      <button
        onClick={() => { setModalContent("maintenance"); setOpenModal(true); }}
        className="group bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-all border border-stone-200 hover:-translate-y-1"
      >
        <div className="text-lime-500 text-4xl mb-3">🧰</div>
        <h3 className="text-lg font-semibold text-stone-900 mb-2">
          Техническое обслуживание
        </h3>
        <p className="text-stone-600 text-sm group-hover:text-stone-800 transition">
          Регламентное обслуживание погрузчиков и подъемников.
        </p>
      </button>

      {/* КНОПКА 4 */}
      <button
        onClick={() => { setModalContent("delivery"); setOpenModal(true); }}
        className="group bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-all border border-stone-200 hover:-translate-y-1"
      >
        <div className="text-lime-500 text-4xl mb-3">🚚</div>
        <h3 className="text-lg font-semibold text-stone-900 mb-2">
          Доставка по России
        </h3>
        <p className="text-stone-600 text-sm group-hover:text-stone-800 transition">
          Доставим технику и запчасти в любую точку России.
        </p>
      </button>

    </div>
  </div>
</section>



      {/* ===== ФУТЕР ===== */}
      <footer id="contacts" className="bg-gray-900 text-white py-16 text-center">
        <h3 className="text-2xl font-semibold mb-4">Свяжитесь с нами</h3>
        <p className="text-gray-400 mb-6">Телефон: <a href="tel:+79196228555">+7 (919) 622-85-55</a></p>
        <p className="text-gray-400 mb-6">Email: <a href="mailto:zoomliontrade@yandex.ru" className="underline">zoomliontrade@yandex.ru</a></p>
        <p className="text-gray-500 text-sm">© 2025 Zoomlion Pro. Все права защищены.</p>
      </footer>

      {/* ===== МОДАЛЬНОЕ ОКНО ЗАЯВКИ ===== */}
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

{/* ==== MODAL ДЛЯ БЛОКА "СЕРВИС И ПОДДЕРЖКА" ==== */}
<SupportModal
  isOpen={openModal}
  onClose={() => setOpenModal(false)}
  content={modalContent}
/>

</div>
);
}

