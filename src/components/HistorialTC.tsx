import { useState, useEffect } from 'react';

interface DataPoint {
  fecha: string;
  compra: number;
  venta: number;
}

export default function HistorialTC() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchHistorial() {
      try {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 35 * 24 * 60 * 60 * 1000);
        const y1 = thirtyDaysAgo.getFullYear();
        const m1 = thirtyDaysAgo.getMonth() + 1;
        const d1 = thirtyDaysAgo.getDate();
        const y2 = today.getFullYear();
        const m2 = today.getMonth() + 1;
        const d2 = today.getDate();

        const url = `https://estadisticas.bcrp.gob.pe/estadisticas/series/api/PD04639PD-PD04640PD/json/${y1}-${m1}-${d1}/${y2}-${m2}-${d2}/ing`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error fetching');

        const json = await res.json();
        if (!json.periods || json.periods.length === 0) throw new Error('No data');

        const points: DataPoint[] = json.periods
          .filter((p: { values: string[] }) => p.values[0] !== 'n.d.' && p.values[1] !== 'n.d.')
          .map((p: { name: string; values: string[] }) => ({
            fecha: p.name,
            compra: parseFloat(p.values[0]),
            venta: parseFloat(p.values[1]),
          }));

        setData(points);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchHistorial();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-200 rounded w-48"></div>
          <div className="h-48 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || data.length === 0) return null;

  // Chart dimensions
  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 15, bottom: 30, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allValues = data.flatMap(d => [d.compra, d.venta]);
  const minVal = Math.min(...allValues) - 0.005;
  const maxVal = Math.max(...allValues) + 0.005;
  const range = maxVal - minVal || 0.01;

  const scaleX = (i: number) => padding.left + (i / (data.length - 1)) * chartW;
  const scaleY = (v: number) => padding.top + chartH - ((v - minVal) / range) * chartH;

  const lineCompra = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${scaleX(i).toFixed(1)},${scaleY(d.compra).toFixed(1)}`).join(' ');
  const lineVenta = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${scaleX(i).toFixed(1)},${scaleY(d.venta).toFixed(1)}`).join(' ');

  // Y axis ticks
  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => minVal + (range / ticks) * i);

  // X labels (first, middle, last)
  const xLabels = [
    { i: 0, label: data[0].fecha },
    { i: Math.floor(data.length / 2), label: data[Math.floor(data.length / 2)].fecha },
    { i: data.length - 1, label: data[data.length - 1].fecha },
  ];

  const lastPoint = data[data.length - 1];
  const firstPoint = data[0];
  const tendenciaVenta = lastPoint.venta - firstPoint.venta;

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <h2 className="text-lg font-bold">Historial de Tipo de Cambio</h2>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          tendenciaVenta >= 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
        }`}>
          {tendenciaVenta >= 0 ? '▲' : '▼'} {Math.abs(tendenciaVenta).toFixed(3)} (30d)
        </span>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded bg-emerald-500 inline-block"></span>
          Compra
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded bg-indigo-500 inline-block"></span>
          Venta
        </span>
      </div>

      {/* SVG Chart */}
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ minWidth: '300px' }}>
          {/* Grid lines */}
          {yTicks.map(tick => (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={scaleY(tick)}
                x2={width - padding.right}
                y2={scaleY(tick)}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={scaleY(tick) + 4}
                textAnchor="end"
                className="text-[10px] fill-[var(--color-text-muted)]"
                style={{ fontSize: '10px' }}
              >
                {tick.toFixed(3)}
              </text>
            </g>
          ))}

          {/* X labels */}
          {xLabels.map(({ i, label }) => (
            <text
              key={i}
              x={scaleX(i)}
              y={height - 5}
              textAnchor="middle"
              className="text-[9px] fill-[var(--color-text-muted)]"
              style={{ fontSize: '9px' }}
            >
              {label}
            </text>
          ))}

          {/* Lines */}
          <path d={lineCompra} fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />
          <path d={lineVenta} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" />

          {/* Last point dots */}
          <circle cx={scaleX(data.length - 1)} cy={scaleY(lastPoint.compra)} r="4" fill="#10b981" />
          <circle cx={scaleX(data.length - 1)} cy={scaleY(lastPoint.venta)} r="4" fill="#6366f1" />
        </svg>
      </div>

      <p className="text-xs text-[var(--color-text-muted)] mt-3">
        Fuente: Banco Central de Reserva del Peru (BCRP). Tipo de cambio SBS.
      </p>
    </div>
  );
}
