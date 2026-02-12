interface BancoData {
  entidad: string;
  compra: number;
  venta: number;
  tipo: 'banco' | 'digital' | 'oficial';
}

interface Props {
  initialCompra?: number;
  initialVenta?: number;
}

function generarDatosBancos(sunatCompra: number, sunatVenta: number): BancoData[] {
  return [
    { entidad: 'SUNAT (Oficial)', compra: sunatCompra, venta: sunatVenta, tipo: 'oficial' },
    { entidad: 'BCP', compra: +(sunatCompra - 0.02).toFixed(3), venta: +(sunatVenta + 0.03).toFixed(3), tipo: 'banco' },
    { entidad: 'Interbank', compra: +(sunatCompra - 0.01).toFixed(3), venta: +(sunatVenta + 0.02).toFixed(3), tipo: 'banco' },
    { entidad: 'BBVA', compra: +(sunatCompra - 0.02).toFixed(3), venta: +(sunatVenta + 0.03).toFixed(3), tipo: 'banco' },
    { entidad: 'Scotiabank', compra: +(sunatCompra - 0.03).toFixed(3), venta: +(sunatVenta + 0.04).toFixed(3), tipo: 'banco' },
    { entidad: 'Rextie', compra: +(sunatCompra + 0.01).toFixed(3), venta: +(sunatVenta + 0.01).toFixed(3), tipo: 'digital' },
    { entidad: 'Kambista', compra: +(sunatCompra + 0.01).toFixed(3), venta: +(sunatVenta + 0.01).toFixed(3), tipo: 'digital' },
    { entidad: 'TKambio', compra: +(sunatCompra).toFixed(3), venta: +(sunatVenta + 0.01).toFixed(3), tipo: 'digital' },
  ];
}

const tipoConfig: Record<string, { bg: string; text: string; label: string; icon: JSX.Element }> = {
  oficial: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    label: 'Oficial',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  banco: {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    label: 'Banco',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  digital: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    label: 'Digital',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
};

export default function ComparadorBancos({ initialCompra = 3.72, initialVenta = 3.75 }: Props) {
  const bancos = generarDatosBancos(initialCompra, initialVenta);
  const mejorCompra = [...bancos].sort((a, b) => b.compra - a.compra)[0];
  const mejorVenta = [...bancos].sort((a, b) => a.venta - b.venta)[0];

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h2 className="text-lg font-bold">Comparador de Tipo de Cambio</h2>
        </div>
      </div>

      {/* Tips - Mejor compra y venta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            <p className="text-xs font-medium text-emerald-600">Mejor para VENDER dolares</p>
          </div>
          <p className="font-bold text-emerald-700 text-lg">{mejorCompra.entidad}</p>
          <p className="text-emerald-800 font-mono text-sm">S/ {mejorCompra.compra.toFixed(3)}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
              <polyline points="17 18 23 18 23 12" />
            </svg>
            <p className="text-xs font-medium text-blue-600">Mejor para COMPRAR dolares</p>
          </div>
          <p className="font-bold text-blue-700 text-lg">{mejorVenta.entidad}</p>
          <p className="text-blue-800 font-mono text-sm">S/ {mejorVenta.venta.toFixed(3)}</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-surface-alt)]">
              <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Entidad</th>
              <th className="text-center py-3 px-3 font-semibold text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Tipo</th>
              <th className="text-right py-3 px-4 font-semibold text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Compra</th>
              <th className="text-right py-3 px-4 font-semibold text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Venta</th>
              <th className="text-right py-3 px-4 font-semibold text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Spread</th>
            </tr>
          </thead>
          <tbody>
            {bancos.map((banco, index) => {
              const spread = (banco.venta - banco.compra).toFixed(3);
              const esMejorCompra = banco.entidad === mejorCompra.entidad;
              const esMejorVenta = banco.entidad === mejorVenta.entidad;
              const config = tipoConfig[banco.tipo];

              return (
                <tr
                  key={banco.entidad}
                  className={`border-t border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] transition-colors ${
                    index === 0 ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-medium">{banco.entidad}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                      {config.icon}
                      {config.label}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-right font-mono ${esMejorCompra ? 'text-emerald-600 font-bold' : ''}`}>
                    S/ {banco.compra.toFixed(3)}
                    {esMejorCompra && (
                      <span className="ml-1 text-xs">★</span>
                    )}
                  </td>
                  <td className={`py-3 px-4 text-right font-mono ${esMejorVenta ? 'text-blue-600 font-bold' : ''}`}>
                    S/ {banco.venta.toFixed(3)}
                    {esMejorVenta && (
                      <span className="ml-1 text-xs">★</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[var(--color-text-muted)]">
                    {spread}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <p className="text-xs text-amber-800">
          <strong>Tasas estimadas.</strong> Los valores de bancos y casas de cambio son aproximaciones basadas en el tipo de cambio SUNAT. Consulta cada entidad para obtener tasas reales y actualizadas.
        </p>
      </div>
    </div>
  );
}
