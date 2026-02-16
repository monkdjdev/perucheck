/**
 * Constantes fiscales y laborales del Peru 2026
 * Actualizar anualmente o cuando cambie la normativa
 */

// Laborales
export const RMV = 1130; // Remuneracion Minima Vital (S/)
export const ASIGNACION_FAMILIAR = 113; // 10% de la RMV (S/)
export const UIT = 5500; // Unidad Impositiva Tributaria 2026 (S/)
export const IGV = 0.18; // Impuesto General a las Ventas

// Gratificacion
export const BONIFICACION_EXTRAORDINARIA = 0.09; // Ley 30334

// CTS
export const MESES_ANIO = 12;
export const DIAS_MES_CTS = 30;

// Pico y placa Lima Metropolitana
export const PICO_PLACA_HORARIOS = [
  { inicio: '6:30 a.m.', fin: '10:00 a.m.' },
  { inicio: '5:00 p.m.', fin: '9:00 p.m.' },
] as const;

export const PICO_PLACA_RESTRICCIONES: Record<number, number[]> = {
  1: [1, 2], // Lunes
  2: [3, 4], // Martes
  3: [5, 6], // Miercoles
  4: [7, 8], // Jueves
  5: [9, 0], // Viernes
};
