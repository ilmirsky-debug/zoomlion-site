import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { articles } from "../../content/blog";

export default function BlogArticlePage({ slug }) {

  const article = articles[slug];
  const wordCount = article?.content?.join(" ").split(/\s+/).length || 0;
const readingTime = Math.max(1, Math.ceil(wordCount / 180));

  if (!article) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-stone-600 mb-6">Статья не найдена.</p>
        <Link href="/blog" className="text-lime-600 font-semibold">
          ← Вернуться в блог
        </Link>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{article.title} | Блог Zoomlion Trade</title>
        <meta name="description" content={article.description} />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="article" />
<meta property="og:title" content={article.title} />
<meta property="og:description" content={article.description} />
<meta
  property="og:image"
  content={`https://zoomliontrade.ru${article.image || "/hero1.png"}`}
/>
<meta
  property="og:url"
  content={`https://zoomliontrade.ru/blog/${slug}`}
/>

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={article.title} />
<meta name="twitter:description" content={article.description} />
<meta
  name="twitter:image"
  content={`https://zoomliontrade.ru${article.image || "/hero1.png"}`}
/>

<link
  rel="canonical"
  href={`https://zoomliontrade.ru/blog/${slug}`}
/>
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      image: `https://zoomliontrade.ru${article.image || "/hero1.png"}`,
      datePublished: article.date,
      dateModified: article.date,
      author: {
        "@type": "Organization",
        name: "Zoomlion Trade",
      },
      publisher: {
        "@type": "Organization",
        name: "Zoomlion Trade",
        logo: {
          "@type": "ImageObject",
          url: "https://zoomliontrade.ru/logo.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://zoomliontrade.ru/blog/${slug}`,
      },
    }),
  }}
/>
{article.faq && (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }),
    }}
  />
)}

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Главная",
          item: "https://zoomliontrade.ru",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Блог",
          item: "https://zoomliontrade.ru/blog",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.title,
          item: `https://zoomliontrade.ru/blog/${slug}`,
        },
      ],
    }),
  }}
/>

</Head>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <nav className="text-sm text-stone-500 mb-8">
  <Link href="/" className="hover:text-lime-600">
    Главная
  </Link>

  <span className="mx-2">→</span>

  <Link href="/blog" className="hover:text-lime-600">
    Блог
  </Link>

  <span className="mx-2">→</span>

  <span className="text-stone-800">
    {article.title}
  </span>
</nav>

        <div className="flex flex-wrap items-center gap-3 mt-8 mb-5 text-sm">
  <span className="px-3 py-1 rounded-full bg-lime-100 text-lime-700 font-semibold">
    {article.category}
  </span>

  <span className="text-stone-500">
    {article.date}
  </span>

  <span className="text-stone-400">
    •
  </span>

  <span className="text-stone-500">
    {readingTime} мин. чтения
  </span>
</div>

<h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-8 leading-tight">
  {article.title}
</h1>
        <div className="relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden mb-12">
  <Image
    src={article.image || "/hero1.png"}
    alt={article.title}
    fill
    className="object-cover"
  />
</div>
<div className="mb-12 p-6 md:p-8 rounded-3xl bg-stone-950 text-white">
  <h2 className="text-2xl font-extrabold mb-5">
    Кратко
  </h2>

  <ul className="grid md:grid-cols-2 gap-4 text-stone-200">
    <li>✓ Определите рабочую высоту и грузоподъёмность заранее.</li>
    <li>✓ Для помещений чаще подходят электрические модели.</li>
    <li>✓ Для улицы и тяжёлых условий лучше выбирать дизельную технику.</li>
    <li>✓ Покупайте технику с запасом по параметрам и сервисной поддержкой.</li>
  </ul>
</div>
<div className="flex items-center gap-4 mb-12 p-5 rounded-3xl border border-stone-200 bg-white">
  <div className="w-14 h-14 rounded-full bg-lime-500 flex items-center justify-center text-black font-extrabold text-lg">
    ZT
  </div>

  <div>
    <p className="font-bold text-stone-900">
      Команда Zoomlion Trade
    </p>

    <p className="text-sm text-stone-500">
      Эксперты по складской и строительной технике
    </p>
  </div>
</div>
<div className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4">
  <div className="rounded-3xl bg-stone-950 text-white p-5">
    <p className="text-3xl font-extrabold text-lime-400">10+</p>
    <p className="text-sm text-stone-300 mt-2">лет опыта</p>
  </div>

  <div className="rounded-3xl bg-stone-950 text-white p-5">
    <p className="text-3xl font-extrabold text-lime-400">500+</p>
    <p className="text-sm text-stone-300 mt-2">единиц техники</p>
  </div>

  <div className="rounded-3xl bg-stone-950 text-white p-5">
    <p className="text-3xl font-extrabold text-lime-400">24/7</p>
    <p className="text-sm text-stone-300 mt-2">поддержка</p>
  </div>

  <div className="rounded-3xl bg-stone-950 text-white p-5">
    <p className="text-3xl font-extrabold text-lime-400">РФ</p>
    <p className="text-sm text-stone-300 mt-2">доставка по России</p>
  </div>
