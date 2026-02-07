import { useState, useEffect } from 'react';

interface TipoCambioData {
  compra: number;
  venta: number;
  fuente: string;
  fecha: string;
}

export default function TipoCambioWidget({ initialData }: { initialData?: TipoCambioData }) {
  const [tc, setTc] = useState<TipoCambioData>(
    initialData || {
      compra: 0,
      venta: 0,
      fuente: 'Cargando...',
      fecha: '',
    }
  );
  const [loading, setLoading] = useState(!initialData);
  const [monto, setMonto] = useState<string>('100');
  const [direccion, setDireccion] = useState<'dolares-a-soles' | 'soles-a-dolares'>('dolares-a-soles');

  useEffect(() => {
    if (!initialData) {
      fetch('/api/tipo-cambio')
        .then(res => res.json())
        .then(data => {
          setTc({
            compra: data.compra,
            venta: data.venta,
            fuente: data.fuente || 'SUNAT',
            fecha: data.fecha || new Date().toLocaleDateString('es-PE'),
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, []);

  const montoNum = parseFloat(monto) || 0;
  const resultado =
    direccion === 'dolares-a-soles'
      ? montoNum * tc.venta
      : montoNum / tc.compra;

  const fechaFormateada = tc.fecha
    ? new Date(tc.fecha + 'T00:00:00').toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold">Tipo de Cambio Hoy</h2>
        </div>
        <span className="text-xs text-[var(--color-text-muted)]">
          {tc.fuente}{fechaFormateada ? ` - ${fechaFormateada}` : ''}
        </span>
      </div>

      {/* Tasas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--color-surface-alt)] rounded-lg p-4 text-center">
          <p className="text-sm text-[var(--color-text-muted)] mb-1">Compra</p>
          {loading ? (
            <div className="h-9 bg-gray-200 rounded animate-pulse mx-auto w-24"></div>
          ) : (
            <p className="text-3xl font-bold text-[var(--color-success)]">
              S/ {tc.compra.toFixed(3)}
            </p>
          )}
        </div>
        <div className="bg-[var(--color-surface-alt)] rounded-lg p-4 text-center">
          <p className="text-sm text-[var(--color-text-muted)] mb-1">Venta</p>
          {loading ? (
            <div className="h-9 bg-gray-200 rounded animate-pulse mx-auto w-24"></div>
          ) : (
            <p className="text-3xl font-bold text-[var(--color-danger)]">
              S/ {tc.venta.toFixed(3)}
            </p>
          )}
        </div>
      </div>

      {/* Convertidor */}
      <div className="border-t border-[var(--color-border)] pt-4">
        <h3 className="text-sm font-semibold mb-3">Convertidor rapido</h3>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1 w-full">
            <label className="text-xs text-[var(--color-text-muted)] block mb-1">
              {direccion === 'dolares-a-soles' ? 'Dolares (USD)' : 'Soles (PEN)'}
            </label>
            <input
              type="number"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-lg"
              placeholder="100"
              min="0"
            />
          </div>

          <button
            onClick={() =>
              setDireccion(d =>
                d === 'dolares-a-soles' ? 'soles-a-dolares' : 'dolares-a-soles'
              )
            }
            className="p-2 rounded-lg bg-[var(--color-surface-alt)] hover:bg-[var(--color-border)] transition-colors shrink-0"
            aria-label="Cambiar direccion"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>

          <div className="flex-1 w-full">
            <label className="text-xs text-[var(--color-text-muted)] block mb-1">
              {direccion === 'dolares-a-soles' ? 'Soles (PEN)' : 'Dolares (USD)'}
            </label>
            <div className="w-full px-3 py-2 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-lg text-lg font-semibold">
              {loading ? (
                <span className="text-[var(--color-text-muted)]">...</span>
              ) : (
                <>
                  {direccion === 'dolares-a-soles' ? 'S/ ' : '$ '}
                  {resultado.toFixed(2)}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
