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
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
          <h3 className="font-syne text-base font-bold text-slate-200 mb-4">Finanzas & Valoración</h3>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between border-b border-white/[0.05] pb-3">
              <span className="text-xs text-slate-400 font-dmsans">Valor Total Activos</span>
              <span className="text-base text-emerald-400 font-bold">{fmt(totalValue)}</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.05] pb-3">
              <span className="text-xs text-slate-400 font-dmsans">Ventas Totales Registradas</span>
              <span className="text-base text-indigo-400 font-bold">{totalSold} unidades</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-400 font-dmsans">Precio Promedio Producto</span>
              <span className="text-sm text-slate-200 font-semibold">{fmt(averagePrice)}</span>
            </div>
          </div>
        </div>

        {/* Estado de Inventario */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
          <h3 className="font-syne text-base font-bold text-slate-200 mb-4">Estado de Inventario</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 font-dmsans">Saludable (En Stock)</span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {products.filter((p) => p.status === "ok").length} prod.
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 font-dmsans">Crítico (Bajo Stock)</span>
              <span className="bg-amber-500/10 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {lowStock} prod.
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 font-dmsans">Inactivo (Agotado)</span>
              <span className="bg-red-500/10 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {outStock} prod.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Best Performers Table */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
        <h3 className="font-syne text-base font-bold text-slate-200 mb-5">
          Rendimiento de Productos (Ordenado por más vendidos)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07] text-left">
                <th className="p-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Producto
                </th>
                <th className="p-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Precio
                </th>
                <th className="p-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Vendidos
                </th>
                <th className="p-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Ingresos Estimados
                </th>
              </tr>
            </thead>
            <tbody>
              {bestPerformers.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.03] hover:bg-white/[0.01]">
                  <td className="p-3 text-xs text-slate-200 font-semibold">{p.name}</td>
                  <td className="p-3 text-xs text-slate-400">{fmt(p.price)}</td>
                  <td className="p-3 text-xs text-indigo-400 font-bold">{p.sold} u.</td>
                  <td className="p-3 text-xs text-emerald-400 font-bold">{fmt(p.price * p.sold)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
