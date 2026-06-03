import "../styles/globals.css";
import Head from "next/head";
import YandexMetrika from "../components/YandexMetrika";
import GoogleAnalytics from "../components/GoogleAnalytics";
import dynamic from "next/dynamic";

const ModalForm = dynamic(() => import("../components/ModalForm"), { ssr: false });

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>

        {/* ========== ГЛАВНЫЙ TITLE (оптимизирован, < 580px) ========== */}
        <title>
  Погрузчики, мини-погрузчики и подъемники — продажа и поставка по России | Zoomlion (Зумлион)
</title>

        {/* ========== ГЛАВНОЕ ОПИСАНИЕ (одно, без дублей!) ========== */}
        <meta
  name="description"
  content="Продажа вилочных погрузчиков, мини-погрузчиков и подъёмников. Дизельные и электрические модели от ведущих производителей. Поставка по всей России. Официальный дилер Zoomlion (Зумлион)."
/>

        {/* ========== КЛЮЧЕВЫЕ СЛОВА — не критично, но пусть будут ========== */}
        <meta
          name="keywords"
          content="Zoomlion, вилочные погрузчики, мини-погрузчики, подъёмники, складская техника, купить погрузчик, дилер Zoomlion (Зумлион)"
        />

        {/* ========== FAVICON / ТЕМА ========== */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#84cc16" />

        {/* ========== OPEN GRAPH (исправлено + сокращено) ========== */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Zoomlion Trade — вилочные и мини-погрузчики, подъёмники"
        />
        <meta
          property="og:description"
          content="Погрузчики и подъёмники Zoomlion (Зумлион) в наличии. Доставка и сервис по всей России."
        />
        <meta property="og:url" content="https://zoomliontrade.ru" />
        <meta property="og:image" content="https://zoomliontrade.ru/og-image.png" />
        <meta property="og:locale" content="ru_RU" />

        {/* ========== TWITTER CARD ========== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Zoomlion Trade — погрузчики и подъёмники Zoomlion (Зумлион)"
        />
        <meta
          name="twitter:description"
          content="Официальный дилер. Погрузочная техника Zoomlion (Зумлион) в России."
        />
        <meta name="twitter:image" content="https://zoomliontrade.ru/og-image.png" />

        {/* ========== STRUCTURED DATA (оставил, всё корректно) ========== */}
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
                "Официальный дилер Zoomlion (Зумлион) в России. Погрузчики, подъёмники и мини-погрузчики с гарантией и доставкой.",
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

      {/* Метрики */}
      <YandexMetrika />
      <GoogleAnalytics />

      {/* Контент */}
      <Component {...pageProps} />

      {/* Модальное окно */}
      <ModalForm />
    </>
  );
}
