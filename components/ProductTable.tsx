// components/ProductTable.tsx
import React from "react";
import StatusBadge, { type ProductStatus } from "./ui/StatusBadge";

export interface Product {
  id: number | string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
  status: ProductStatus;
  sold: number;
}

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const fmt = (n: number) => `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;

  return (
    <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl overflow-hidden shadow-md">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-[#0f1626]/80">
            {["Producto", "SKU", "Categoría", "Stock", "Precio", "Estado", "Acciones"].map((h) => (
              <th
                key={h}
                className="p-4 text-left text-[11px] text-slate-400 font-bold uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-12 text-center text-slate-400 text-sm font-semibold">
                No se encontraron productos
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr
                key={p.id}
                className="border-b border-slate-850 hover:bg-white/[0.02] transition-colors"
              >
                <td className="p-4">
                  <div className="text-sm text-slate-200 font-bold">{p.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{p.sold} vendidos</div>
                </td>
                <td className="p-4 text-xs text-slate-400 font-mono">{p.sku}</td>
                <td className="p-4">
                  <span className="text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700/40">
                    {p.category}
                  </span>
                </td>
                <td
                  className={`p-4 text-sm ${
                    p.stock === 0 ? "text-red-400 font-bold" : p.stock <= 4 ? "text-amber-400 font-bold" : "text-slate-300 font-medium"
                  }`}
                >
                  {p.stock} u.
                </td>
                <td className="p-4 text-sm text-slate-200 font-semibold">{fmt(p.price)}</td>
                <td className="p-4">
                  <StatusBadge status={p.status} />
                </td>
                <td className="p-4">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onEdit(p)}
                      className="bg-white/5 text-slate-350 w-7 h-7 rounded-md text-xs hover:bg-white/10 hover:text-white transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      className="bg-white/5 text-slate-350 w-7 h-7 rounded-md text-xs hover:bg-white/10 hover:text-red-400 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}