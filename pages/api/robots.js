export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(`User-agent: *
Allow: /

Sitemap: https://zoomliontrade.ru/sitemap.xml

# Верификация Яндекс и Google
Host: zoomliontrade.ru
yandex-verification: 5a9f0729ecd92141
google-site-verification: google622aeab83e21e32f
`);
}
