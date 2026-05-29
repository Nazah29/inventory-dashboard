// components/ReportsView.tsx
import React from "react";
import { type Product } from "./ProductTable";

interface ReportsViewProps {
  products: Product[];
  totalValue: number;
  totalSold: number;
  lowStock: number;
  outStock: number;
  fmt: (n: number) => string;
}

export default function ReportsView({
  products,
  totalValue,
  totalSold,
  lowStock,
  outStock,
  fmt,
}: ReportsViewProps) {
  // Productos ordenados por más vendidos para el ranking de rendimiento
  const bestPerformers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const averagePrice = products.length > 0 ? products.reduce((acc, curr) => acc + curr.price, 0) / products.length : 0;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Resumen Financiero */}
        <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-6 shadow-md">
          <h3 className="font-sans text-base font-bold text-slate-200 mb-4">Finanzas & Valoración</h3>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400 font-sans font-semibold">Valor Total Activos</span>
              <span className="text-base text-emerald-450 font-extrabold">{fmt(totalValue)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400 font-sans font-semibold">Ventas Totales Registradas</span>
              <span className="text-base text-blue-400 font-bold">{totalSold} unidades</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-400 font-sans font-semibold">Precio Promedio Producto</span>
              <span className="text-sm text-slate-200 font-bold">{fmt(averagePrice)}</span>
            </div>
          </div>
        </div>

        {/* Estado de Inventario */}
        <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-6 shadow-md">
          <h3 className="font-sans text-base font-bold text-slate-200 mb-4">Estado de Inventario</h3>
          <div className="flex flex-col gap-3.5">
            <div className="flex justify-between items-center border-b border-slate-800/50 pb-2.5">
              <span className="text-xs text-slate-400 font-sans font-semibold">Saludable (En Stock)</span>
              <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {products.filter((p) => p.status === "ok").length} prod.
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800/50 pb-2.5">
              <span className="text-xs text-slate-400 font-sans font-semibold">Crítico (Bajo Stock)</span>
              <span className="bg-amber-950/40 text-amber-400 border border-amber-900/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {lowStock} prod.
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 font-sans font-semibold">Inactivo (Agotado)</span>
              <span className="bg-rose-950/40 text-rose-400 border border-rose-900/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {outStock} prod.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Best Performers Table */}
      <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-6 shadow-md">
        <h3 className="font-sans text-base font-bold text-slate-200 mb-5">
          Rendimiento de Productos (Ordenado por más vendidos)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-left bg-[#0f1626]/80">
                <th className="p-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Producto
                </th>
                <th className="p-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Precio
                </th>
                <th className="p-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Vendidos
                </th>
                <th className="p-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Ingresos Estimados
                </th>
              </tr>
            </thead>
            <tbody>
              {bestPerformers.map((p) => (
                <tr key={p.id} className="border-b border-slate-850 hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 text-xs text-slate-200 font-bold">{p.name}</td>
                  <td className="p-3 text-xs text-slate-400 font-medium">{fmt(p.price)}</td>
                  <td className="p-3 text-xs text-slate-300 font-bold">{p.sold} u.</td>
                  <td className="p-3 text-xs text-emerald-450 font-extrabold">{fmt(p.price * p.sold)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
