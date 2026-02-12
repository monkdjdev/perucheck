import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 35 * 24 * 60 * 60 * 1000);
    const y1 = thirtyDaysAgo.getFullYear();
    const m1 = thirtyDaysAgo.getMonth() + 1;
    const d1 = thirtyDaysAgo.getDate();
    const y2 = today.getFullYear();
    const m2 = today.getMonth() + 1;
    const d2 = today.getDate();

    const apiUrl = `https://estadisticas.bcrp.gob.pe/estadisticas/series/api/PD04639PD-PD04640PD/json/${y1}-${m1}-${d1}/${y2}-${m2}-${d2}/ing`;
    const res = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `BCRP responded ${res.status}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const rawText = await res.text();

    // Clean and extract JSON - BCRP returns text/html content-type
    const cleaned = rawText.replace(/^\uFEFF/, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) {
      return new Response(JSON.stringify({ error: 'Invalid BCRP response format', rawLength: rawText.length }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const json = JSON.parse(cleaned.slice(start, end + 1));
    if (!json.periods) {
      return new Response(JSON.stringify({ error: 'No periods in BCRP response' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = json.periods
      .filter((p: any) => p.values[0] !== 'n.d.' && p.values[1] !== 'n.d.')
      .map((p: any) => ({
        fecha: p.name,
        compra: parseFloat(p.values[0]),
        venta: parseFloat(p.values[1]),
      }));

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
