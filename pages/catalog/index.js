import Link from "next/link";

const categories = [
  { title: "Вилочные погрузчики", slug: "forklifts" },
  { title: "Телескопические погрузчики", slug: "telehandlers" },
  { title: "Ножничные подъемники", slug: "scissor-lifts" },
  { title: "Коленчатые подъемники", slug: "articulated-lifts" },
  { title: "Телескопические подъемники", slug: "telescopic-lifts" },
  { title: "Мини-погрузчики", slug: "mini-loaders" },
];

export default function Catalog() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Каталог техники</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/catalog/${cat.slug}`}
            className="block p-6 border rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold">{cat.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

