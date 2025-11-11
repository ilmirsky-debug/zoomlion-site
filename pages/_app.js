import "../styles/globals.css";
import Head from "next/head";
import YandexMetrika from "../components/YandexMetrika";
import GoogleAnalytics from "../components/GoogleAnalytics";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* --- Основное SEO --- */}
        <title>Zoomlion Trade — Вилочные погрузчики и подъёмники в России</title>
        <meta
          name="description"
          content="Официальный дилер Zoomlion в России. Вилочные погрузчики, подъёмники и складская техника с гарантией и доставкой по всей России."
        />
        <meta
          name="keywords"
          content="Zoomlion, вилочные погрузчики, подъёмники, складская техника, дилер Zoomlion, купить Zoomlion, Zoomlion Trade"
        />

        {/* --- Favicon и тема --- */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#84cc16" />

        {/* --- Open Graph --- */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Zoomlion Trade — Вилочные погрузчики и подъёмники" />
        <meta
          property="og:description"
          content="Официальный дилер Zoomlion в России. Погрузчики и подъёмники с гарантией, доставкой и сервисом."
        />
        <meta property="og:url" content="https://zoomliontrade.ru" />
        <meta property="og:image" content="https://zoomliontrade.ru/og-image.png" />
        <meta property="og:locale" content="ru_RU" />

        {/* --- Twitter / Telegram --- */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zoomlion Trade — техника Zoomlion в России" />
        <meta
          name="twitter:description"
          content="Вилочные погрузчики и подъёмники Zoomlion — доставка по всей России."
        />
        <meta name="twitter:image" content="https://zoomliontrade.ru/og-image.png" />

        {/* --- Структурированные данные (Schema.org) --- */}
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
                "Официальный дилер Zoomlion в России. Погрузчики, подъёмники и складская техника с гарантией и доставкой.",
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

      {/* --- Метрики и аналитика --- */}
      <YandexMetrika />
      <GoogleAnalytics />

      {/* --- Контент --- */}
      <Component {...pageProps} />
    </>
  );
}

