import { useState, useCallback } from 'react';
import { RMV, ASIGNACION_FAMILIAR, BONIFICACION_EXTRAORDINARIA } from '../utils/constants';

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Resultado copiado' : 'Copiar total al portapapeles'}
      className="mt-3 mx-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
          Copiado
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copiar total
        </>
      )}
    </button>
  );
}

export default function CalculadoraLiquidacion() {
  const [sueldoBasico, setSueldoBasico] = useState<string>(String(RMV));
  const [asignacionFamiliar, setAsignacionFamiliar] = useState<boolean>(false);
  const [mesesTrabajados, setMesesTrabajados] = useState<string>('12');
  const [diasVacaciones, setDiasVacaciones] = useState<string>('0');
  const [motivoCese, setMotivoCese] = useState<string>('renuncia');
  const [error, setError] = useState<string>('');

  const sueldo = parseFloat(sueldoBasico) || 0;
  const af = asignacionFamiliar ? ASIGNACION_FAMILIAR : 0;
  const remuneracion = sueldo + af;
  const meses = parseInt(mesesTrabajados) || 0;
  const diasVac = parseInt(diasVacaciones) || 0;

  // CTS: (rem + 1/6 grat) / 12 * meses
  const sextoGrat = remuneracion / 6;
  const remCTS = remuneracion + sextoGrat;
  const cts = (remCTS / 12) * (meses > 6 ? 6 : meses);

  // Gratificación trunca: (rem / 6) * mesesSemestre
  const mesesSemestre = meses > 6 ? 6 : meses;
  const gratTrunca = (remuneracion / 6) * mesesSemestre;
  const bonificacion9 = gratTrunca * BONIFICACION_EXTRAORDINARIA;

  // Vacaciones truncas: (rem / 12) * meses + días pendientes
  const vacTruncas = (remuneracion / 12) * meses;
  const vacPendientes = (remuneracion / 30) * diasVac;

  // Indemnización por despido arbitrario: 1.5 rem por año (max 12 rem)
  const esDespitoArbitrario = motivoCese === 'despido';
  const aniosTrabajo = meses / 12;
  const indemnizacion = esDespitoArbitrario
    ? Math.min(remuneracion * 1.5 * aniosTrabajo, remuneracion * 12)
    : 0;

  const totalLiquidacion = cts + gratTrunca + bonificacion9 + vacTruncas + vacPendientes + indemnizacion;

  function handleSueldo(value: string) {
    setSueldoBasico(value);
    const num = parseFloat(value);
    if (value && (isNaN(num) || num <= 0)) {
      setError('El sueldo debe ser mayor a cero.');
    } else {
      setError('');
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <h2 className="text-xl font-bold">Calculadora de Liquidacion</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulario */}
        <div className="space-y-4">
          <div>
            <label htmlFor="liq-sueldo" className="block text-sm font-medium mb-1.5">Sueldo basico mensual (S/)</label>
            <input
              id="liq-sueldo"
              type="number"
              value={sueldoBasico}
              onChange={e => handleSueldo(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 text-lg ${error ? 'border-red-400 bg-red-50' : 'border-[var(--color-border)]'}`}
              min="1"
              aria-describedby={error ? 'liq-sueldo-error' : undefined}
              aria-invalid={!!error}
            />
            {error && (
              <p id="liq-sueldo-error" role="alert" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 p-3 bg-[var(--color-surface-alt)] rounded-xl">
            <input
              type="checkbox"
              id="af-liq"
              checked={asignacionFamiliar}
              onChange={e => setAsignacionFamiliar(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-rose-500 focus:ring-rose-300"
            />
            <label htmlFor="af-liq" className="text-sm">
              Recibo asignacion familiar (S/ {ASIGNACION_FAMILIAR.toFixed(2)})
            </label>
          </div>

          <div>
            <label htmlFor="liq-meses" className="block text-sm font-medium mb-1.5">Meses trabajados en ultimo semestre</label>
            <select
              id="liq-meses"
              value={mesesTrabajados}
              onChange={e => setMesesTrabajados(e.target.value)}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 bg-white"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                <option key={m} value={m}>{m} {m === 1 ? 'mes' : 'meses'}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="liq-vacaciones" className="block text-sm font-medium mb-1.5">Dias de vacaciones pendientes</label>
            <input
              id="liq-vacaciones"
              type="number"
              value={diasVacaciones}
              onChange={e => setDiasVacaciones(e.target.value)}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200"
              min="0"
              max="30"
            />
          </div>

          <div>
            <label htmlFor="liq-motivo" className="block text-sm font-medium mb-1.5">Motivo de cese</label>
            <select
              id="liq-motivo"
              value={motivoCese}
              onChange={e => setMotivoCese(e.target.value)}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 bg-white"
            >
              <option value="renuncia">Renuncia voluntaria</option>
              <option value="despido">Despido arbitrario</option>
              <option value="mutuo">Mutuo acuerdo</option>
            </select>
          </div>
        </div>

        {/* Resultado */}
        <div className="bg-gradient-to-br from-slate-50 to-rose-50/50 rounded-2xl p-6 border border-slate-100" aria-live="polite" aria-label="Resultado del calculo de liquidacion">
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-4 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Detalle de la liquidacion
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">CTS trunca</span>
              <span className="font-mono">S/ {cts.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Gratificacion trunca</span>
              <span className="font-mono">S/ {gratTrunca.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Bonificacion {(BONIFICACION_EXTRAORDINARIA * 100).toFixed(0)}%</span>
              <span className="font-mono text-emerald-600">+ S/ {bonificacion9.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Vacaciones truncas</span>
              <span className="font-mono">S/ {vacTruncas.toFixed(2)}</span>
            </div>
            {diasVac > 0 && (
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Vacaciones pendientes ({diasVac}d)</span>
                <span className="font-mono">S/ {vacPendientes.toFixed(2)}</span>
              </div>
            )}
            {esDespitoArbitrario && (
              <div className="flex justify-between border-t border-[var(--color-border)] pt-3">
                <span className="text-[var(--color-text-muted)]">Indemnizacion por despido</span>
                <span className="font-mono text-rose-600 font-semibold">S/ {indemnizacion.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="mt-6 p-5 gradient-danger rounded-2xl text-center shadow-lg shadow-rose-100/50">
            <p className="text-white/80 text-xs mb-1 flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Total liquidacion aproximada
            </p>
            <p className="text-white text-3xl font-bold" aria-label={`Total liquidacion aproximada: S/ ${totalLiquidacion.toFixed(2)}`}>S/ {totalLiquidacion.toFixed(2)}</p>
            <CopyButton value={`S/ ${totalLiquidacion.toFixed(2)}`} />
          </div>

          <p className="text-xs text-[var(--color-text-muted)] mt-3 text-center">
            Calculo referencial. Consulta con un abogado laboral para casos especificos.
          </p>
        </div>
      </div>
    </div>
  );
}
