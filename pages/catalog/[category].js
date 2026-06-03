import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import BackHome from "../../components/BackHome";
import Image from "next/image";
import GeneratePDF from "../../components/GeneratePDF";

// ----------------------------------------------------
// HERO BACKGROUNDS
// ----------------------------------------------------
const heroBackgrounds = {
  "articulated-lifts": "/hero/articulated.jpg",
  forklifts: "/hero/forklifts.jpg",
  "mini-loaders": "/hero/miniloaders.jpg",
  "scissor-lifts": "/hero/scissor.jpg",
  telehandlers: "/hero/telehandlers.jpg",
  "telescopic-lifts": "/hero/telescopic.jpg",
};

// ----------------------------------------------------
// CATEGORIES (единственный правильный список)
// ----------------------------------------------------
const categoriesList = [
  { slug: "forklifts", title: "Вилочные погрузчики" },
  { slug: "telehandlers", title: "Телескопические погрузчики" },
  { slug: "scissor-lifts", title: "Ножничные подъемники" },
  { slug: "articulated-lifts", title: "Коленчатые подъемники" },
  { slug: "telescopic-lifts", title: "Телескопические подъемники" },
  { slug: "mini-loaders", title: "Мини-погрузчики" },
];

// ----------------------------------------------------
// FILTER OPTIONS
// ----------------------------------------------------
const capacityOptions = [
  "1,5 т.", "1,8 т.", "2,0 т.", "2,5 т.", "3,0 т.", "3,5 т.", "3,5 т. 4х4.",
  "5 т. mini.", "7 т.", "10 т.", "12 т.", "18 т.", "25 т."
];

const liftOptions = [
  "3 м.", "4,5 м.", "4,8 м.", "6 м.", "6,5 м.", "7,8 м.", "10 м.", "11,8 м.", "13,8 м.",
  "15,7 м.", "18 м.", "11,55 м.", "16 m.", "21,45 м.", "26,23 м.", "33,85 м.",
  "22,75 м.", "28,20 м.", "44,08 м.", "32,48 м.", "36 м.", "40,2 м.", "58,8 м.", "67,5 м."
];

const driveOptions = ["Дизель", "Бензин", "Газ-Бензин", "Электрический"];

// ===================================================================
// COMPONENT
// ===================================================================
export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [seoText, setSeoText] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [capacityFilter, setCapacityFilter] = useState("");
  const [liftFilter, setLiftFilter] = useState("");
  const [driveFilter, setDriveFilter] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
const [sidebarOpen, setSidebarOpen] = useState(false);

  const heroBg = heroBackgrounds[category] || "/hero/default.jpg";

  // ----------------------------------------------------
  // LOAD DATA
  // ----------------------------------------------------
  useEffect(() => {
    if (!category) return;

    const load = async () => {
      const res = await fetch("/stock/stock.json");
      const data = await res.json();

      const normalized = data
        .filter((item) => item.category === category)
        .map((item) => ({
          ...item,
          images: item.images?.length ? item.images : item.img ? [item.img] : [],
        }));

      setItems(normalized);

      // ВАЖНО — теперь передаём items внутрь SEO-функции
      setSeoText(getSEOText(category, normalized));
    };

    load();
  }, [category]);

  // ----------------------------------------------------
  // APPLY FILTERS
  // ----------------------------------------------------
  useEffect(() => {
    let filtered = [...items];

    if (capacityFilter) filtered = filtered.filter((i) => i.capacity === capacityFilter);
    if (liftFilter) filtered = filtered.filter((i) => i.liftHeight === liftFilter);
    if (driveFilter) filtered = filtered.filter((i) => i.drive === driveFilter);

    setFilteredItems(filtered);
  }, [items, capacityFilter, liftFilter, driveFilter]);

  // ----------------------------------------------------
  // LIGHTBOX
  // ----------------------------------------------------
  function openLightbox(item, startIndex = 0) {
    if (!item) return;
    const images = item.images?.length ? item.images : item.img ? [item.img] : [];
    if (!images.length) return;

    setLightboxImages(images);
    setLightboxIndex(startIndex);
    setLightboxOpen(true);
  }

  function closeLightbox() { setLightboxOpen(false); }
  function prevImage() { setLightboxIndex((i) => (i === 0 ? lightboxImages.length - 1 : i - 1)); }
  function nextImage() { setLightboxIndex((i) => (i === lightboxImages.length - 1 ? 0 : i + 1)); }

  const goToCategory = (slug) => router.push(`/catalog/${slug}`);
