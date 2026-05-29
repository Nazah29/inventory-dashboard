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
  indigo: { border: "hover:border-blue-500/30", text: "text-blue-400" },
  emerald: { border: "hover:border-emerald-500/30", text: "text-emerald-450" },
  amber: { border: "hover:border-amber-500/30", text: "text-amber-450" },
  purple: { border: "hover:border-blue-500/30", text: "text-blue-400" },
};

export default function StatCard({ icon, label, value, sub, accentColor }: StatCardProps) {
  const cfg = accentConfig[accentColor] || accentConfig.indigo;
  return (
    <div className={`bg-[#131b2e] border border-slate-800/80 rounded-2xl p-6 transition-all duration-300 ${cfg.border} hover:shadow-lg`}>
      <div className="text-2xl mb-3">{icon}</div>
      <div className="text-[11px] text-slate-400 font-sans mb-1.5 tracking-wider uppercase font-semibold">{label}</div>
      <div className="text-2xl font-bold text-white font-sans leading-none">{value}</div>
      {sub && <div className={`text-xs ${cfg.text} mt-2 font-sans`}>{sub}</div>}
    </div>
  );
}