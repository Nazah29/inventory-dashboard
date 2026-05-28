// components/ui/StatusBadge.tsx
import React from "react";

export type ProductStatus = "ok" | "low" | "out";

interface StatusBadgeProps {
  status: ProductStatus;
}

const statusConfig = {
  ok: { label: "En stock", dot: "bg-emerald-500", bg: "bg-emerald-500/10 text-emerald-400" },
  low: { label: "Stock bajo", dot: "bg-amber-500", bg: "bg-amber-500/10 text-amber-400" },
  out: { label: "Agotado", dot: "bg-red-500", bg: "bg-red-500/10 text-red-400" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 ${cfg.bg} px-2.5 py-1 rounded-full text-xs font-semibold`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}