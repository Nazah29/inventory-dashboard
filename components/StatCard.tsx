// components/StatCard.tsx
import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accentColor: "indigo" | "emerald" | "amber" | "purple";
}

const accentConfig = {
  indigo: { border: "hover:border-indigo-500/30", glow: "hover:shadow-indigo-500/10", gradient: "from-indigo-500/10", text: "text-indigo-400" },
  emerald: { border: "hover:border-emerald-500/30", glow: "hover:shadow-emerald-500/10", gradient: "from-emerald-500/10", text: "text-emerald-400" },
  amber: { border: "hover:border-amber-500/30", glow: "hover:shadow-amber-500/10", gradient: "from-amber-500/10", text: "text-amber-400" },
  purple: { border: "hover:border-purple-500/30", glow: "hover:shadow-purple-500/10", gradient: "from-purple-500/10", text: "text-purple-400" },
};

export default function StatCard({ icon, label, value, sub, accentColor }: StatCardProps) {
  const cfg = accentConfig[accentColor] || accentConfig.indigo;
  return (
    <div className={`bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${cfg.border} ${cfg.glow}`}>
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${cfg.gradient} to-transparent rounded-tr-2xl opacity-50`} />
      <div className="text-2xl mb-3">{icon}</div>
      <div className="text-[11px] text-slate-400 font-dmsans mb-1 tracking-wider uppercase">{label}</div>
      <div className="text-3xl font-extrabold text-slate-100 font-syne leading-none">{value}</div>
      {sub && <div className={`text-xs ${cfg.text} mt-2 font-dmsans`}>{sub}</div>}
    </div>
  );
}