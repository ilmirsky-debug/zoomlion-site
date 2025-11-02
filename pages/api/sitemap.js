export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/xml");

  const baseUrl = "https://zoomliontrade.ru";

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>${baseUrl}/</loc></url>
      <url><loc>${baseUrl}/#products</loc></url>
      <url><loc>${baseUrl}/#advantages</loc></url>
      <url><loc>${baseUrl}/#contacts</loc></url>
    </urlset>
  `.trim();

  res.status(200).send(sitemap);
};
