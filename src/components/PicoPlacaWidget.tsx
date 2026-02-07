import { useState } from 'react';

const RESTRICCIONES: Record<number, number[]> = {
  1: [1, 2],
  2: [3, 4],
  3: [5, 6],
  4: [7, 8],
  5: [9, 0],
};

const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

function obtenerInfoHoy() {
  const ahora = new Date();
  const diaNumero = ahora.getDay();
  const dia = DIAS_SEMANA[diaNumero];
  const esFinDeSemana = diaNumero === 0 || diaNumero === 6;
  const placasRestringidas = RESTRICCIONES[diaNumero] || [];
  return { dia, diaNumero, esFinDeSemana, placasRestringidas };
}

export default function PicoPlacaWidget() {
  const [placa, setPlaca] = useState('');
  const info = obtenerInfoHoy();

  const digitos = placa.replace(/\D/g, '');
  const ultimoDigito = digitos.length > 0 ? parseInt(digitos[digitos.length - 1]) : null;
  const restringido = ultimoDigito !== null && !info.esFinDeSemana && info.placasRestringidas.includes(ultimoDigito);

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2-4H8L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"></path>
              <circle cx="7" cy="17" r="2"></circle>
              <circle cx="17" cy="17" r="2"></circle>
            </svg>
          </div>
          <h2 className="text-lg font-bold">Pico y Placa Hoy</h2>
        </div>
        <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-alt)] px-2 py-1 rounded-full">Lima</span>
      </div>

      {/* Estado del dia */}
      {info.esFinDeSemana ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-center">
          <p className="text-green-700 font-semibold text-lg">Hoy es {info.dia}</p>
          <p className="text-green-600 text-sm">No hay restriccion vehicular</p>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <p className="text-center text-amber-800 font-semibold text-lg mb-2">{info.dia}</p>
          <div className="flex justify-center gap-3">
            {info.placasRestringidas.map(num => (
              <span
                key={num}
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500 text-white text-2xl font-bold"
              >
                {num}
              </span>
            ))}
          </div>
          <p className="text-center text-amber-700 text-sm mt-2">
            No circulan placas terminadas en {info.placasRestringidas.join(' y ')}
          </p>
        </div>
      )}

      {/* Horarios */}
      {!info.esFinDeSemana && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[var(--color-surface-alt)] rounded-lg p-3 text-center">
            <p className="text-xs text-[var(--color-text-muted)]">Manana</p>
            <p className="font-semibold text-sm">6:30 - 10:00 a.m.</p>
          </div>
          <div className="bg-[var(--color-surface-alt)] rounded-lg p-3 text-center">
            <p className="text-xs text-[var(--color-text-muted)]">Tarde</p>
            <p className="font-semibold text-sm">5:00 - 9:00 p.m.</p>
          </div>
        </div>
      )}

      {/* Verificador de placa */}
      <div className="border-t border-[var(--color-border)] pt-4">
        <h3 className="text-sm font-semibold mb-3">Verifica tu placa</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={placa}
            onChange={e => setPlaca(e.target.value.toUpperCase())}
            className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] uppercase tracking-widest text-center text-lg font-mono"
            placeholder="ABC-123"
            maxLength={7}
          />
        </div>

        {ultimoDigito !== null && (
          <div
            className={`mt-3 p-3 rounded-lg text-center font-semibold ${
              restringido
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}
          >
            {restringido
              ? `Tu vehiculo NO puede circular hoy (termina en ${ultimoDigito})`
              : info.esFinDeSemana
                ? `Hoy es fin de semana, tu vehiculo puede circular`
                : `Tu vehiculo SI puede circular hoy (termina en ${ultimoDigito})`}
          </div>
        )}
      </div>
    </div>
  );
}
