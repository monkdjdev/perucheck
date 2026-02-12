import { useState, useCallback } from 'react';

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <button onClick={handleCopy} className="mt-3 mx-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-white text-xs font-medium">
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Copiado
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copiar resultado
        </>
      )}
    </button>
  );
}

export default function CalculadoraCTS() {
  const [sueldoBasico, setSueldoBasico] = useState<string>('1130');
  const [asignacionFamiliar, setAsignacionFamiliar] = useState<boolean>(false);
  const [mesesTrabajados, setMesesTrabajados] = useState<string>('6');
  const [diasTrabajados, setDiasTrabajados] = useState<string>('0');

  const sueldo = parseFloat(sueldoBasico) || 0;
  const af = asignacionFamiliar ? 113 : 0;
  const remuneracionComputable = sueldo + af;

  const sextoGratificacion = remuneracionComputable / 6;
  const remuneracionTotal = remuneracionComputable + sextoGratificacion;

  const meses = parseInt(mesesTrabajados) || 0;
  const dias = parseInt(diasTrabajados) || 0;

  const ctsMeses = (remuneracionTotal / 12) * meses;
  const ctsDias = (remuneracionTotal / 360) * dias;
  const ctsTotal = ctsMeses + ctsDias;

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>
        <h2 className="text-xl font-bold">Calculadora de CTS</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulario */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[var(--color-text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Sueldo basico mensual (S/)
              </span>
            </label>
            <input
              type="number"
              value={sueldoBasico}
              onChange={e => setSueldoBasico(e.target.value)}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-lg"
              min="0"
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-[var(--color-surface-alt)] rounded-xl">
            <input
              type="checkbox"
              id="af"
              checked={asignacionFamiliar}
              onChange={e => setAsignacionFamiliar(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <label htmlFor="af" className="text-sm">
              Recibo asignacion familiar (S/ 113.00)
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[var(--color-text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Meses trabajados
                </span>
              </label>
              <select
                value={mesesTrabajados}
                onChange={e => setMesesTrabajados(e.target.value)}
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
              >
                {[0, 1, 2, 3, 4, 5, 6].map(m => (
                  <option key={m} value={m}>{m} {m === 1 ? 'mes' : 'meses'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Dias adicionales</label>
              <input
                type="number"
                value={diasTrabajados}
                onChange={e => setDiasTrabajados(e.target.value)}
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                min="0"
                max="29"
              />
            </div>
          </div>
        </div>

        {/* Resultado */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl p-6 border border-slate-100">
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-4 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
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
              <span className="text-[var(--color-text-muted)]">1/6 Gratificacion</span>
              <span className="font-mono">S/ {sextoGratificacion.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-border)] pt-3">
              <span className="text-[var(--color-text-muted)]">Remuneracion computable</span>
              <span className="font-semibold font-mono">S/ {remuneracionTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Periodo</span>
              <span className="font-mono">{meses} meses, {dias} dias</span>
            </div>
          </div>

          <div className="mt-6 p-5 gradient-primary rounded-2xl text-center shadow-lg shadow-indigo-200/50">
            <p className="text-white/80 text-xs mb-1 flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Tu CTS aproximada es
            </p>
            <p className="text-white text-3xl font-bold">S/ {ctsTotal.toFixed(2)}</p>
            <CopyButton value={`S/ ${ctsTotal.toFixed(2)}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
