import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        {/* Основные мета-теги */}
        <meta
          name="description"
          content="Официальный дилер Zoomlion в России. Продажа вилочных погрузчиков и подъёмников. Гарантия, лучшая цена и доставка по всей России."
        />
        <meta
          name="keywords"
          content="Zoomlion, вилочные погрузчики, подъемники, складская техника, официальный дилер, купить Zoomlion, доставка по России"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Zoomlion Trade — Складская техника и погрузчики" />
        <meta
          property="og:description"
          content="Официальный дилер Zoomlion в России. Погрузчики, подъемники и складская техника в наличии."
        />
        <meta property="og:image" content="https://zoomliontrade.ru/og-image.png" />
        <meta property="og:url" content="https://zoomliontrade.ru" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ru_RU" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zoomlion Trade — Складская техника и погрузчики" />
        <meta
          name="twitter:description"
          content="Официальный дилер Zoomlion в России. Погрузчики, подъемники и складская техника в наличии."
        />
        <meta name="twitter:image" content="https://zoomliontrade.ru/og-image.png" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" />

        {/* Верификация поисковых систем */}
        <meta name="yandex-verification" content="5a9f0729ecd92141" />
        <meta
          name="google-site-verification"
          content="CKdgblmDfomeaTgwzNHAisOB4lbiphEW9fUWJQcv2Jw"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
