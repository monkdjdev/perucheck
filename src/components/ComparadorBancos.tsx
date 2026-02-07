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
  // Los bancos y casas de cambio tienen spreads tipicos respecto a SUNAT
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

const tipoColors: Record<string, string> = {
  oficial: 'bg-blue-100 text-blue-700',
  banco: 'bg-gray-100 text-gray-700',
  digital: 'bg-purple-100 text-purple-700',
};

const tipoLabels: Record<string, string> = {
  oficial: 'Oficial',
  banco: 'Banco',
  digital: 'Digital',
};

export default function ComparadorBancos({ initialCompra = 3.72, initialVenta = 3.75 }: Props) {
  const bancos = generarDatosBancos(initialCompra, initialVenta);
  const mejorCompra = [...bancos].sort((a, b) => b.compra - a.compra)[0];
  const mejorVenta = [...bancos].sort((a, b) => a.venta - b.venta)[0];

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
      <h2 className="text-lg font-bold mb-4">Comparador de Tipo de Cambio</h2>

      {/* Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs text-green-600">Mejor para VENDER dolares (compra)</p>
          <p className="font-bold text-green-700">{mejorCompra.entidad}: S/ {mejorCompra.compra.toFixed(3)}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-600">Mejor para COMPRAR dolares (venta)</p>
          <p className="font-bold text-blue-700">{mejorVenta.entidad}: S/ {mejorVenta.venta.toFixed(3)}</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left py-2 px-3 font-semibold">Entidad</th>
              <th className="text-center py-2 px-3 font-semibold">Tipo</th>
              <th className="text-right py-2 px-3 font-semibold">Compra</th>
              <th className="text-right py-2 px-3 font-semibold">Venta</th>
              <th className="text-right py-2 px-3 font-semibold">Spread</th>
            </tr>
          </thead>
          <tbody>
            {bancos.map(banco => {
              const spread = (banco.venta - banco.compra).toFixed(3);
              const esMejorCompra = banco.entidad === mejorCompra.entidad;
              const esMejorVenta = banco.entidad === mejorVenta.entidad;

              return (
                <tr key={banco.entidad} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-alt)] transition-colors">
                  <td className="py-3 px-3 font-medium">{banco.entidad}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tipoColors[banco.tipo]}`}>
                      {tipoLabels[banco.tipo]}
                    </span>
                  </td>
                  <td className={`py-3 px-3 text-right font-mono ${esMejorCompra ? 'text-green-600 font-bold' : ''}`}>
                    S/ {banco.compra.toFixed(3)}
                  </td>
                  <td className={`py-3 px-3 text-right font-mono ${esMejorVenta ? 'text-blue-600 font-bold' : ''}`}>
                    S/ {banco.venta.toFixed(3)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[var(--color-text-muted)]">
                    {spread}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[var(--color-text-muted)] mt-4">
        * Datos referenciales basados en el tipo de cambio SUNAT. Los valores de bancos y casas de cambio
        son estimados y pueden variar segun el monto y canal de operacion. Spread = diferencia entre venta y compra.
      </p>
    </div>
  );
}
