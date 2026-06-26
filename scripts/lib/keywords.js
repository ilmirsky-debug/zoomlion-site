function cleanTopic(title) {
  return title
    .toLowerCase()
    .replace(/:.*/g, "")
    .replace(/\?.*/g, "")
    .replace("как выбрать", "")
    .replace("стоит ли", "")
    .replace("переплачивать", "")
    .trim();
}

function makeKeywords(title, category = "") {
  const base = cleanTopic(title);

  return Array.from(
    new Set([
      base,
      `${base} купить`,
      `${base} цена`,
      `${base} характеристики`,
      `${base} обслуживание`,
      `${base} запчасти`,
      `${base} для склада`,
      `${base} для строительства`,
      `${base} Zoomlion`,
      category ? `${category.toLowerCase()} Zoomlion` : "",
      "техника Zoomlion",
      "строительная техника",
      "складская техника",
    ].filter(Boolean))
  );
}

module.exports = { cleanTopic, makeKeywords };