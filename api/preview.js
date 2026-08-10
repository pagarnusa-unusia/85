export default async function handler(req, res) {
  const { slug } = req.query;
  const API_URL = "https://script.google.com/macros/s/AKfycbxLs1nDf7wYLjp_QV0IqT9VSqq4iVTDWy_5fAJShgIzqk5VAJQ9H8Ep7rDrFeoQznuq/exec";

  try {
    const response = await fetch(`${API_URL}?action=articles`);
    const data = await response.json();
    const article = data.find(item => String(item.slug) === slug);

    if (!article) {
      res.setHeader('Content-Type', 'text/html');
      return res.status(404).send('<h3>Artikel tidak ditemukan</h3>');
    }

    const title = article.judul || "PAC PSNU Pagar Nusa Kemang";
    const description = (article.konten || "").replace(/<[^>]*>/g, '').substring(0, 150) + '...';
    const image = article.gambar_url || "https://lh3.googleusercontent.com/d/1drM76LlU3sdqpwo-Urq7ZULoyORC0UMQ";
    const targetUrl = `https://www.uktpagarnusa.my.id/baca.html?slug=${slug}`;

    const html = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <meta property="og:title" content="${title}">
          <meta property="og:description" content="${description}">
          <meta property="og:image" content="${image}">
          <meta property="og:url" content="${targetUrl}">
          <meta property="og:type" content="article">
          <meta http-equiv="refresh" content="0;url=${targetUrl}">
      </head>
      <body>
          <p>Mengarahkan ke artikel... <a href="${targetUrl}">Klik di sini jika tidak otomatis</a></p>
          <script>window.location.href = "${targetUrl}";</script>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    res.setHeader('Content-Type', 'text/html');
    res.status(500).send('<h3>Gagal memuat preview artikel</h3>');
  }
}
