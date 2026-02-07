// Reglas de Pico y Placa Lima Metropolitana 2024-2025
// Horario: Lunes a Viernes de 6:30 a.m. a 10:00 a.m. y de 5:00 p.m. a 9:00 p.m.
// Fuente: Municipalidad de Lima

const RESTRICCIONES: Record<number, number[]> = {
  1: [1, 2], // Lunes: placas terminadas en 1 y 2
  2: [3, 4], // Martes: placas terminadas en 3 y 4
  3: [5, 6], // Miercoles: placas terminadas en 5 y 6
  4: [7, 8], // Jueves: placas terminadas en 7 y 8
  5: [9, 0], // Viernes: placas terminadas en 9 y 0
};

const DIAS_SEMANA = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado',
];

const HORARIOS = [
  { inicio: '6:30 a.m.', fin: '10:00 a.m.' },
  { inicio: '5:00 p.m.', fin: '9:00 p.m.' },
];

export interface PicoPlacaInfo {
  dia: string;
  diaNumero: number;
  placasRestringidas: number[];
  esFinDeSemana: boolean;
  horarios: typeof HORARIOS;
}

export function obtenerPicoPlacaHoy(): PicoPlacaInfo {
  const ahora = new Date();
  const diaNumero = ahora.getDay();
  const dia = DIAS_SEMANA[diaNumero];
  const esFinDeSemana = diaNumero === 0 || diaNumero === 6;
  const placasRestringidas = RESTRICCIONES[diaNumero] || [];

  return {
    dia,
    diaNumero,
    placasRestringidas,
    esFinDeSemana,
    horarios: HORARIOS,
  };
}

export function obtenerPicoPlacaSemana(): PicoPlacaInfo[] {
  return [1, 2, 3, 4, 5].map(diaNum => ({
    dia: DIAS_SEMANA[diaNum],
    diaNumero: diaNum,
    placasRestringidas: RESTRICCIONES[diaNum],
    esFinDeSemana: false,
    horarios: HORARIOS,
  }));
}

export function verificarPlaca(placa: string): {
  restringidoHoy: boolean;
  ultimoDigito: number | null;
  info: PicoPlacaInfo;
} {
  const info = obtenerPicoPlacaHoy();
  const digitos = placa.replace(/\D/g, '');

  if (digitos.length === 0) {
    return { restringidoHoy: false, ultimoDigito: null, info };
  }

  const ultimoDigito = parseInt(digitos[digitos.length - 1]);
  const restringidoHoy = !info.esFinDeSemana && info.placasRestringidas.includes(ultimoDigito);

  return { restringidoHoy, ultimoDigito, info };
}
