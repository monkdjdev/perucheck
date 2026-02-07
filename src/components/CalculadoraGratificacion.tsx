import { useState } from 'react';

export default function CalculadoraGratificacion() {
  const [sueldoBasico, setSueldoBasico] = useState<string>('1130');
  const [asignacionFamiliar, setAsignacionFamiliar] = useState<boolean>(false);
  const [mesesTrabajados, setMesesTrabajados] = useState<string>('6');

  const sueldo = parseFloat(sueldoBasico) || 0;
  const af = asignacionFamiliar ? 113 : 0;
  const remuneracionComputable = sueldo + af;
  const meses = parseInt(mesesTrabajados) || 0;

  const gratificacion = (remuneracionComputable / 6) * meses;
  const bonificacion = gratificacion * 0.09;
  const totalRecibir = gratificacion + bonificacion;

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
      <h2 className="text-xl font-bold mb-6">Calculadora de Gratificacion</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sueldo basico mensual (S/)</label>
            <input
              type="number"
              value={sueldoBasico}
              onChange={e => setSueldoBasico(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              min="0"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="af-grat"
              checked={asignacionFamiliar}
              onChange={e => setAsignacionFamiliar(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="af-grat" className="text-sm">
              Recibo asignacion familiar (S/ 113.00)
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Meses trabajados en el semestre</label>
            <select
              value={mesesTrabajados}
              onChange={e => setMesesTrabajados(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              {[1, 2, 3, 4, 5, 6].map(m => (
                <option key={m} value={m}>{m} {m === 1 ? 'mes' : 'meses'}</option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              <strong>Semestres:</strong> Enero-Junio (pago en Julio) y Julio-Diciembre (pago en Diciembre).
              Se debe haber trabajado al menos 1 mes completo para recibir gratificacion.
            </p>
          </div>
        </div>

        <div className="bg-[var(--color-surface-alt)] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-4">Detalle del calculo</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Sueldo basico</span>
              <span>S/ {sueldo.toFixed(2)}</span>
            </div>
            {asignacionFamiliar && (
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Asignacion familiar</span>
                <span>S/ {af.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Remuneracion computable</span>
              <span>S/ {remuneracionComputable.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Meses en el semestre</span>
              <span>{meses} de 6</span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-border)] pt-2">
              <span className="text-[var(--color-text-muted)]">Gratificacion bruta</span>
              <span>S/ {gratificacion.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Bonificacion 9% (Ley 30334)</span>
              <span className="text-[var(--color-success)]">+ S/ {bonificacion.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[var(--color-secondary)] rounded-xl text-center">
            <p className="text-white/80 text-xs mb-1">Total a recibir</p>
            <p className="text-white text-3xl font-bold">S/ {totalRecibir.toFixed(2)}</p>
          </div>

          <p className="text-xs text-[var(--color-text-muted)] mt-3 text-center">
            La gratificacion esta exonerada del Impuesto a la Renta y de aportes al trabajador.
          </p>
        </div>
      </div>
    </div>
  );
}
