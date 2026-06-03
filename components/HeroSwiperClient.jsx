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
    "/zoomlion-hero.jpg",
    "/hero1.jpg",
    "/hero2.jpg",
    "/hero3.jpg",
    "/hero4.jpg",
    "/hero5.jpg",
    "/hero6.jpg",
    "/hero7.jpg",
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
    <section className="relative w-full h-[95vh] min-h-[650px] overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        navigation={{ enabled: true }}
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {images.map((src, i) => (
          <SwiperSlide key={src}>
            <div
              className="relative w-full h-[95vh] min-h-[650px]"
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
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/70 z-20" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-30 px-6 pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-xl mb-6">
          Погрузчики, мини-погрузчики и подъемники{" "}
          <span className="text-lime-400">Zoomlion</span>
        </h1>

        <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mb-10">
          Официальный дилер в России — надёжная техника, производительность и сервис.
        </p>

        <a
          href="#contacts"
          className="bg-lime-400 text-gray-900 px-10 py-3 rounded-full font-semibold hover:bg-lime-300 shadow-xl transition-all hover:-translate-y-1 pointer-events-auto"
        >
          Получить консультацию
        </a>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-3xl text-lime-400 opacity-80 animate-bounce z-30">
        ↓
      </div>
    </section>
  );
}