import { useState } from 'react';

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
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
      <h2 className="text-xl font-bold mb-6">Calculadora de CTS</h2>

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
              id="af"
              checked={asignacionFamiliar}
              onChange={e => setAsignacionFamiliar(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="af" className="text-sm">
              Recibo asignacion familiar (S/ 113.00)
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Meses trabajados</label>
              <select
                value={mesesTrabajados}
                onChange={e => setMesesTrabajados(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                {[0, 1, 2, 3, 4, 5, 6].map(m => (
                  <option key={m} value={m}>{m} {m === 1 ? 'mes' : 'meses'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dias adicionales</label>
              <input
                type="number"
                value={diasTrabajados}
                onChange={e => setDiasTrabajados(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                min="0"
                max="29"
              />
            </div>
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
              <span className="text-[var(--color-text-muted)]">1/6 Gratificacion</span>
              <span>S/ {sextoGratificacion.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-border)] pt-2">
              <span className="text-[var(--color-text-muted)]">Remuneracion computable</span>
              <span className="font-semibold">S/ {remuneracionTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Periodo</span>
              <span>{meses} meses, {dias} dias</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[var(--color-primary)] rounded-xl text-center">
            <p className="text-white/80 text-xs mb-1">Tu CTS aproximada es</p>
            <p className="text-white text-3xl font-bold">S/ {ctsTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
