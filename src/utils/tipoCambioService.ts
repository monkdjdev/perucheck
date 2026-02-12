/**
 * Servicio inteligente de Tipo de Cambio
 *
 * Estrategia con múltiples fuentes gratuitas (sin API key):
 * 1. Cache en memoria (4h)
 * 2. apis.net.pe - JSON limpio, sin key
 * 3. SUNAT TXT directo - archivo plano oficial
 * 4. BCRP API - API oficial del banco central
 * 5. eApi Peru - alternativa gratuita
 * 6. Ultimo valor conocido como respaldo final
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

/** 1. apis.net.pe - JSON limpio, sin API key */
async function fetchFromApisNetPe(): Promise<TipoCambioData | null> {
  try {
    const res = await fetch('https://api.apis.net.pe/v1/tipo-cambio-sunat', {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.warn(`[TipoCambio] apis.net.pe respondio ${res.status}`);
      return null;
    }

    const data = await res.json();

    const compra = parseFloat(data.compra);
    const venta = parseFloat(data.venta);

    if (isNaN(compra) || isNaN(venta) || compra <= 0 || venta <= 0) return null;

    return {
      compra,
      venta,
      fuente: 'SUNAT (apis.net.pe)',
      fecha: data.fecha || new Date().toISOString().split('T')[0],
      actualizadoEn: new Date().toISOString(),
    };
  } catch (error) {
    console.warn('[TipoCambio] Error con apis.net.pe:', error);
    return null;
  }
}

/** 2. SUNAT TXT directo - archivo plano oficial */
async function fetchFromSunatTxt(): Promise<TipoCambioData | null> {
  try {
    const res = await fetch('https://www.sunat.gob.pe/a/txt/tipoCambio.txt', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.warn(`[TipoCambio] SUNAT TXT respondio ${res.status}`);
      return null;
    }

    const text = (await res.text()).trim();
    // Formato: DD/MM/YYYY|compra|venta|
    const parts = text.split('|');

    if (parts.length < 3) return null;

    const compra = parseFloat(parts[1]);
    const venta = parseFloat(parts[2]);

    if (isNaN(compra) || isNaN(venta) || compra <= 0 || venta <= 0) return null;

    // Convertir fecha DD/MM/YYYY a YYYY-MM-DD
    const fechaParts = parts[0].split('/');
    const fecha = fechaParts.length === 3
      ? `${fechaParts[2]}-${fechaParts[1]}-${fechaParts[0]}`
      : new Date().toISOString().split('T')[0];

    return {
      compra,
      venta,
      fuente: 'SUNAT (Oficial)',
      fecha,
      actualizadoEn: new Date().toISOString(),
    };
  } catch (error) {
    console.warn('[TipoCambio] Error con SUNAT TXT:', error);
    return null;
  }
}

/** 3. BCRP API - Banco Central de Reserva del Peru */
async function fetchFromBCRP(): Promise<TipoCambioData | null> {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    // Series: PD04639PD = Compra, PD04640PD = Venta
    const url = `https://estadisticas.bcrp.gob.pe/estadisticas/series/api/PD04639PD-PD04640PD/json/${year}-${month}-${day}/${year}-${month}-${day}/ing`;

    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.warn(`[TipoCambio] BCRP respondio ${res.status}`);
      return null;
    }

    const data = await res.json();

    if (!data.periods || data.periods.length === 0) {
      // Si no hay datos de hoy, intentar con un rango de los últimos 5 días
      const fiveDaysAgo = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000);
      const y2 = fiveDaysAgo.getFullYear();
      const m2 = fiveDaysAgo.getMonth() + 1;
      const d2 = fiveDaysAgo.getDate();

      const url2 = `https://estadisticas.bcrp.gob.pe/estadisticas/series/api/PD04639PD-PD04640PD/json/${y2}-${m2}-${d2}/${year}-${month}-${day}/ing`;
      const res2 = await fetch(url2, { signal: AbortSignal.timeout(8000) });

      if (!res2.ok) return null;

      const data2 = await res2.json();
      if (!data2.periods || data2.periods.length === 0) return null;

      // Tomar el último período disponible
      const lastPeriod = data2.periods[data2.periods.length - 1];
      const compra = parseFloat(lastPeriod.values[0]);
      const venta = parseFloat(lastPeriod.values[1]);

      if (isNaN(compra) || isNaN(venta) || compra <= 0 || venta <= 0) return null;

      return {
        compra,
        venta,
        fuente: 'BCRP (Oficial)',
        fecha: new Date().toISOString().split('T')[0],
        actualizadoEn: new Date().toISOString(),
      };
    }

    const lastPeriod = data.periods[data.periods.length - 1];
    const compra = parseFloat(lastPeriod.values[0]);
    const venta = parseFloat(lastPeriod.values[1]);

    if (isNaN(compra) || isNaN(venta) || compra <= 0 || venta <= 0) return null;

    return {
      compra,
      venta,
      fuente: 'BCRP (Oficial)',
      fecha: new Date().toISOString().split('T')[0],
      actualizadoEn: new Date().toISOString(),
    };
  } catch (error) {
    console.warn('[TipoCambio] Error con BCRP:', error);
    return null;
  }
}

