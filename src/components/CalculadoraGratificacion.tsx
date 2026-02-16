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
      aria-label={copied ? 'Resultado copiado' : 'Copiar resultado al portapapeles'}
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
          Copiar resultado
        </>
      )}
    </button>
  );
}

export default function CalculadoraGratificacion() {
  const [sueldoBasico, setSueldoBasico] = useState<string>(String(RMV));
  const [asignacionFamiliar, setAsignacionFamiliar] = useState<boolean>(false);
  const [mesesTrabajados, setMesesTrabajados] = useState<string>('6');
  const [error, setError] = useState<string>('');

  const sueldo = parseFloat(sueldoBasico) || 0;
  const af = asignacionFamiliar ? ASIGNACION_FAMILIAR : 0;
  const remuneracionComputable = sueldo + af;
  const meses = parseInt(mesesTrabajados) || 0;

  const gratificacion = (remuneracionComputable / 6) * meses;
  const bonificacion = gratificacion * BONIFICACION_EXTRAORDINARIA;
  const totalRecibir = gratificacion + bonificacion;

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
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
            <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
            <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold">Calculadora de Gratificacion</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulario */}
        <div className="space-y-4">
          <div>
            <label htmlFor="grat-sueldo" className="block text-sm font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[var(--color-text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Sueldo basico mensual (S/)
              </span>
            </label>
            <input
              id="grat-sueldo"
              type="number"
              value={sueldoBasico}
              onChange={e => handleSueldo(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-lg ${error ? 'border-red-400 bg-red-50' : 'border-[var(--color-border)]'}`}
              min="1"
              aria-describedby={error ? 'grat-sueldo-error' : undefined}
              aria-invalid={!!error}
            />
            {error && (
              <p id="grat-sueldo-error" role="alert" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 p-3 bg-[var(--color-surface-alt)] rounded-xl">
            <input
              type="checkbox"
              id="af-grat"
              checked={asignacionFamiliar}
              onChange={e => setAsignacionFamiliar(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <label htmlFor="af-grat" className="text-sm">
              Recibo asignacion familiar (S/ {ASIGNACION_FAMILIAR.toFixed(2)})
            </label>
          </div>

          <div>
            <label htmlFor="grat-meses" className="block text-sm font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[var(--color-text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Meses trabajados en el semestre
              </span>
            </label>
            <select
              id="grat-meses"
              value={mesesTrabajados}
              onChange={e => setMesesTrabajados(e.target.value)}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
            >
              {[1, 2, 3, 4, 5, 6].map(m => (
                <option key={m} value={m}>{m} {m === 1 ? 'mes' : 'meses'}</option>
              ))}
            </select>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <p className="text-xs text-indigo-700">
                <strong>Semestres:</strong> Enero-Junio (pago en Julio) y Julio-Diciembre (pago en Diciembre).
                Se debe haber trabajado al menos 1 mes completo para recibir gratificacion.
              </p>
            </div>
          </div>
        </div>

        {/* Resultado */}
        <div className="bg-gradient-to-br from-slate-50 to-emerald-50/50 rounded-2xl p-6 border border-slate-100" aria-live="polite" aria-label="Resultado del calculo de gratificacion">
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-4 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Detalle del calculo
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Sueldo basico</span>
              <span className="font-mono">S/ {sueldo.toFixed(2)}</span>
            </div>
            {asignacionFamiliar && (
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Asignacion familiar</span>
                <span className="font-mono">S/ {af.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Remuneracion computable</span>
              <span className="font-mono">S/ {remuneracionComputable.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Meses en el semestre</span>
              <span className="font-mono">{meses} de 6</span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-border)] pt-3">
              <span className="text-[var(--color-text-muted)]">Gratificacion bruta</span>
              <span className="font-mono">S/ {gratificacion.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Bonificacion {(BONIFICACION_EXTRAORDINARIA * 100).toFixed(0)}% (Ley 30334)</span>
              <span className="text-emerald-600 font-semibold font-mono">+ S/ {bonificacion.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 p-5 gradient-success rounded-2xl text-center shadow-lg shadow-emerald-200/50">
            <p className="text-white/80 text-xs mb-1 flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
              </svg>
              Total a recibir
            </p>
            <p className="text-white text-3xl font-bold" aria-label={`Total a recibir: S/ ${totalRecibir.toFixed(2)}`}>S/ {totalRecibir.toFixed(2)}</p>
            <CopyButton value={`S/ ${totalRecibir.toFixed(2)}`} />
          </div>

          <p className="text-xs text-[var(--color-text-muted)] mt-3 text-center">
            La gratificacion esta exonerada del Impuesto a la Renta y de aportes al trabajador.
          </p>
        </div>
      </div>
    </div>
  );
}
