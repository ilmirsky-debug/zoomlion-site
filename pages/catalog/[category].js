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

  // ===================================================================
  // RENDER
  // ===================================================================
  return (
    <>
      <Head>
        <title>{getCategoryName(category)}</title>
      </Head>

      <div className="max-w-7xl mx-auto p-6 min-h-screen grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">

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

        {/* SIDEBAR */}
        <aside className="border rounded-2xl p-5 bg-white shadow-md h-fit sticky top-6">
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

          {/* FILTERS BLOCK */}
          <div className="mt-8 space-y-5">
            {/* --- Грузоподъёмность --- */}
            <div>
              <h4 className="font-semibold mb-2">Грузоподъёмность</h4>
              <select
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 bg-stone-50 focus:bg-white focus:border-black transition"
              >
                <option value="">Все</option>
                {capacityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* --- Высота подъёма --- */}
            <div>
              <h4 className="font-semibold mb-2">Высота подъёма</h4>
              <select
                value={liftFilter}
                onChange={(e) => setLiftFilter(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 bg-stone-50 focus:bg-white focus:border-black transition"
              >
                <option value="">Все</option>
                {liftOptions.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* --- Тип привода --- */}
            <div>
              <h4 className="font-semibold mb-2">Тип привода</h4>
              <select
                value={driveFilter}
                onChange={(e) => setDriveFilter(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 bg-stone-50 focus:bg-white focus:border-black transition"
              >
                <option value="">Все</option>
                {driveOptions.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* --- Сброс фильтров --- */}
            {(capacityFilter || liftFilter || driveFilter) && (
              <button
                onClick={() => { setCapacityFilter(""); setLiftFilter(""); setDriveFilter(""); }}
                className="w-full mt-2 bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-600 transition"
              >
                Сбросить фильтры
              </button>
            )}
          </div>

          <div className="mt-8"><BackHome /></div>
        </aside>

        {/* ITEMS */}
        <div>
          {filteredItems.length === 0 && (
            <p className="text-stone-600">Техника в этой категории пока не добавлена.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredItems.map((item) => {
              const firstImage = item.images?.[0] || "/stock/noimage.jpg";
              const isSelected = selectedItems.find((i) => i.slug === item.slug);

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
                    <img src={firstImage} alt={item.title} className="max-h-full max-w-full object-contain p-2" />
                  </div>

                  {/* Название, описание, цена */}
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2 break-words">{item.title}</h2>
                  <p className="text-stone-600 text-sm mb-4 line-clamp-3">{item.desc}</p>
                  <div className="mt-auto">
                    <p className="text-lg font-bold mb-3">{item.price}</p>
                  </div>

                  {/* Кнопка запроса предложения */}
                  <button
                    onClick={() => window.openForm && window.openForm(item.title)}
                    className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-stone-800 transition"
                  >
                    Запросить предложение
                  </button>
<GeneratePDF item={item} />
                </div>
              );
            })}
          </div>

          {/* Кнопка генерации PDF для выбранных */}
          {selectedItems.length > 0 && (
            <div className="mt-6">
              <GeneratePDFMultiple items={selectedItems} />
            </div>
          )}
        </div>

        {/* SEO TEXT */}
        <section className="mt-16 p-7 bg-white border rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold mb-4">О категории</h2>
          <p className="leading-relaxed whitespace-pre-line">{seoText}</p>
        </section>

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
Ножничные подъемники подходят для работ на высоте в помещениях и на ровных площадках. Если вы хотите купить ножничный подъемник для монтажа, сервисного обслуживания или складских операций, в каталоге собраны модели разных размеров и типов питания.
${driveText}${capacityText}${liftText}
Такая техника обеспечивает безопасный подъём персонала и инструмента, имеет компактные габариты и низкие расходы на обслуживание. Здесь можно подобрать подъемник с нужной рабочей высотой, грузоподъёмностью и конфигурацией платформы. Также представлены модели Zoomlion (зумлион), оптимальные по цене и качеству для регулярной эксплуатации.`,
    "articulated-lifts": `
Коленчатые подъемники позволяют выполнять высотные работы там, где требуется маневренность и возможность обходить препятствия. Если вам нужно купить коленчатый подъемник для монтажа, обслуживания зданий или промышленного применения, выберите подходящую модель из представленных вариантов. Машины отличаются рабочей высотой, грузоподъёмностью платформы и типом питания.
${driveText}${capacityText}${liftText}
В каталоге есть как электрические, так и дизельные подъемники, включая популярные модели Zoomlion (зумлион). Такая техника обеспечивает стабильную работу, увеличивает безопасность персонала и помогает снижать затраты на обслуживание. Подберите оптимальное решение под свои задачи и бюджет.`,
    "telescopic-lifts": `
Телескопические подъемники используются для высотных работ на открытых площадках, где важны высокая скорость подъёма, большой вылет и стабильность платформы. Если вам требуется купить телескопический подъемник для строительства, наружной отделки или установки конструкций, в каталоге представлены модели с различными параметрами.
${driveText}${capacityText}${liftText}
Доступны как дизельные, так и электрические решения, среди которых присутствуют модели от бренда Zoomlion (зумлион). Все подъемники отличаются надёжностью, увеличенной безопасностью и простым техническим обслуживанием. Выберите технику с нужной высотой подъема и грузоподъёмностью, чтобы повысить эффективность работ.`,
  };

  return texts[slug] || "";
}

// ----------------------------------------------------
function getCategoryName(slug) {
  const c = categoriesList.find((x) => x.slug === slug);
  return c ? c.title : "Каталог";
}
