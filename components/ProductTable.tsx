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
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/[0.07]">
            {["Producto", "SKU", "Categoría", "Stock", "Precio", "Estado", "Acciones"].map((h) => (
              <th
                key={h}
                className="p-4 text-left text-[11px] text-slate-500 font-semibold uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-12 text-center text-slate-500 text-sm">
                No se encontraron productos
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr
                key={p.id}
                className="border-b border-white/[0.04] hover:bg-indigo-500/[0.04] transition-colors"
              >
                <td className="p-4">
                  <div className="text-sm text-slate-200 font-semibold">{p.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{p.sold} vendidos</div>
                </td>
                <td className="p-4 text-xs text-slate-400 font-mono">{p.sku}</td>
                <td className="p-4">
                  <span className="text-xs text-slate-300 bg-white/5 px-2 py-0.5 rounded-md">
                    {p.category}
                  </span>
                </td>
                <td
                  className={`p-4 text-sm font-semibold ${
                    p.stock === 0 ? "text-red-400" : p.stock <= 4 ? "text-amber-400" : "text-slate-200"
                  }`}
                >
                  {p.stock} u.
                </td>
                <td className="p-4 text-sm text-slate-200">{fmt(p.price)}</td>
                <td className="p-4">
                  <StatusBadge status={p.status} />
                </td>
                <td className="p-4">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onEdit(p)}
                      className="bg-white/5 text-slate-400 w-7 h-7 rounded-md text-xs hover:bg-white/10 transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      className="bg-white/5 text-slate-400 w-7 h-7 rounded-md text-xs hover:bg-white/10 transition-colors"
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