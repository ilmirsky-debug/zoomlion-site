import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function SupportModal({ isOpen, onClose, content }) {
  if (!content) return null;

  const modalTexts = {
    diagnostics: {
      title: "Диагностика и ремонт",
      text: [
        "Компьютерная диагностика погрузчиков и подъёмников",
        "Выезд мастера на объект",
        "Ремонт ДВС, КПП, гидравлики, электрики",
        "Срочное восстановление в день обращения",
      ],
      icon: "🛠️",
    },
    parts: {
      title: "Запчасти",
      text: [
        "Оригинальные запчасти и качественные аналоги",
        "В наличии на складе и под заказ",
        "Подбор по модели, VIN и фото",
        "Доставка транспортными компаниями по России",
      ],
      icon: "🔧",
    },
    maintenance: {
      title: "Техническое обслуживание",
      text: [
        "Плановое и регламентное ТО",
        "Замена масел, фильтров, диагностика узлов",
        "Комплексное обслуживание техники",
        "Гарантия на выполненные работы",
      ],
      icon: "🧰",
    },
    delivery: {
      title: "Доставка по России",
      text: [
        "Доставка техники и запчастей в любую точку РФ",
        "Страховка груза по желанию",
        "Контроль на всех этапах доставки",
        "Выгодные тарифы транспортных компаний",
      ],
      icon: "🚚",
    },
  };

  const data = modalTexts[content];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-xl relative"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Кнопка закрытия */}
            <button
              onClick={onClose}
              className="absolute top-4 right-5 text-gray-500 hover:text-black text-2xl"
            >
              ×
            </button>

            {/* Иконка */}
            <div className="text-5xl mb-4 text-center">{data.icon}</div>

            <h2 className="text-2xl font-semibold text-stone-900 text-center mb-4">
              {data.title}
            </h2>

            <ul className="space-y-2 text-stone-700 text-base leading-relaxed">
              {data.text.map((line, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-lime-500 text-xl mt-1">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            {/* ВСТАВЛЕННАЯ КНОПКА НА ГЛАВНУЮ */}
            <Link
              href="/"
              className="w-full mt-6 mb-3 bg-stone-800 hover:bg-black text-white py-2 rounded-xl font-medium transition block text-center"
            >
              ← На главную
            </Link>

            <button
              onClick={onClose}
              className="w-full bg-lime-500 hover:bg-lime-400 text-white py-2 rounded-xl font-medium transition"
            >
              Понятно
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
