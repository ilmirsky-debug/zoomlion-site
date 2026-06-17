import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { articles } from "../../content/blog";

export default function BlogArticlePage() {
  const router = useRouter();
  const { slug } = router.query;

  const article = articles[slug];

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

        <p className="text-stone-500 mt-8 mb-3">{article.date}</p>

        <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-8">
          {article.title}
        </h1>
        <div className="relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden mb-12">
  <Image
    src="/hero1.png"
    alt={article.title}
    fill
    className="object-cover"
  />
</div>
<div className="mb-12 p-6 rounded-3xl bg-stone-100 border border-stone-200">
  <h2 className="text-xl font-bold mb-4">Содержание</h2>

  <ul className="space-y-3 text-stone-700">
    <li>• Как определить грузоподъёмность</li>
    <li>• Как выбрать высоту подъёма</li>
    <li>• Дизельный или электрический погрузчик</li>
    <li>• На что обратить внимание перед покупкой</li>
  </ul>
</div>
        <div className="prose prose-stone max-w-none">
          {article.content.map((paragraph, index) => (
            <p key={index} className="text-lg leading-8 text-stone-700 mb-6">
              {paragraph}
            </p>
          ))}
        </div>
<div className="mt-16 mb-16">
  <h2 className="text-3xl font-bold text-stone-900 mb-8">
    Часто задаваемые вопросы
  </h2>

  <div className="space-y-5">

    <div className="p-6 rounded-3xl border border-stone-200 bg-white">
      <h3 className="text-xl font-bold mb-3">
        Какой погрузчик лучше для склада?
      </h3>

      <p className="text-stone-600 leading-7">
        Для закрытых помещений чаще выбирают электрические погрузчики, а для
        интенсивной работы на улице — дизельные модели.
      </p>
    </div>

    <div className="p-6 rounded-3xl border border-stone-200 bg-white">
      <h3 className="text-xl font-bold mb-3">
        Как выбрать грузоподъёмность?
      </h3>

      <p className="text-stone-600 leading-7">
        Рекомендуется выбирать технику с запасом грузоподъёмности 15–20% от
        максимального веса груза.
      </p>
    </div>

    <div className="p-6 rounded-3xl border border-stone-200 bg-white">
      <h3 className="text-xl font-bold mb-3">
        Что лучше: дизельный или электрический погрузчик?
      </h3>

      <p className="text-stone-600 leading-7">
        Всё зависит от условий эксплуатации. Для складов предпочтительнее
        электрические модели, а для улицы и тяжёлых условий — дизельные.
      </p>
    </div>

  </div>
</div>
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