// components/ui/StatusBadge.tsx
import React from "react";

export type ProductStatus = "ok" | "low" | "out";

interface StatusBadgeProps {
  status: ProductStatus;
}

const statusConfig = {
  ok: { label: "En stock", dot: "bg-emerald-500", bg: "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50" },
  low: { label: "Stock bajo", dot: "bg-amber-500", bg: "bg-amber-950/40 text-amber-400 border border-amber-900/50" },
  out: { label: "Agotado", dot: "bg-rose-500", bg: "bg-rose-950/40 text-rose-400 border border-rose-900/50" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 ${cfg.bg} px-2.5 py-0.5 rounded-full text-xs font-semibold`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}