/** 4. eApi Peru - alternativa gratuita */
async function fetchFromEApi(): Promise<TipoCambioData | null> {
  try {
    const res = await fetch('https://free.e-api.net.pe/tipo-cambio/today.json', {
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.warn(`[TipoCambio] eApi respondio ${res.status}`);
      return null;
    }

    const data = await res.json();

    const compra = parseFloat(data.compra);
    const venta = parseFloat(data.venta);

    if (isNaN(compra) || isNaN(venta) || compra <= 0 || venta <= 0) return null;

    return {
      compra,
      venta,
      fuente: 'SUNAT (eApi)',
      fecha: data.fecha || new Date().toISOString().split('T')[0],
      actualizadoEn: new Date().toISOString(),
    };
  } catch (error) {
    console.warn('[TipoCambio] Error con eApi:', error);
    return null;
  }
}

function updateFallback(data: TipoCambioData): void {
  FALLBACK_DATA.compra = data.compra;
  FALLBACK_DATA.venta = data.venta;
  FALLBACK_DATA.fecha = data.fecha;
}

/** Funcion principal: obtener tipo de cambio con estrategia de fallback */
export async function getTipoCambio(): Promise<TipoCambioData> {
  // 1. Verificar cache
  if (isCacheValid() && cachedData) {
    console.log('[TipoCambio] Usando cache en memoria');
    return cachedData;
  }

  // 2. apis.net.pe
  const apisData = await fetchFromApisNetPe();
  if (apisData) {
    console.log('[TipoCambio] Datos obtenidos de apis.net.pe');
    cachedData = apisData;
    cacheTimestamp = Date.now();
    updateFallback(apisData);
    return apisData;
  }

  // 3. SUNAT TXT directo
  const sunatData = await fetchFromSunatTxt();
  if (sunatData) {
    console.log('[TipoCambio] Datos obtenidos de SUNAT TXT');
    cachedData = sunatData;
    cacheTimestamp = Date.now();
    updateFallback(sunatData);
    return sunatData;
  }

  // 4. BCRP API
  const bcrpData = await fetchFromBCRP();
  if (bcrpData) {
    console.log('[TipoCambio] Datos obtenidos de BCRP');
    cachedData = bcrpData;
    cacheTimestamp = Date.now();
    updateFallback(bcrpData);
    return bcrpData;
  }

  // 5. eApi Peru
  const eapiData = await fetchFromEApi();
  if (eapiData) {
    console.log('[TipoCambio] Datos obtenidos de eApi');
    cachedData = eapiData;
    cacheTimestamp = Date.now();
    updateFallback(eapiData);
    return eapiData;
  }

  // 6. Usar ultimo valor conocido
  console.warn('[TipoCambio] Usando datos de respaldo');
  if (cachedData) return cachedData;
  return { ...FALLBACK_DATA, actualizadoEn: new Date().toISOString() };
}
