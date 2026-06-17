import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { articles } from "../../content/blog";

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState("Все");
    const [searchQuery, setSearchQuery] = useState("");

const categories = ["Все", "Погрузчики", "Подъемники", "Сервис"];

const articleEntries = Object.entries(articles).filter(([slug, article]) => {
  const matchesCategory =
    activeCategory === "Все" || article.category === activeCategory;

  const matchesSearch =
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase());

  return matchesCategory && matchesSearch;
});
const featuredArticle = articleEntries[0];
const otherArticles = articleEntries.slice(1);
  return (
    <main className="bg-stone-50 min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-14">
            <nav className="text-sm text-stone-500 mb-8">
  <Link href="/" className="hover:text-lime-600 transition">
    Главная
  </Link>

  <span className="mx-2">→</span>

  <span className="text-stone-900 font-medium">
    Блог
  </span>
</nav>
          <p className="text-lime-600 font-semibold mb-3 uppercase tracking-wide">
            Полезные материалы
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-5">
            Блог о складской и строительной технике
          </h1>

          <p className="text-stone-600 text-lg max-w-3xl">
            Практические статьи о выборе погрузчиков, подъемников, сервисе,
            эксплуатации и покупке техники для бизнеса.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 mt-8">
  {categories.map((category) => (
    <button
      key={category}
      onClick={() => setActiveCategory(category)}
      className={`px-5 py-3 rounded-full font-semibold border transition ${
        activeCategory === category
          ? "bg-lime-500 border-lime-500 text-black"
          : "bg-white border-stone-300 text-stone-700 hover:border-lime-500"
      }`}
    >
      {category}
    </button>
  ))}
</div>
<div className="mt-6 max-w-xl">
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Поиск по статьям..."
    className="w-full px-5 py-4 rounded-2xl border border-stone-300 bg-white focus:outline-none focus:border-lime-500"
  />
</div>

        {featuredArticle && (
  <Link
    href={`/blog/${featuredArticle[0]}`}
    className="group block mb-12 rounded-[2rem] overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-2xl transition-all duration-300"
  >
    <div className="grid lg:grid-cols-2">
      <div className="relative h-72 lg:h-[420px] bg-stone-100">
        <Image
          src={featuredArticle[1].image || "/hero1.png"}
          alt={featuredArticle[1].title}
          fill
          className="object-cover group-hover:scale-105 transition duration-700"
        />
      </div>

      <div className="p-8 lg:p-12 flex flex-col justify-center">
        <p className="text-lime-600 font-semibold mb-4">
          Главная статья
        </p>

        <h2 className="text-3xl lg:text-5xl font-extrabold text-stone-900 mb-5 leading-tight group-hover:text-lime-600 transition">
          {featuredArticle[1].title}
        </h2>

        <p className="text-stone-600 text-lg mb-8">
          {featuredArticle[1].excerpt || featuredArticle[1].description}
        </p>

        <span className="inline-flex font-bold text-stone-900 group-hover:text-lime-600 transition">
          Читать статью →
        </span>
      </div>
    </div>
  </Link>
)}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherArticles.map(([slug, article]) => (
            <Link
              key={slug}
              href={`/blog/${slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-56 bg-stone-100 overflow-hidden">
                <Image
                  src={article.image || "/hero1.png"}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-6">
                <p className="text-sm text-stone-500 mb-3">
                  {article.date}
                </p>

                <h2 className="text-xl font-extrabold text-stone-900 mb-3 line-clamp-2 group-hover:text-lime-600 transition">
                  {article.title}
                </h2>

                <p className="text-stone-600 mb-6 line-clamp-3">
                  {article.excerpt || article.description}
                </p>

                <span className="inline-flex items-center font-semibold text-stone-900 group-hover:text-lime-600 transition">
                  Читать статью →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}