const currentCategory =
  typeof category === "string"
    ? category
    : router.asPath?.split("/catalog/")[1]?.split("?")[0] || "";

  // ===================================================================
  // RENDER
  // ===================================================================
  return (
    <>
      <Head>
  <title>{getCategorySeoTitle(currentCategory)}</title>

  <meta
    name="description"
    content={getCategorySeoDescription(currentCategory, filteredItems.length)}
  />

  <meta name="robots" content="index, follow" />

  <meta property="og:title" content={getCategorySeoTitle(currentCategory)} />
  <meta
    property="og:description"
    content={getCategorySeoDescription(currentCategory, filteredItems.length)}
  />
  <meta property="og:image" content="https://zoomliontrade.ru/og-image.png" />
  <meta
    property="og:url"
    content={`https://zoomliontrade.ru/catalog/${currentCategory}`}
  />
  <meta property="og:type" content="website" />

  <link
    rel="canonical"
    href={`https://zoomliontrade.ru/catalog/${currentCategory}`}
  />
</Head>



      <div className="max-w-7xl mx-auto p-6 min-h-screen grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-10">

        {/* HERO */}
        <div className="col-span-full mb-8 relative rounded-2xl overflow-hidden h-64 sm:h-80 lg:h-96">
          <Image
            key={category}
            src={heroBackgrounds[category] || "/hero/fallback.jpg"}
            alt={getCategoryName(category)}
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700 ease-in-out"
            onError={(e) => { e.currentTarget.src = "/hero/fallback.jpg"; }}
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold text-center px-4">
              {getCategoryName(category)}
            </h1>
          </div>
        </div>
{/* === MOBILE SIDEBAR BUTTON === */}
<div className="lg:hidden mb-6">
  <button
    onClick={() => setSidebarOpen(true)}
    className="px-4 py-2 bg-black text-white rounded-lg font-semibold"
  >
    Фильтры
  </button>
</div>

{/* === MOBILE SIDEBAR MODAL === */}
{sidebarOpen && (
  <div className="fixed inset-0 z-50 bg-black/50 p-4 overflow-auto">
    <aside className="bg-white w-full max-w-xs h-full p-5 rounded-xl overflow-auto">
      {/* Кнопка закрытия */}
      <button
        onClick={() => setSidebarOpen(false)}
        className="mb-4 text-red-500 font-bold"
      >
        Закрыть
      </button>

      {/* КАТЕГОРИИ */}
      <h3 className="text-xl font-bold mb-4">Категории</h3>
      <div className="flex flex-col gap-2 text-lg">
        {categoriesList.map((c) => (
          <button
            key={c.slug}
            onClick={() => {
              goToCategory(c.slug);
              setSidebarOpen(false); // закрываем модалку после выбора
            }}
            className={`p-3 rounded-xl transition text-left border ${
              c.slug === category
                ? "bg-black text-white border-black"
                : "hover:bg-stone-100 border-stone-200"
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* ФИЛЬТРЫ */}
      <div className="mt-8 space-y-5">
        {/* Грузоподъёмность */}
        <div>
          <h4 className="font-semibold mb-2">Грузоподъёмность</h4>
          <select
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 bg-stone-50 focus:bg-white focus:border-black transition"
          >
            <option value="">Все</option>
            {capacityOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Высота подъёма */}
        <div>
          <h4 className="font-semibold mb-2">Высота подъёма</h4>
          <select
            value={liftFilter}
            onChange={(e) => setLiftFilter(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 bg-stone-50 focus:bg-white focus:border-black transition"
          >
            <option value="">Все</option>
            {liftOptions.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Тип привода */}
        <div>
          <h4 className="font-semibold mb-2">Тип привода</h4>
          <select
            value={driveFilter}
            onChange={(e) => setDriveFilter(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 bg-stone-50 focus:bg-white focus:border-black transition"
          >
            <option value="">Все</option>
            {driveOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Сброс фильтров */}
        {(capacityFilter || liftFilter || driveFilter) && (
          <button
            onClick={() => {
              setCapacityFilter("");
              setLiftFilter("");
              setDriveFilter("");
            }}
            className="w-full mt-2 bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-600 transition"
          >
            Сбросить фильтры
          </button>
        )}
      </div>

      {/* BACK HOME */}
      <div className="mt-8">
        <BackHome />
      </div>
    </aside>
  </div>
)}


                {/* SIDEBAR */}
<aside className="hidden lg:block border rounded-2xl p-5 bg-white shadow-md h-fit sticky top-6">
  <h3 className="text-xl font-bold mb-4">Категории</h3>

  <div className="flex flex-col gap-2 text-lg">
    {categoriesList.map((c) => (
      <button
        key={c.slug}
        onClick={() => goToCategory(c.slug)}
        className={`p-3 rounded-xl transition text-left border ${
          c.slug === category
            ? "bg-black text-white border-black"
            : "hover:bg-stone-100 border-stone-200"
        }`}
      >
        {c.title}
      </button>
    ))}
  </div>

  {/* FILTERS */}
  <div className="mt-8 space-y-5">
    {/* Грузоподъёмность */}
    <div>
      <h4 className="font-semibold mb-2">Грузоподъёмность</h4>
      <select
        value={capacityFilter}
        onChange={(e) => setCapacityFilter(e.target.value)}
        className="w-full border rounded-xl px-3 py-2 bg-stone-50 focus:bg-white focus:border-black transition"
      >
        <option value="">Все</option>
        {capacityOptions.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>

    {/* Высота подъёма */}
    <div>
      <h4 className="font-semibold mb-2">Высота подъёма</h4>
      <select
        value={liftFilter}
        onChange={(e) => setLiftFilter(e.target.value)}
        className="w-full border rounded-xl px-3 py-2 bg-stone-50 focus:bg-white focus:border-black transition"
      >
        <option value="">Все</option>
        {liftOptions.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>
    </div>

    {/* Тип привода */}
    <div>
      <h4 className="font-semibold mb-2">Тип привода</h4>
      <select
        value={driveFilter}
        onChange={(e) => setDriveFilter(e.target.value)}
        className="w-full border rounded-xl px-3 py-2 bg-stone-50 focus:bg-white focus:border-black transition"
      >
        <option value="">Все</option>
        {driveOptions.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>

    {(capacityFilter || liftFilter || driveFilter) && (
      <button
        onClick={() => {
          setCapacityFilter("");
          setLiftFilter("");
          setDriveFilter("");
        }}
        className="w-full mt-2 bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-600 transition"
      >
        Сбросить фильтры
      </button>
    )}
  </div>

  <div className="mt-8">
    <BackHome />
  </div>
</aside>


        {/* RIGHT COLUMN — ВСЁ ПРАВО    */}
        <div className="space-y-16">

          {/* ITEMS */}
          <div>
            {filteredItems.length === 0 && (
              <p className="text-stone-600">
                Техника в этой категории пока не добавлена.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-10 relative z-0">
              {filteredItems.map((item) => {
                const firstImage = item.images?.[0] || "/stock/noimage.jpg";

                return (
                  <div
                    key={item.slug}
                    className="border rounded-2xl bg-white shadow-sm hover:shadow-lg transition p-5 flex flex-col h-full"
                  >
                    {/* Фото */}
                    <div
                      className="w-full h-60 flex items-center justify-center border rounded-xl bg-white shadow-sm overflow-hidden mb-4 cursor-pointer"
                      onClick={() => openLightbox(item)}
                    >
                      <img
                        src={firstImage}
                        alt={item.title}
                        className="max-h-full max-w-full object-contain p-2"
                      />
                    </div>

                    {/* Название / описание */}
                    <h2 className="text-xl font-semibold mb-2 line-clamp-2 break-words">
  <a
    href={`/product/${item.slug}`}
    className="hover:underline"
  >
    {item.title}
  </a>
</h2>


                    <p className="text-stone-600 text-sm mb-4 line-clamp-3">
                      {item.desc}
                    </p>

                    {/* Характеристики */}
                    <div className="text-sm text-stone-700 space-y-1 mb-4">
                      {item.capacity && (
                        <h3 className="font-semibold text-sm">Грузоподъёмность: {item.capacity}</h3>
                      )}
                      {item.liftHeight && (
                        <h3 className="font-semibold text-sm">Высота подъёма: {item.liftHeight}</h3>
                      )}
                      {item.drive && (
                        <h3 className="font-semibold text-sm">Тип привода: {item.drive}</h3>
                      )}
                    </div>

                    {/* Цена */}
                    <div className="mt-auto">
                      <p className="text-lg font-bold mb-3">{item.price}</p>
                    </div>

                    {/* Кнопки */}
                    <div className="flex flex-col gap-3 mt-4">
                      <button
                        onClick={() =>
                          window.openForm && window.openForm(item.title)
                        }
                        className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-stone-800 transition"
                      >
                        Запросить предложение
                      </button>

                      <GeneratePDF item={item} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SEO TEXT — ВСЕГДА ПОД КАРТОЧКАМИ */}
          <section className="p-7 bg-white border rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4"> О категории</h2>
            <p className="leading-relaxed whitespace-pre-line">{seoText}</p>
          </section>
</div>



        {/* LIGHTBOX */}
        {lightboxOpen && (
          <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
            <button onClick={closeLightbox} className="absolute top-6 right-6 text-white text-3xl">×</button>

            <div className="relative w-full max-w-3xl h-[70vh]">
              <img src={lightboxImages[lightboxIndex]} className="w-full h-full object-contain" />
              <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-4xl">‹</button>
              <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-4xl">›</button>
            </div>

            <div className="flex gap-3 mt-4">
              {lightboxImages.map((img, i) => (
                <img key={i} src={img} onClick={() => setLightboxIndex(i)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer ${i === lightboxIndex ? "ring-2 ring-white" : "opacity-60"}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ===================================================================
// SEO FUNCTION
// ===================================================================
function getSEOText(slug, items = []) {
  const drives = [...new Set(items.map(i => i.drive).filter(Boolean))];
  const parseNumber = (s) => { if (!s) return NaN; const cleaned = String(s).replace(",", ".").match(/[\d.]+/); return cleaned ? Number(cleaned[0]) : NaN; };
  const capacityNums = items.map(i => { if (!i.capacity) return NaN; const s = String(i.capacity); if (s.includes("кг")) { const n = parseNumber(s); return isNaN(n) ? NaN : n / 1000; } return parseNumber(s); }).filter(n => !isNaN(n));
  const liftNums = items.map(i => parseNumber(i.liftHeight)).filter(n => !isNaN(n));
  const driveText = drives.length ? `В каталоге представлены модели с типом привода: ${drives.join(", ")}. ` : "";
  const capacityText = capacityNums.length ? `Средняя грузоподъёмность — ${(capacityNums.reduce((a, b) => a + b, 0) / capacityNums.length).toFixed(1)} т. ` : "";
  const liftText = liftNums.length ? `Средняя высота подъёма — ${(liftNums.reduce((a, b) => a + b, 0) / liftNums.length).toFixed(1)} м. ` : "";

  const texts = {
    forklifts: `
Вилочные погрузчики востребованы на складах, строительных площадках и в логистических центрах, поскольку позволяют быстро перемещать грузы и оптимизировать рабочие процессы. Если вы ищете, где купить вилочный погрузчик с подходящей грузоподъёмностью и высотой подъёма, в каталоге представлены популярные модели как дизельного, так и электрического типа. Здесь вы можете подобрать технику для ежедневной интенсивной эксплуатации или для работы в ограниченных пространствах.
${driveText}${capacityText}${liftText}
Также представлены модели бренда Zoomlion (зумлион), отличающиеся надёжностью и простым обслуживанием. Все погрузчики проходят предпродажную подготовку и доступны с различными мачтами и навесным оборудованием. Выбирайте оптимальный вариант по цене, характеристикам и комплектации.`,
    telehandlers: `
Телескопические погрузчики — универсальная техника, применяемая в строительстве, сельском хозяйстве и промышленности. Если вы хотите купить телескопический погрузчик с нужным вылетом стрелы и грузоподъёмностью, здесь собраны практичные и проверенные модели, подходящие для различных задач. Машины оснащаются надёжными силовыми установками и удобным управлением, что упрощает работу оператора.
${driveText}${capacityText}${liftText}
В каталоге представлены решения с разным функционалом: от компактных вариантов до многоцелевых агрегатов для больших проектов. Также доступны модели бренда Zoomlion (зумлион), демонстрирующие выгодное соотношение стоимости и возможностей. Выбирайте технику, которая обеспечит производительность и безопасность на вашем объекте.`,
    "mini-loaders": `
Мини-погрузчики — компактная и функциональная техника, применяемая в строительстве, сельском хозяйстве и коммунальной сфере. Если вы хотите купить мини-погрузчик с нужной мощностью и высотой подъёма, здесь представлены универсальные модели, способные работать с широким спектром навесного оборудования.
${driveText}${capacityText}${liftText}
Машины отличаются высокой маневренностью, прочной конструкцией и простотой обслуживания. В каталоге также доступны мини-погрузчики Zoomlion (зумлион), выделяющиеся выгодной стоимостью и надёжностью в эксплуатации. Выберите технику с оптимальными характеристиками для решения задач на вашем объекте.`,
    "scissor-lifts": `
Ножничные подъемники используются для безопасной работы на высоте в складских комплексах, торговых центрах, производственных помещениях и на строительных объектах. Если вы планируете купить ножничный подъемник, важно учитывать рабочую высоту, грузоподъёмность платформы и тип привода.

${driveText}${capacityText}${liftText}

В каталоге представлены самоходные ножничные подъемники Zoomlion (Зумлион), предназначенные для интенсивной ежедневной эксплуатации. Подъемники Zoomlion отличаются надёжностью, низкими эксплуатационными расходами и удобством управления. Если вам необходимо купить подъемник Zoomlion или подобрать современный ножничный подъемник Зумлион для склада, производства или строительства, вы можете выбрать подходящую модель по характеристикам, рабочей высоте и стоимости. Все модели обеспечивают высокий уровень безопасности и соответствуют современным требованиям эксплуатации высотной техники.`,
    "articulated-lifts": `
Коленчатые подъемники предназначены для выполнения высотных работ в труднодоступных местах, где требуется большой вылет стрелы и возможность обхода препятствий. Если вы хотите купить коленчатый подъемник для строительства, обслуживания зданий, монтажа инженерных систем или промышленного применения, в каталоге представлены современные решения различных классов.

${driveText}${capacityText}${liftText}

Коленчатые подъемники Zoomlion (Зумлион) сочетают высокую производительность, безопасность и простоту обслуживания. В каталоге доступны электрические и дизельные модели для работы как внутри помещений, так и на открытых площадках. Если вам требуется купить подъемник Zoomlion или подобрать коленчатый подъемник Зумлион с оптимальной рабочей высотой и вылетом стрелы, вы можете выбрать технику под конкретные задачи. Подъемники Zoomlion успешно используются на строительных и промышленных объектах по всей России.`,
    "telescopic-lifts": `
Телескопические подъемники применяются при строительстве, монтаже металлоконструкций, фасадных работах и обслуживании промышленных объектов. Если вам необходимо купить телескопический подъемник с большой рабочей высотой и максимальным горизонтальным вылетом, в каталоге представлены модели для различных условий эксплуатации.

${driveText}${capacityText}${liftText}

Телескопические подъемники Zoomlion (Зумлион) обеспечивают устойчивость платформы, высокую скорость подъёма и надёжную работу даже при интенсивной нагрузке. В наличии представлены современные самоходные подъемники Zoomlion с дизельным и электрическим приводом. Если вы планируете купить подъемник Zoomlion или подобрать телескопический подъемник Зумлион для строительного объекта, производства или аренды спецтехники, вы сможете выбрать оптимальную модель по рабочей высоте, грузоподъёмности и комплектации. Такая техника позволяет значительно повысить эффективность и безопасность высотных работ.`,
  };

 return texts[slug] || "";
}

// ----------------------------------------------------
function getCategoryName(slug) {
  const c = categoriesList.find((x) => x.slug === slug);
  return c ? c.title : "Каталог";
}

// ----------------------------------------------------
function getCategorySeoTitle(slug) {
  const titles = {
    forklifts:
      "Купить вилочный погрузчик — цены и наличие | Zoomlion (Зумлион)",
    telehandlers:
      "Купить телескопический погрузчик — цены и характеристики",
    "mini-loaders":
      "Купить мини-погрузчик — цены, наличие и доставка по России",
    "scissor-lifts":
      "Купить ножничный подъемник Zoomlion (Зумлион) — цены и наличие",
    "articulated-lifts":
      "Купить коленчатый подъемник Zoomlion (Зумлион) — каталог и цены",
    "telescopic-lifts":
      "Купить телескопический подъемник Zoomlion (Зумлион) — продажа по России",
  };

  return titles[slug] || "Каталог техники — цены и наличие";
}

// ----------------------------------------------------
function getCategorySeoDescription(slug, count = 0) {
  const descriptions = {
    forklifts:
      `Купить вилочный погрузчик в России. В наличии ${count} моделей: дизельные, электрические и газ-бензиновые погрузчики. Цены, фото, характеристики, доставка.`,
    telehandlers:
      `Купить телескопический погрузчик в России. В наличии ${count} моделей с разной грузоподъёмностью и высотой подъема. Цены, фото, доставка.`,
    "mini-loaders":
      `Купить мини-погрузчик в России. В наличии ${count} моделей для строительства, коммунальных и складских задач. Цены, характеристики, доставка.`,
    "scissor-lifts":
      `Купить ножничный подъемник Zoomlion (Зумлион) в России. В наличии ${count} моделей: цены, фото, рабочая высота, характеристики и доставка по РФ.`,
    "articulated-lifts":
      `Купить коленчатый подъемник Zoomlion (Зумлион). В наличии ${count} моделей для высотных работ: цены, фото, вылет стрелы, характеристики.`,
    "telescopic-lifts":
      `Купить телескопический подъемник Zoomlion (Зумлион) в России. В наличии ${count} моделей: рабочая высота, цены, фото и доставка по РФ.`,
  };

  return descriptions[slug] ||
    "Каталог техники в наличии: цены, фото, характеристики и доставка по России.";
}
