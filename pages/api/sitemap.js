import { articles } from "../../content/blog";
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/xml");

  const baseUrl = "https://zoomliontrade.ru";

  const blogUrls = Object.keys(articles)
  .map(
    (slug) => `
      <url>
        <loc>${baseUrl}/blog/${slug}</loc>
      </url>
    `
  )
  .join("");

const sitemap = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>${baseUrl}/</loc>
  </url>

  <url>
    <loc>${baseUrl}/blog</loc>
  </url>

  ${blogUrls}

</urlset>
`.trim();

  res.status(200).send(sitemap);
};
