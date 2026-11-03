// Cheri Cheri · recibe el formulario de cotización y lo reenvía por mail vía FormSubmit.
// Corre en Vercel (mismo dominio que el sitio), así el envío no depende de que
// el navegador del visitante llegue bien a formsubmit.co.
const TO = 'chericheriar@gmail.com';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = null; } }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ success: false, message: 'Pedido vacío' });
  }

  // Sólo texto plano y con largo razonable
  const clean = {};
  for (const [k, v] of Object.entries(body).slice(0, 30)) {
    clean[String(k).slice(0, 60)] = String(v == null ? '' : v).slice(0, 2000);
  }
  if (!clean._subject) clean._subject = 'Cotización Cheri Cheri';
  clean._template = clean._template || 'table';
  clean._captcha = 'false';

  const site = req.headers.origin || ('https://' + (req.headers.host || 'chericheri-five.vercel.app'));
  const referer = req.headers.referer || site + '/cotizar.html';

  try {
    const r = await fetch('https://formsubmit.co/ajax/' + TO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': site, 'Referer': referer },
      body: JSON.stringify(clean),
      signal: AbortSignal.timeout(25000)
    });
    const text = await r.text();
    let j = {};
    try { j = JSON.parse(text); } catch (e) { j = { message: text.slice(0, 300) }; }
    const ok = r.ok && (j.success === true || j.success === 'true');
    return res.status(ok ? 200 : 502).json({ success: ok, message: j.message || null, upstream: r.status });
  } catch (e) {
    return res.status(504).json({ success: false, message: 'No se pudo contactar al servicio de mail: ' + (e && e.message) });
  }
};
