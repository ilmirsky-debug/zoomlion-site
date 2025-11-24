import { useState, useEffect } from "react";

export default function ModalForm() {
  const [showForm, setShowForm] = useState(false);
  const [productName, setProductName] = useState("");

  useEffect(() => {
    window.openForm = (title = "") => {
      setProductName(title);
      setShowForm(true);
    };
  }, []);

  if (!showForm) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
      onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
    >
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center relative">
        <button
          onClick={() => setShowForm(false)}
          className="absolute top-3 right-4 text-gray-400 hover:text-black text-2xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold mb-4">Запросить предложение</h2>

        {productName && (
          <p className="mb-2 text-gray-800">
            Товар: <b>{productName}</b>
          </p>
        )}

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const name = e.target.name.value;
            const phone = e.target.phone.value;
            const comment = e.target.comment.value;

            const res = await fetch("/api/send-telegram", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, phone, comment }),
            });

            if (res.ok) {
              alert("✅ Заявка отправлена!");
              setShowForm(false);
            } else {
              alert("❌ Ошибка при отправке. Попробуйте позже.");
            }
          }}
          className="space-y-4"
        >
          <input name="name" placeholder="Ваше имя" required className="w-full border px-4 py-2 rounded" />
          <input name="phone" placeholder="Телефон" required className="w-full border px-4 py-2 rounded" />
          <textarea name="comment" placeholder="Комментарий (по желанию)" className="w-full border px-4 py-2 rounded" />

          <button
            type="submit"
            className="w-full bg-lime-500 hover:bg-lime-400 text-white py-2 rounded font-medium transition"
          >
            Отправить
          </button>

          <p className="text-xs text-gray-600 mt-2 text-center">
            Нажимая на кнопку, вы соглашаетесь с{" "}
            <a href="/confidential" target="_blank" rel="noopener noreferrer" className="text-lime-600 underline hover:text-lime-800">
              политикой конфиденциальности
            </a>.
          </p>
        </form>
      </div>
    </div>
  );
}
