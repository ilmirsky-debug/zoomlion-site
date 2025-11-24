import { useEffect, useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";
import SupportModal from "../components/SupportModal"; // добавить
import Link from "next/link";



export default function Home() {
  const [stockData, setStockData] = useState([]);
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
          </ul>
        </div>
      );
      break;

    case "service":
      setModalContent(
        <div>
          <h3 className="text-2xl font-bold mb-4">Гарантия и сервис</h3>
          <p className="text-stone-700 leading-relaxed">
            Гарантия до 3 лет. Собственный сервис и склад запчастей.
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

{/* ===== HERO (оптимизированный) ===== */}
<section
  id="hero"
  className="relative flex flex-col items-center justify-center text-center text-white overflow-hidden min-h-screen"
>
  {/* Фото заднего плана с параллаксом.
     Используем Image + fill, родитель position: absolute inset-0 */}
  <div
    className="absolute inset-0 will-change-transform"
    style={{
      transform: `translateY(${offsetY * 0.2}px) scale(1.05)`,
      transition: "transform 0.3s ease-out",
    }}
  >
    <div className="relative w-full h-full">
      <Image
        src="/zoomlion-hero.jpg"
        alt="Zoomlion Hero"
        fill
        priority // важное изображение для LCP
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </div>

    {/* затемнение поверх картинки */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60 pointer-events-none" />
  </div>

  {/* Текст */}
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
    <h2 className="text-3xl font-semibold text-center text-stone-900 mb-12">
      Техника в наличии
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

      {/* Карточка категории */}
      <Link href="/catalog/forklifts" className="block p-8 bg-stone-50 rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-2">Вилочные погрузчики</h3>
        <p className="text-stone-600">Техника для склада и производства</p>
      </Link>

      <Link href="/catalog/telehandlers" className="block p-8 bg-stone-50 rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-2">Телескопические погрузчики</h3>
        <p className="text-stone-600">Грузоподъёмность до 4 тонн</p>
      </Link>

      <Link href="/catalog/scissor-lifts" className="block p-8 bg-stone-50 rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-2">Ножничные подъёмники</h3>
        <p className="text-stone-600">Высота подъёма до 16 м</p>
      </Link>

      <Link href="/catalog/articulated-lifts" className="block p-8 bg-stone-50 rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-2">Коленчатые подъёмники</h3>
        <p className="text-stone-600">Высотные работы</p>
      </Link>

      <Link href="/catalog/telescopic-lifts" className="block p-8 bg-stone-50 rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-2">Телескопические подъёмники</h3>
        <p className="text-stone-600">Рабочая высота до 20 м</p>
      </Link>

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
          Поставляем <strong>дизельные</strong> и <strong>электрические вилочные погрузчики</strong>, 
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

    {/* --- LIST OF EQUIPMENT TYPES --- */}
    <div className="mt-16">
      <h3 className="text-2xl font-bold mb-6 text-stone-900">Виды техники:</h3>
      
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[
          "Дизельные вилочные погрузчики 1–10 т",
          "Электрические погрузчики (в т.ч. литий-ионные)",
          "Телескопические погрузчики 3–4 т",
          "Ножничные подъёмники 6–12 м",
          "Телескопические подъёмники до 18 м",
          "Коленчатые подъёмники для высотных работ",
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow-sm ring-1 ring-stone-200 text-stone-700 hover:shadow-md transition"
          >
            {item}
          </div>
        ))}
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
          a: "Базовые дизельные модели начинаются от 1,3 млн ₽. Электрические — от 1,6 млн ₽. Цена зависит от высоты подъёма, комплектации и типа двигателя."
        },
        {
          q: "Какие бывают виды погрузчиков?",
          a: "Дизельные, электрические, газ-бензиновые, телескопические, компактные складские модели и специализированные лифты."
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
                "Дизельные модели стоят от 1,3 млн ₽, электрические — от 1,6 млн ₽."
            }
          },
          {
            "@type": "Question",
            name: "Какие бывают виды погрузчиков?",
            acceptedAnswer: {
              "@type": "Answer",
              text:
                "Дизельные, электрические, газ-бензиновые, телескопические, складские компактные."
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

{/* ===== ПРЕИМУЩЕСТВА ===== */} <section id="features" className="py-20 bg-white"> <h2 className="text-3xl font-semibold text-center mb-12"> Почему выбирают Zoomlion </h2> <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 text-center"> {[ { icon: "⚙️", title: "Надёжность", desc: "Каждая единица техники проходит строгие испытания.", }, { icon: "🚀", title: "Производительность", desc: "Оптимальная мощность и эффективность в любых условиях.", }, { icon: "💚", title: "Экологичность", desc: "Низкие выбросы и современные технологии.", }, { icon: "🧰", title: "Сервис", desc: "Сеть обслуживания и запасных частей по всей России.", }, ].map((f, i) => ( <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15, duration: 0.6 }} viewport={{ once: true }} className="p-6 rounded-2xl ring-1 ring-gray-200 shadow-sm hover:shadow-lg transition" > <div className="text-5xl mb-4">{f.icon}</div> <h3 className="font-semibold text-lg mb-2">{f.title}</h3> <p className="text-gray-600 text-sm">{f.desc}</p> </motion.div> ))} </div> </section>

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
        <p className="text-gray-400 mb-6">Телефон: <a href="tel:+79375844555">+7 (937) 584-45-55</a></p>
        <p className="text-gray-400 mb-6">Email: <a href="mailto:ilmir.sky@yandex.ru" className="underline">ilmir.sky@yandex.ru</a></p>
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

