import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ru">
      <Head>

        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#6dbb13" />

        {/* Верификация поисковых систем */}
        <meta name="yandex-verification" content="5a9f0729ecd92141" />
        <meta name="google-site-verification" content="CKdgblmDfomeaTgwzNHAisOB4lbiphEW9fUWJQcv2Jw" />

        {/* Robots & sitemap */}
        <meta name="robots" content="index, follow" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
