/**
 * Servicio inteligente de Tipo de Cambio
 *
 * Estrategia para ahorrar consultas API (100/mes gratuitas):
 * 1. Intenta leer del cache en memoria (valido por 24h)
 * 2. Si no hay cache, intenta la API de decolecta (1 consulta/dia = ~30/mes)
 * 3. Si la API falla o se agotaron consultas, hace scraping de SUNAT
 * 4. Si todo falla, usa el ultimo valor guardado
 */

export interface TipoCambioData {
  compra: number;
  venta: number;
  fuente: string;
  fecha: string;
  actualizadoEn: string;
}

// Cache en memoria del servidor
let cachedData: TipoCambioData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 4; // 4 horas de cache

// Ultimo valor conocido como respaldo final
const FALLBACK_DATA: TipoCambioData = {
  compra: 3.72,
  venta: 3.75,
  fuente: 'Ultimo dato conocido',
  fecha: new Date().toISOString().split('T')[0],
  actualizadoEn: new Date().toISOString(),
};

function isCacheValid(): boolean {
  return cachedData !== null && (Date.now() - cacheTimestamp) < CACHE_DURATION;
}

/** 1. Intentar con API decolecta */
async function fetchFromDecolecta(): Promise<TipoCambioData | null> {
  try {
    const apiKey = import.meta.env.DECOLECTA_API_KEY;
    if (!apiKey) return null;

    const res = await fetch('https://api.decolecta.com/v1/tipo-cambio/sunat', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!res.ok) {
      console.warn(`[TipoCambio] API decolecta respondio ${res.status}`);
      return null;
    }

    const data = await res.json();

    return {
      compra: parseFloat(data.buy_price),
      venta: parseFloat(data.sell_price),
      fuente: 'SUNAT (API)',
      fecha: data.date,
      actualizadoEn: new Date().toISOString(),
    };
  } catch (error) {
    console.warn('[TipoCambio] Error con API decolecta:', error);
    return null;
  }
}

/** 2. Scraping de SUNAT como respaldo gratuito */
async function fetchFromSunatScraping(): Promise<TipoCambioData | null> {
  try {
    // SUNAT publica el TC en su pagina de consulta
    const res = await fetch('https://e-consulta.sunat.gob.pe/cl-at-ittipcam/tcS01Alias', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!res.ok) return null;

    const html = await res.text();

    // Buscar los valores de compra y venta en el HTML
    // SUNAT muestra una tabla con los TC del mes
    const regex = /<td[^>]*>(\d+\.\d{3})<\/td>/g;
    const matches = [...html.matchAll(regex)];

    if (matches.length >= 2) {
      // Los ultimos dos valores de la tabla son compra y venta del ultimo dia
      const compra = parseFloat(matches[matches.length - 2][1]);
      const venta = parseFloat(matches[matches.length - 1][1]);

      if (!isNaN(compra) && !isNaN(venta) && compra > 0 && venta > 0) {
        return {
          compra,
          venta,
          fuente: 'SUNAT (Web)',
          fecha: new Date().toISOString().split('T')[0],
          actualizadoEn: new Date().toISOString(),
        };
      }
    }

    return null;
  } catch (error) {
    console.warn('[TipoCambio] Error con scraping SUNAT:', error);
    return null;
  }
}

/** Funcion principal: obtener tipo de cambio con estrategia de fallback */
export async function getTipoCambio(): Promise<TipoCambioData> {
  // 1. Verificar cache
  if (isCacheValid() && cachedData) {
    console.log('[TipoCambio] Usando cache en memoria');
    return cachedData;
  }

  // 2. Intentar API decolecta
  const apiData = await fetchFromDecolecta();
  if (apiData) {
    console.log('[TipoCambio] Datos obtenidos de API decolecta');
    cachedData = apiData;
    cacheTimestamp = Date.now();
    // Actualizar fallback con ultimo dato valido
    FALLBACK_DATA.compra = apiData.compra;
    FALLBACK_DATA.venta = apiData.venta;
    FALLBACK_DATA.fecha = apiData.fecha;
    return apiData;
  }

  // 3. Intentar scraping SUNAT
  const scrapingData = await fetchFromSunatScraping();
  if (scrapingData) {
    console.log('[TipoCambio] Datos obtenidos de scraping SUNAT');
    cachedData = scrapingData;
    cacheTimestamp = Date.now();
    FALLBACK_DATA.compra = scrapingData.compra;
    FALLBACK_DATA.venta = scrapingData.venta;
    FALLBACK_DATA.fecha = scrapingData.fecha;
    return scrapingData;
  }

  // 4. Usar ultimo valor conocido
  console.warn('[TipoCambio] Usando datos de respaldo');
  if (cachedData) return cachedData;
  return { ...FALLBACK_DATA, actualizadoEn: new Date().toISOString() };
}
