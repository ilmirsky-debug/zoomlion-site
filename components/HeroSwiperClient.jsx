'use client';

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";

export default function HeroSwiperClient() {
  const images = [
  "/hero-products.png",
  "/hero1.png",
  "/hero2.png",
  "/hero3.png",
  "/hero4.png",
  "/hero6.png",
  "/hero7.png",
];

  const [offset, setOffset] = useState(0);
  const [smoothOffset, setSmoothOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY * 0.1);
    window.addEventListener("scroll", handleScroll, { passive: true });

    let raf;
    const anim = () => {
      setSmoothOffset((prev) => prev + (offset - prev) * 0.1);
      raf = requestAnimationFrame(anim);
    };

    anim();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [offset]);

  return (
    <section className="relative w-full bg-white overflow-hidden pb-5 md:pb-0">
  <Swiper
    modules={[Autoplay, EffectFade, Navigation, Pagination]}
    effect="fade"
loop
    autoplay={{ delay: 4000, disableOnInteraction: false }}
    navigation
    pagination={{ clickable: true }}
    className="w-full aspect-[16/9] md:h-[82vh] md:min-h-[620px]"
  >
    {images.map((src, i) => (
      <SwiperSlide key={src}>
        <div
          className="relative w-full aspect-[16/9] md:h-[82vh] md:min-h-[620px]"
          style={{ transform: `translateY(${smoothOffset}px)` }}
        >
          <Image
            src={src}
            alt="Погрузчики, мини-погрузчики и подъемники"
            fill
            priority={i === 0}
            fetchPriority={i === 0 ? "high" : "auto"}
            quality={85}
            sizes="100vw"
            className="object-contain object-center"
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>

  <div className="flex justify-center mt-3 md:absolute md:bottom-14 md:left-1/2 md:-translate-x-1/2 z-30 pointer-events-none">
  <button
    onClick={() => window.openForm && window.openForm("Консультация по технике")}
    className="pointer-events-auto bg-lime-400 text-gray-900 px-6 sm:px-10 py-3 rounded-full font-semibold hover:bg-lime-300 shadow-xl transition-all hover:-translate-y-1 text-sm sm:text-base"
  >
    Получить консультацию
  </button>
</div>
</section>
  );
}