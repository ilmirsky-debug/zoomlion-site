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

  // Плавный параллакс
  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY * 0.1);
    window.addEventListener("scroll", handleScroll, { passive: true });

    let raf;
    const animate = () => {
      setSmoothOffset(prev => prev + (offset - prev) * 0.1);
      raf = requestAnimationFrame(animate);
    };
    animate();

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
          <SwiperSlide key={i}>
            <div
              className="relative w-full h-[95vh] min-h-[650px] will-change-transform"
              style={{
                transform: `translateY(${smoothOffset}px)`,
              }}
            >
              <Image
                src={src}
                alt=""
                fill
                priority={i === 0}
                quality={85}
                placeholder="blur"
                blurDataURL="/tiny-blur.jpg"
                className="object-cover"
              />

              {/* Градиент для контраста */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70 z-20" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Текст */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-30 px-6 pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-xl mb-6 pointer-events-auto">
          Погрузчики и подъемники <span className="text-lime-400">Zoomlion</span>
        </h1>

        <p className="text-lg md:text-2xl text-gray-200 drop-shadow-lg max-w-3xl mb-10 pointer-events-auto">
          Официальный дилер в России — надёжная техника, производительность и сервис.
        </p>

        <a
          href="#contacts"
          className="bg-lime-400 text-gray-900 px-10 py-3 rounded-full font-semibold hover:bg-lime-300 shadow-xl transition-all hover:-translate-y-1 pointer-events-auto"
        >
          Получить консультацию
        </a>
      </div>

      {/* стрелка вниз */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-3xl text-lime-400 opacity-80 animate-bounce z-30">
        ↓
      </div>
    </section>
  );
}