</div>
{article.sections && (
  <div className="mb-12 p-6 md:p-8 rounded-3xl bg-stone-950 text-white border border-stone-800 shadow-xl">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-extrabold">
        Содержание
      </h2>

      <span className="text-sm text-lime-400 font-semibold">
        {article.sections.length} раздела
      </span>
    </div>

    <ul className="space-y-3">
      {article.sections.map((section, index) => (
        <li key={index}>
          <a
            href={`#section-${index}`}
            className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition"
          >
            <span className="text-lime-400 font-extrabold">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="text-stone-200 group-hover:text-white transition">
              {section.title}
            </span>
          </a>
        </li>
      ))}
    </ul>
  </div>
)}
      {article.content && (
  <div className="prose prose-stone max-w-none">
    {article.content.map((paragraph, index) => (
      <p key={index} className="text-lg leading-8 text-stone-700 mb-6">
        {paragraph}
      </p>
    ))}
  </div>
)}
        {article.sections && (
  <div className="mt-16 space-y-16">
    {article.sections.map((section, index) => (
      <section id={`section-${index}`} key={index} className="scroll-mt-24">
        <h2 className="text-3xl font-bold text-stone-900 mb-6 border-l-4 border-lime-500 pl-4">
          {section.title}
        </h2>

        <div className="space-y-6">
          {section.text.map((paragraph, pIndex) => (
            <p
              key={pIndex}
              className="text-lg leading-8 text-stone-700"
            >
              {paragraph}
            </p>
          ))}
        </div>
        {section.quote && (
  <blockquote className="mt-8 rounded-3xl bg-stone-950 text-white p-8 border-l-4 border-lime-500">
    <p className="text-xl md:text-2xl font-bold leading-relaxed">
      “{section.quote}”
    </p>

    <p className="mt-5 text-lime-400 font-semibold">
      Zoomlion Trade
    </p>
  </blockquote>
)}
      </section>
    ))}
  </div>
)}
{article.faq && (
  <div className="mt-16 mb-16">
    <h2 className="text-3xl font-bold text-stone-900 mb-8">
      Часто задаваемые вопросы
    </h2>

    <div className="space-y-5">
      {article.faq.map((item, index) => (
        <div
          key={index}
          className="p-6 rounded-3xl border border-stone-200 bg-white"
        >
          <h3 className="text-xl font-bold mb-3">
            {item.question}
          </h3>

          <p className="text-stone-600 leading-7">
            {item.answer}
          </p>
        </div>
      ))}
    </div>
  </div>
)}
<div className="mt-20 mb-16">
  <h2 className="text-3xl font-bold text-stone-900 mb-8">
    Читайте также
  </h2>

  <div className="grid md:grid-cols-3 gap-6">

    <Link
      href="/blog/dizelnyj-ili-elektricheskij-pogruzchik"
      className="group rounded-3xl border border-stone-200 p-6 hover:shadow-xl transition"
    >
      <h3 className="text-xl font-bold mb-3 group-hover:text-lime-600 transition">
        Дизельный или электрический погрузчик?
      </h3>

      <p className="text-stone-600">
        Сравниваем преимущества различных типов погрузчиков.
      </p>
    </Link>

    <Link
      href="/blog/kak-vybrat-nozhnichnyj-podemnik"
      className="group rounded-3xl border border-stone-200 p-6 hover:shadow-xl transition"
    >
      <h3 className="text-xl font-bold mb-3 group-hover:text-lime-600 transition">
        Как выбрать ножничный подъемник
      </h3>

      <p className="text-stone-600">
        Основные параметры выбора подъемной техники.
      </p>
    </Link>

    <Link
      href="/blog/mini-pogruzchik-dlya-sklada"
      className="group rounded-3xl border border-stone-200 p-6 hover:shadow-xl transition"
    >
      <h3 className="text-xl font-bold mb-3 group-hover:text-lime-600 transition">
        Мини-погрузчик для склада и производства
      </h3>

      <p className="text-stone-600">
        Где применяются мини-погрузчики и как выбрать модель.
      </p>
    </Link>

  </div>
</div>
        <div className="mt-12 p-6 rounded-3xl bg-stone-100">
          <h2 className="text-2xl font-bold mb-3">
            Нужна техника для склада?
          </h2>

          <p className="text-stone-600 mb-5">
            Поможем подобрать вилочный погрузчик под грузоподъёмность, высоту
            подъёма и условия эксплуатации.
          </p>

          <button
            onClick={() =>
              window.openForm && window.openForm("Консультация по вилочному погрузчику")
            }
            className="bg-lime-500 text-black px-6 py-3 rounded-full font-semibold hover:bg-lime-400 transition"
          >
            Получить консультацию
          </button>
        </div>
      </main>
    </>
  );
}
export async function getStaticPaths() {
  return {
    paths: Object.keys(articles).map((slug) => ({
      params: { slug },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      slug: params.slug,
    },
  };
}
