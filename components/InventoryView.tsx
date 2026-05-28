// components/InventoryView.tsx
import React, { useState } from "react";
import ProductTable, { type Product } from "./ProductTable";

interface InventoryViewProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const CATEGORIES = ["Todas", "Electrónica", "Periféricos", "Componentes", "Computadoras", "Almacenamiento", "Audio", "Mobiliario", "Accesorios"];
const PER_PAGE = 8;

export default function InventoryView({ products, onEdit, onDelete }: InventoryViewProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);

  // Filtrado y ordenamiento de productos
  const filtered = products
    .filter(
      (p) =>
        (category === "Todas" || p.category === category) &&
        (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) =>
      sortBy === "price"
        ? b.price - a.price
        : sortBy === "stock"
        ? b.stock - a.stock
        : a.name.localeCompare(b.name)
    );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="animate-fade-in">
      {/* Filtros */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nombre o SKU..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 text-sm outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 text-sm outline-none cursor-pointer focus:border-indigo-500 transition-colors"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-slate-950">
              {c}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 text-sm outline-none cursor-pointer focus:border-indigo-500 transition-colors"
        >
          <option value="name" className="bg-slate-950">Ordenar: Nombre</option>
          <option value="price" className="bg-slate-950">Ordenar: Precio</option>
          <option value="stock" className="bg-slate-950">Ordenar: Stock</option>
        </select>
      </div>

      {/* Tabla modular */}
      <ProductTable products={paginated} onEdit={onEdit} onDelete={onDelete} />

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-4 py-3.5 mt-3">
          <span className="text-xs text-slate-500 font-dmsans">
            Mostrando {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} de {filtered.length}
          </span>
          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-7 h-7 rounded-lg border-none cursor-pointer text-xs font-bold transition-colors ${
                  n === page
                    ? "bg-indigo-500 text-white font-bold"
                    : "bg-white/5 text-slate-400 hover:bg-indigo-500/20"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
