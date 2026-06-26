function createArticle({
  slug,
  title,
  description,
  excerpt,
  category,
  image,
  keywords,
  sections,
  faq,
  related = [],
}) {
  return {
    slug,
    title,
    description,
    excerpt,
    category,
    date: new Date().toISOString().slice(0, 10),
    image,
    keywords,
    content: sections.flatMap((section) => section.text || []),
    sections,
    faq,
    related,
  };
}

module.exports = { createArticle };