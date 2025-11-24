import { useEffect, useState } from "react";

// Генерация slug
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/ё/g, "e")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}

export default function Admin() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const categories = [
    { id: "forklifts", label: "Вилочные погрузчики" },
    { id: "telehandlers", label: "Телескопические погрузчики" },
    { id: "scissor-lifts", label: "Ножничные подъемники" },
    { id: "articulated-lifts", label: "Коленчатые подъемники" },
    { id: "telescopic-lifts", label: "Телескопические подъемники" },
    { id: "mini-loaders", label: "Мини-погрузчики" },
  ];

  const drives = ["Дизель", "Бензин", "Газ-Бензин", "Электрический"];

  const capacities = [
    "1,5 т.", "1,8 т.", "2,0 т.", "2,5 т.", "3,0 т.", "3,5 т.", "3,5 т. 4х4.", 
    "5 т. mini.", "7 т.", "10 т.", "12 т.", "18 т.", "25 т."
  ];

  const liftHeights = [
    "3 м.", "4,5 м.", "4,8 м.", "6 м.", "6,5 м.", "7,8 м.", "10 м.", "11,8 м.",
    "13,8 м.", "15,7 м.", "18 м.", "11,55 м.", "16 м.", "21,45 м.", "26,23 м.",
    "33,85 м.", "22,75 м.", "28,20 м.", "44,08 м.", "32,48 м.", "36 м.", "40,2 м.", 
    "58,8 м.", "67,5 м."
  ];

  // 📦 Загрузка stock.json
  useEffect(() => {
    fetch("/stock/stock.json?cache_bust=" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        const normalized = data.map((item) => ({
          ...item,
          images: item.images ? item.images : item.img ? [item.img] : [],
          capacity: item.capacity || "",
          liftHeight: item.liftHeight || "",
          drive: item.drive || ""
        }));
        setItems(normalized);
      })
      .catch(() => setMessage("⚠ Не удалось загрузить файл stock.json"));
  }, []);

  const saveChanges = async () => {
    setSaving(true);
    setMessage("");

    const cleaned = items.map((item) => ({
      ...item,
      images: item.images.filter((img) => img && img.trim() !== "")
    }));

    try {
      const res = await fetch("/api/update-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleaned)
      });

      setMessage(res.ok ? "✅ Изменения сохранены!" : "❌ Ошибка сохранения.");
    } catch {
      setMessage("🚨 Ошибка соединения с сервером");
    }

    setSaving(false);
  };

  const addNewItem = () => {
    setItems([
      ...items,
      {
        title: "Новая техника",
        desc: "Описание",
        price: "",
        category: "",
        slug: "",
        images: ["", "", "", "", ""],
        capacity: "",
        liftHeight: "",
        drive: ""
      }
    ]);
  };

  const updateField = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    if (field === "title") updated[index].slug = generateSlug(value);
    setItems(updated);
  };

  const updateImage = (index, imgIndex, value) => {
    const updated = [...items];
    updated[index].images[imgIndex] = value;
    setItems(updated);
  };

  const uploadImage = async (index, imgIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-image", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        updateImage(index, imgIndex, data.url);
        setMessage("✅ Фото загружено!");
      } else setMessage("⚠ Ошибка загрузки");
    } catch {
      setMessage("🚨 Ошибка загрузки фото");
    }

    setUploading(false);
  };

  const removeItem = (index) => {
    if (window.confirm("Удалить технику?")) setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">⚙ Панель администратора</h1>
      {message && <p className="mb-6 text-sm font-medium">{message}</p>}

      <button onClick={addNewItem} className="mb-6 bg-lime-500 hover:bg-lime-400 text-black px-4 py-2 rounded-lg font-semibold">
        ➕ Добавить технику
      </button>

      <div className="space-y-6">
        {items.map((item, i) => (
          <div key={i} className="p-4 border rounded-lg shadow bg-white space-y-3">
            <input value={item.title} onChange={(e) => updateField(i, "title", e.target.value)}
              className="w-full border px-3 py-2 rounded" placeholder="Название" />

            <input value={item.slug} onChange={(e) => updateField(i, "slug", e.target.value)}
              className="w-full border px-3 py-2 rounded" placeholder="Slug" />

            <textarea value={item.desc} onChange={(e) => updateField(i, "desc", e.target.value)}
              className="w-full border px-3 py-2 rounded" placeholder="Описание" />

            <input value={item.price} onChange={(e) => updateField(i, "price", e.target.value)}
              className="w-full border px-3 py-2 rounded" placeholder="Цена" />

            {/* Категория */}
            <select value={item.category} onChange={(e) => updateField(i, "category", e.target.value)}
              className="w-full border px-3 py-2 rounded">
              <option value="">— категория —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>

            {/* Грузоподъемность */}
            <select value={item.capacity} onChange={(e) => updateField(i, "capacity", e.target.value)}
              className="w-full border px-3 py-2 rounded mt-2">
              <option value="">— грузоподъёмность —</option>
              {capacities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Высота подъема */}
            <select value={item.liftHeight} onChange={(e) => updateField(i, "liftHeight", e.target.value)}
              className="w-full border px-3 py-2 rounded mt-2">
              <option value="">— высота подъёма —</option>
              {liftHeights.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>

            {/* Тип привода */}
            <select value={item.drive} onChange={(e) => updateField(i, "drive", e.target.value)}
              className="w-full border px-3 py-2 rounded mt-2">
              <option value="">— тип привода —</option>
              {drives.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* 5 фото */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
              {item.images.map((img, imgIndex) => (
                <div key={imgIndex} className="space-y-2">
                  <input value={img} onChange={(e) => updateImage(i, imgIndex, e.target.value)}
                    className="w-full border px-2 py-1 rounded text-sm" placeholder={`Фото ${imgIndex + 1}`} />
                  <input type="file" accept="image/*" onChange={(e) => uploadImage(i, imgIndex, e)}
                    className="w-full border px-2 py-1 rounded text-sm" />
                  {img && <img src={img} alt={`preview-${imgIndex}`} className="h-24 w-full object-cover rounded border" />}
                </div>
              ))}
            </div>

            <button onClick={() => removeItem(i)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md">
              Удалить
            </button>
          </div>
        ))}
      </div>

      <button onClick={saveChanges} disabled={saving || uploading}
        className="mt-8 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
        💾 {saving ? "Сохранение..." : uploading ? "Загрузка..." : "Сохранить изменения"}
      </button>
    </div>
  );
}
