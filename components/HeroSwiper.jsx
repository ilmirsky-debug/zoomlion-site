// components/HeroSwiper.jsx
import dynamic from "next/dynamic";

// Динамически импортируем клиентский компонент (SSR выключён)
const HeroSwiperClient = dynamic(() => import("./HeroSwiperClient"), { ssr: false });

export default function HeroSwiper(props) {
  return <HeroSwiperClient {...props} />;
}
