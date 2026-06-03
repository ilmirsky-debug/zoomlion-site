import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BackHome from "../../components/BackHome.js";


export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [product, setProduct] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  function openLightbox(i) {
    setPhotoIndex(i);
    setLightboxOpen(true);
  }

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      const res = await fetch("/stock/stock.json");
      const data = await res.json();
      setProduct(data.find((item) => item.slug === slug));
    };

    load();
  }, [slug]);

  if (!product) return <p className="p-6">Загрузка...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* BACK BUTTON */}
      <div className="mb-6">
        <BackHome />
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{product.title}</h1>

        {/* MAIN IMAGE */}
        <div
          className="w-full h-96 rounded-2xl overflow-hidden mb-6 cursor-pointer bg-white"
          onClick={() => openLightbox(0)}
        >
          <img
            src={product.images?.[0]}
            className="w-full h-full object-contain"
            alt={product.title}
          />
        </div>

        {/* MINI PHOTOS */}
        <div className="flex gap-4 mb-6">
          {product.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-24 h-24 object-cover rounded-lg cursor-pointer"
              onClick={() => openLightbox(i)}
            />
          ))}
        </div>

        <p className="text-stone-700 text-lg mb-6">{product.desc}</p>

        <p className="text-2xl font-bold mb-8">{product.price}</p>

        <button
          onClick={() => window.openForm && window.openForm(product.title)}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-stone-800 transition"
        >
          Запросить предложение
        </button>

        {/* LIGHTBOX */}
        {lightboxOpen && (
          <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 text-white text-3xl"
            >
              ×
            </button>

            <div className="relative w-full max-w-3xl h-[70vh]">
              <img
                src={product.images[photoIndex]}
                className="w-full h-full object-contain"
              />

              <button
                onClick={() =>
                  setPhotoIndex((i) => (i === 0 ? product.images.length - 1 : i - 1))
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl"
              >
                ‹
              </button>

              <button
                onClick={() =>
                  setPhotoIndex((i) => (i === product.images.length - 1 ? 0 : i + 1))
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl"
              >
                ›
              </button>
            </div>

            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setPhotoIndex(i)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer ${
                    i === photoIndex ? "ring-2 ring-white" : "opacity-60"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
