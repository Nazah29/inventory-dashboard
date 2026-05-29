// components/POSView.tsx
import React, { useState } from "react";
import { type Product } from "./ProductTable";

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  qty: number;
  maxStock: number;
}

interface POSViewProps {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateCartQty: (id: string | number, delta: number) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
  checkoutSales: () => void;
  fmt: (n: number) => string;
}

const CATEGORIES = ["Todas", "Electrónica", "Periféricos", "Componentes", "Computadoras", "Almacenamiento", "Audio", "Mobiliario", "Accesorios"];

export default function POSView({
  products,
  cart,
  addToCart,
  updateCartQty,
  removeFromCart,
  clearCart,
  checkoutSales,
  fmt,
}: POSViewProps) {
  const [posSearch, setPosSearch] = useState("");
  const [posCategory, setPosCategory] = useState("Todas");

  // Filtrar productos
  const posFiltered = products.filter((p) =>
    (posCategory === "Todas" || p.category === posCategory) &&
    (p.name.toLowerCase().includes(posSearch.toLowerCase()) || p.sku.toLowerCase().includes(posSearch.toLowerCase()))
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 animate-fade-in">
      {/* Selector de productos */}
      <div>
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
            <input
              value={posSearch}
              onChange={(e) => setPosSearch(e.target.value)}
              placeholder="Buscar producto por nombre o SKU..."
              className="w-full bg-[#131b2e] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 text-sm outline-none focus:border-blue-550 focus:ring-1 focus:ring-blue-550 transition-colors shadow-sm"
            />
          </div>
          <select
            value={posCategory}
            onChange={(e) => setPosCategory(e.target.value)}
            className="bg-[#131b2e] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm outline-none cursor-pointer focus:border-blue-550 transition-colors shadow-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#131b2e]">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
          {posFiltered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 font-semibold">
              No se encontraron productos coincidentes
            </div>
          ) : (
            posFiltered.map((p) => {
              const cartItem = cart.find((item) => item.id === p.id);
              const inCartQty = cartItem ? cartItem.qty : 0;
              const availableStock = p.stock - inCartQty;

              return (
                <div
                  key={p.id}
                  className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md font-bold font-sans border border-slate-700/40">
                        {p.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono font-semibold">{p.sku}</span>
                    </div>
                    <h4 className="text-sm text-slate-200 font-bold mb-1.5 line-clamp-2 leading-relaxed">
                      {p.name}
                    </h4>
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="text-base font-extrabold text-slate-105">{fmt(p.price)}</span>
                      <span
                        className={`text-xs font-bold ${
                          availableStock === 0
                            ? "text-red-400 font-bold"
                            : availableStock <= 4
                            ? "text-amber-400 font-bold"
                            : "text-slate-400 font-semibold"
                        }`}
                      >
                        {availableStock === 0 ? "Agotado" : `${availableStock} disp`}
                      </span>
                    </div>
                  </div>
                  <button
                    disabled={availableStock <= 0}
                    onClick={() => addToCart(p)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      availableStock <= 0
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    }`}
                  >
                    {availableStock <= 0 ? "Sin Stock" : "＋ Agregar"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Lateral del Carrito */}
      <div className="bg-[#0f1626] border border-slate-800/80 rounded-2xl p-5 flex flex-col h-[calc(100vh-200px)] overflow-hidden shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-sans text-base font-bold text-slate-200">🛒 Carrito de Venta</h3>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="bg-transparent border-none text-red-400 hover:text-red-500 text-xs font-bold cursor-pointer font-sans"
            >
              Vaciar
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 mb-4 pr-1">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
              <span className="text-3xl opacity-60">🛒</span>
              <p className="text-xs font-semibold">El carrito está vacío</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-[#131b2e] border border-slate-800/50 rounded-xl p-3"
              >
                <div className="flex-1 min-w-0 mr-3">
                  <div className="text-xs text-slate-200 font-bold truncate max-w-[150px]">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-bold">{fmt(item.price)}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateCartQty(item.id, -1)}
                    className="w-5 h-5 rounded border border-slate-700 bg-slate-850 text-slate-300 hover:bg-slate-800 flex items-center justify-center text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="text-xs text-slate-100 font-bold w-5 text-center">
                    {item.qty}
                  </span>
                  <button
                    disabled={item.qty >= item.maxStock}
                    onClick={() => updateCartQty(item.id, 1)}
                    className={`w-5 h-5 rounded flex items-center justify-center text-xs border font-bold ${
                      item.qty >= item.maxStock
                        ? "bg-slate-900 border-slate-850 text-slate-650 cursor-not-allowed"
                        : "bg-slate-850 border-slate-700 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-transparent text-slate-450 hover:text-red-400 transition-colors ml-1.5 text-xs"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-slate-800/80 pt-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-xs text-slate-450 font-sans font-bold">Subtotal</span>
            <span className="text-xs text-slate-200 font-bold">{fmt(cartTotal)}</span>
          </div>
          <div className="flex justify-between mb-5">
            <span className="text-sm text-slate-200 font-bold">Monto Total</span>
            <span className="text-lg text-emerald-400 font-extrabold">{fmt(cartTotal)}</span>
          </div>
          <button
            disabled={cart.length === 0}
            onClick={checkoutSales}
            className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all ${
              cart.length === 0
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            }`}
          >
            🚀 Completar y Registrar Venta
          </button>
        </div>
      </div>
    </div>
  );
}
