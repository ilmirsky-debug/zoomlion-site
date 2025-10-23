import { useEffect, useState } from "react";

export default function Admin() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 📦 Загружаем данные при открытии страницы
  useEffect(() => {
    fetch("/stock/stock.json?cache_bust=" + Date.now())
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => {
        console.error("Ошибка загрузки stock.json:", err);
        setMessage("⚠ Не удалось загрузить данные.");
      });
  }, []);

  // 💾 Сохраняем изменения
  const saveChanges = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/update-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });

      if (res.ok) {
        setMessage("✅ Изменения успешно сохранены!");
      } else {
        const errData = await res.json();
        setMessage(`❌ Ошибка: ${errData.error || "Не удалось сохранить"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠ Ошибка соединения с сервером.");
    } finally {
      setSaving(false);
    }
  };

  // ➕ Добавить новую технику
  const addNewItem = () => {
    setItems([
      ...items,
      {
        title: "Новая техника",
        desc: "Описание",
        price: "0 ₽",
        img: "",
      },
    ]);
  };

  // ❌ Удалить элемент
  const removeItem = (index) => {
    if (window.confirm("Удалить этот элемент?")) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // ✏️ Изменить поле
  const updateField = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // 🖼️ Загрузка изображения в Яндекс Object Storage
  const handleFileUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.url) {
        updateField(index, "img", data.url);
        setMessage("✅ Изображение успешно загружено в Yandex Cloud!");
      } else {
        setMessage("⚠ Ошибка загрузки изображения");
      }
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      setMessage("🚨 Ошибка при отправке файла");
    } finally {
      setUploading(false);
    }
  };

  // 🖥️ Интерфейс админки
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">⚙️ Панель администратора</h1>

      {message && <p className="mb-6 text-sm font-medium">{message}</p>}

      <button
        onClick={addNewItem}
        className="mb-6 bg-lime-500 hover:bg-lime-400 text-black px-4 py-2 rounded-lg font-semibold"
      >
        ➕ Добавить технику
      </button>

      <div className="space-y-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="p-4 border rounded-lg shadow-sm bg-white space-y-3"
          >
            <input
              value={item.title}
              onChange={(e) => updateField(i, "title", e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Название"
            />
            <textarea
              value={item.desc}
              onChange={(e) => updateField(i, "desc", e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Описание"
            />
            <input
              value={item.price}
              onChange={(e) => updateField(i, "price", e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Цена"
            />

            {/* 🖼️ Загрузка изображения */}
            <div className="space-y-2">
              <input
                value={item.img}
                onChange={(e) => updateField(i, "img", e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="Ссылка на изображение"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(i, e)}
                className="w-full border px-3 py-2 rounded"
              />
              {item.img && (
                <img
                  src={item.img}
                  alt=""
                  className="h-32 w-auto rounded-md border"
                />
              )}
            </div>

            <button
              onClick={() => removeItem(i)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={saveChanges}
        disabled={saving || uploading}
        className="mt-8 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
      >
        💾 {saving ? "Сохраняем..." : uploading ? "Загружаем..." : "Сохранить изменения"}
      </button>
    </div>
  );
}
