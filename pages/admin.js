import { useState, useEffect } from "react";

export default function Admin() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    title: "",
    desc: "",
    price: "",
    img: "",
  });

  // Загружаем текущие данные
  useEffect(() => {
    fetch("/stock/stock.json?cache_bust=" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        setStock(data);
        setLoading(false);
      })
      .catch((err) => console.error("Ошибка загрузки:", err));
  }, []);

  // Изменение существующих полей
  const handleChange = (index, field, value) => {
    const updated = [...stock];
    updated[index][field] = value;
    setStock(updated);
  };

  // Добавление новой техники
  const addNewItem = () => {
    if (!newItem.title || !newItem.price) {
      alert("Пожалуйста, заполните хотя бы название и цену");
      return;
    }
    setStock([...stock, newItem]);
    setNewItem({ title: "", desc: "", price: "", img: "" });
  };

  // Сохранение изменений
  const saveChanges = async () => {
    const res = await fetch("/api/update-stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stock, null, 2),
    });
    if (res.ok) alert("✅ Изменения сохранены!");
    else alert("❌ Ошибка при сохранении");
  };

  if (loading) return <p className="text-center mt-10">Загрузка...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Панель редактирования техники</h1>

      {stock.map((item, i) => (
        <div key={i} className="mb-6 p-4 border rounded-lg shadow-sm">
          <input
            type="text"
            value={item.title}
            onChange={(e) => handleChange(i, "title", e.target.value)}
            className="w-full border p-2 mb-2 rounded"
            placeholder="Название техники"
          />
          <textarea
            value={item.desc}
            onChange={(e) => handleChange(i, "desc", e.target.value)}
            className="w-full border p-2 mb-2 rounded"
            placeholder="Описание"
          />
          <input
            type="text"
            value={item.price}
            onChange={(e) => handleChange(i, "price", e.target.value)}
            className="w-full border p-2 mb-2 rounded font-mono"
            placeholder="Цена"
          />
          <input
            type="text"
            value={item.img}
            onChange={(e) => handleChange(i, "img", e.target.value)}
            className="w-full border p-2 mb-2 rounded"
            placeholder="Путь к изображению, например /stock/fd30.jpg"
          />
        </div>
      ))}

      <h2 className="text-xl font-semibold mb-2 mt-10">➕ Добавить новую технику</h2>
      <div className="p-4 border rounded-lg shadow-sm mb-6">
        <input
          type="text"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          className="w-full border p-2 mb-2 rounded"
          placeholder="Название техники"
        />
        <textarea
          value={newItem.desc}
          onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })}
          className="w-full border p-2 mb-2 rounded"
          placeholder="Описание"
        />
        <input
          type="text"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          className="w-full border p-2 mb-2 rounded"
          placeholder="Цена"
        />
        <input
          type="text"
          value={newItem.img}
          onChange={(e) => setNewItem({ ...newItem, img: e.target.value })}
          className="w-full border p-2 mb-2 rounded"
          placeholder="Путь к изображению, например /stock/fd30.jpg"
        />
        <button
          onClick={addNewItem}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition"
        >
          ➕ Добавить
        </button>
      </div>

      <button
        onClick={saveChanges}
        className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-400 transition"
      >
        💾 Сохранить изменения
      </button>
    </div>
  );
}
