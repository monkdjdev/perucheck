export interface TipoCambioData {
  compra: number;
  venta: number;
  fuente: string;
  fecha: string;
}

export interface TipoCambioComparador {
  entidad: string;
  compra: number;
  venta: number;
  tipo: 'banco' | 'digital' | 'oficial';
}

// Datos de ejemplo (en produccion se conectaria a APIs reales)
// APIs sugeridas: apis.net.pe, sunat.gob.pe
export function obtenerTipoCambioSunat(): TipoCambioData {
  const hoy = new Date().toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return {
    compra: 3.72,
    venta: 3.75,
    fuente: 'SUNAT',
    fecha: hoy,
  };
}

export function obtenerComparadorBancos(): TipoCambioComparador[] {
  return [
    { entidad: 'SUNAT (Oficial)', compra: 3.72, venta: 3.75, tipo: 'oficial' },
    { entidad: 'BCP', compra: 3.70, venta: 3.78, tipo: 'banco' },
    { entidad: 'Interbank', compra: 3.71, venta: 3.77, tipo: 'banco' },
    { entidad: 'BBVA', compra: 3.70, venta: 3.78, tipo: 'banco' },
    { entidad: 'Scotiabank', compra: 3.69, venta: 3.79, tipo: 'banco' },
    { entidad: 'Rextie', compra: 3.73, venta: 3.76, tipo: 'digital' },
    { entidad: 'Kambista', compra: 3.73, venta: 3.76, tipo: 'digital' },
    { entidad: 'TKambio', compra: 3.72, venta: 3.76, tipo: 'digital' },
  ];
}

export function convertirMoneda(
  monto: number,
  tipo: 'compra' | 'venta',
  direccion: 'soles-a-dolares' | 'dolares-a-soles'
): number {
  const tc = obtenerTipoCambioSunat();
  const tasa = tipo === 'compra' ? tc.compra : tc.venta;

  if (direccion === 'dolares-a-soles') {
    return monto * tasa;
  }
  return monto / tasa;
}
