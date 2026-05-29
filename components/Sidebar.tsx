// components/Sidebar.tsx
import React from "react";

interface SidebarProps {
  currentView: "pos" | "overview" | "table" | "reports";
  onViewChange: (view: "pos" | "overview" | "table" | "reports") => void;
  lowStockCount: number;
  outStockCount: number;
}

export default function Sidebar({ currentView, onViewChange, lowStockCount, outStockCount }: SidebarProps) {
  const totalAlerts = lowStockCount + outStockCount;

  const sidebarItems = [
    { icon: "🛒", label: "Punto de Venta", view: "pos" as const, active: currentView === "pos" },
    { icon: "⊞", label: "Dashboard", view: "overview" as const, active: currentView === "overview" },
    { icon: "📦", label: "Inventario", view: "table" as const, active: currentView === "table" },
    { icon: "📊", label: "Reportes", view: "reports" as const, active: currentView === "reports" },
  ];

  return (
    <aside className="w-56 bg-[#070b13] border-r border-slate-800/80 flex flex-col p-7 shrink-0 h-screen">
      <div className="px-2 pb-8 border-b border-slate-800/80">
        <div className="font-sans text-xl font-extrabold text-white tracking-tight">
          <span className="text-blue-500 mr-1.5">■</span>StockOS
        </div>
        <div className="text-[11px] text-slate-500 mt-1.5 font-semibold">Sistema de inventario</div>
      </div>
      
      <nav className="mt-6 flex-1 flex flex-col gap-1">
        {sidebarItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onViewChange(item.view)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left w-full text-sm transition-all duration-200 ${
              item.active
                ? "bg-white/10 text-white font-bold"
                : "bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
            {item.label === "Inventario" && totalAlerts > 0 ? (
              <span className="ml-auto bg-blue-600 text-white rounded-full text-[10px] px-1.5 py-0.5 font-bold">
                {totalAlerts}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="border-t border-slate-800/80 pt-4">
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
            FN
          </div>
          <div>
            <div className="text-xs text-slate-200 font-bold">Franco N.</div>
            <div className="text-[11px] text-slate-500">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}