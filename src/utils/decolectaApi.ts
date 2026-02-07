const API_BASE = 'https://api.decolecta.com/v1';

function getApiKey(): string {
  const key = import.meta.env.DECOLECTA_API_KEY;
  if (!key) throw new Error('DECOLECTA_API_KEY no configurada en .env');
  return key;
}

function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getApiKey()}`,
  };
}

// ==================== TIPO DE CAMBIO ====================

export interface TipoCambioResponse {
  buy_price: string;
  sell_price: string;
  base_currency: string;
  quote_currency: string;
  date: string;
}

/** Obtener tipo de cambio del dia (SUNAT) */
export async function getTipoCambioHoy(): Promise<TipoCambioResponse> {
  const res = await fetch(`${API_BASE}/tipo-cambio/sunat`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Error obteniendo tipo de cambio: ${res.status}`);
  }

  return res.json();
}

/** Obtener tipo de cambio por fecha especifica */
export async function getTipoCambioPorFecha(date: string): Promise<TipoCambioResponse> {
  const res = await fetch(`${API_BASE}/tipo-cambio/sunat?date=${date}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Error obteniendo tipo de cambio para ${date}: ${res.status}`);
  }

  return res.json();
}

/** Obtener tipo de cambio mensual */
export async function getTipoCambioMensual(month: number, year: number): Promise<TipoCambioResponse[]> {
  const res = await fetch(`${API_BASE}/tipo-cambio/sunat?month=${month}&year=${year}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Error obteniendo tipo de cambio mensual: ${res.status}`);
  }

  return res.json();
}

// ==================== RENIEC ====================

export interface ReniecResponse {
  first_name: string;
  first_last_name: string;
  second_last_name: string;
  full_name: string;
  document_number: string;
}

/** Consultar DNI */
export async function consultarDNI(numero: string): Promise<ReniecResponse> {
  const res = await fetch(`${API_BASE}/reniec/dni?numero=${numero}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Error consultando DNI: ${res.status}`);
  }

  return res.json();
}

// ==================== SUNAT RUC ====================

export interface RucBasicoResponse {
  razon_social: string;
  numero_documento: string;
  estado: string;
  condicion: string;
  direccion: string;
  ubigeo: string;
  distrito: string;
  provincia: string;
  departamento: string;
  es_agente_retencion: boolean;
  es_buen_contribuyente: boolean;
}

/** Consultar RUC basico */
export async function consultarRUC(numero: string): Promise<RucBasicoResponse> {
  const res = await fetch(`${API_BASE}/sunat/ruc?numero=${numero}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Error consultando RUC: ${res.status}`);
  }

  return res.json();
}
