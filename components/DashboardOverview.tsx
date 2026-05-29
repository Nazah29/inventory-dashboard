// components/DashboardOverview.tsx
import React from "react";
import { type Product } from "./ProductTable";

interface Activity {
  type: string;
  text: string;
  time: string;
  qty: string;
}

interface DashboardOverviewProps {
  products: Product[];
  activities: Activity[];
  fmt: (n: number) => string;
}

const CATEGORIES = ["Electrónica", "Periféricos", "Componentes", "Computadoras", "Almacenamiento", "Audio", "Mobiliario", "Accesorios"];

export default function DashboardOverview({ products, activities, fmt }: DashboardOverviewProps) {
  // Distribución de categorías
  const catCounts = CATEGORIES.map((c) => ({
    name: c,
    count: products.filter((p) => p.category === c).length,
  })).filter((c) => c.count > 0);
  const maxCount = Math.max(...catCounts.map((c) => c.count), 1);

  // Top productos por ventas
  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 4);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 animate-fade-in">
      {/* Gráfico de categorías */}
      <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-6 shadow-md">
        <h3 className="font-sans text-base font-bold text-slate-200 mb-5">Productos por categoría</h3>
        <div className="flex flex-col gap-4">
          {catCounts.map((c, i) => (
            <div key={c.name}>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-slate-400 font-sans font-semibold">{c.name}</span>
                <span className="text-xs text-slate-200 font-bold">{c.count}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    backgroundColor: `hsl(${210 + i * 15}, 65%, 55%)`,
                    width: `${(c.count / maxCount) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feed de Actividad */}
      <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-6 shadow-md">
        <h3 className="font-sans text-base font-bold text-slate-200 mb-5">Actividad reciente</h3>
        <div className="flex flex-col gap-3.5 max-h-[280px] overflow-y-auto pr-1">
          {activities.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-semibold">No hay actividad reciente</div>
          ) : (
            activities.slice(0, 6).map((a, i) => {
              const colors: Record<string, string> = {
                add: "bg-emerald-500",
                sell: "bg-blue-500",
                alert: "bg-amber-500",
              };
              const dotColor = colors[a.type] || "bg-slate-400";

              return (
                <div key={i} className="flex gap-3 items-start border-b border-slate-800/50 pb-2.5 last:border-0 last:pb-0">
                  <span className={`w-2 h-2 rounded-full ${dotColor} mt-1.5 shrink-0`} />
                  <div className="flex-1">
                    <div className="text-xs text-slate-300 leading-relaxed font-sans font-semibold">{a.text}</div>
                    <div className="flex gap-2.5 mt-0.5 text-[10px]">
                      <span className="text-slate-500 font-sans font-bold">{a.time}</span>
                      <span className={`font-bold ${a.type === 'add' ? 'text-emerald-400' : a.type === 'sell' ? 'text-blue-400' : 'text-amber-400'}`}>
                        {a.qty}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Top Productos por Ventas */}
      <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-6 col-span-full shadow-md">
        <h3 className="font-sans text-base font-bold text-slate-200 mb-5">Top productos por ventas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topProducts.map((p, i) => (
            <div key={p.id} className="bg-[#0f1626]/80 border border-slate-800/60 rounded-xl p-4 hover:border-slate-700 transition-colors">
              <div className="text-lg font-sans font-extrabold text-blue-500 mb-1.5">#{i + 1}</div>
              <div className="text-xs text-slate-200 font-bold mb-1 line-clamp-1 leading-normal">{p.name}</div>
              <div className="text-[10px] text-slate-400 font-sans font-semibold">
                {p.sold} vendidos · <span className="font-bold text-slate-300">{fmt(p.price)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
