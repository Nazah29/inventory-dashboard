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
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 text-sm outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <select
            value={posCategory}
            onChange={(e) => setPosCategory(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 text-sm outline-none cursor-pointer focus:border-indigo-500 transition-colors"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-slate-950">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
          {posFiltered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">
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
                  className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-500/20 transition-all"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md font-semibold font-dmsans">
                        {p.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{p.sku}</span>
                    </div>
                    <h4 className="text-sm text-slate-200 font-semibold mb-1 line-clamp-2 leading-relaxed">
                      {p.name}
                    </h4>
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="text-base font-bold text-slate-100">{fmt(p.price)}</span>
                      <span
                        className={`text-xs font-semibold ${
                          availableStock === 0
                            ? "text-red-400"
                            : availableStock <= 4
                            ? "text-amber-400"
                            : "text-slate-400"
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
                        ? "bg-white/5 text-slate-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
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
      <div className="bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5 flex flex-col h-[calc(100vh-200px)] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-syne text-base font-bold text-slate-200">🛒 Carrito de Venta</h3>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="bg-transparent border-none text-red-400 hover:text-red-300 text-xs font-semibold cursor-pointer font-dmsans"
            >
              Vaciar
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 mb-4 pr-1">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
              <span className="text-3xl">🛒</span>
              <p className="text-xs">El carrito está vacío</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] rounded-xl p-3"
              >
                <div className="flex-1 min-w-0 mr-3">
                  <div className="text-xs text-slate-200 font-semibold truncate max-w-[150px]">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{fmt(item.price)}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateCartQty(item.id, -1)}
                    className="w-5 h-5 rounded bg-white/5 text-slate-400 hover:bg-white/10 flex items-center justify-center text-xs"
                  >
                    -
                  </button>
                  <span className="text-xs text-slate-200 font-semibold w-5 text-center">
                    {item.qty}
                  </span>
                  <button
                    disabled={item.qty >= item.maxStock}
                    onClick={() => updateCartQty(item.id, 1)}
                    className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                      item.qty >= item.maxStock
                        ? "bg-white/5 text-slate-600 cursor-not-allowed"
                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-transparent text-slate-500 hover:text-red-400 transition-colors ml-1.5 text-xs"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-white/[0.08] pt-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-xs text-slate-400 font-dmsans">Subtotal</span>
            <span className="text-xs text-slate-300 font-semibold">{fmt(cartTotal)}</span>
          </div>
          <div className="flex justify-between mb-5">
            <span className="text-sm text-slate-200 font-semibold">Monto Total</span>
            <span className="text-lg text-emerald-400 font-extrabold">{fmt(cartTotal)}</span>
          </div>
          <button
            disabled={cart.length === 0}
            onClick={checkoutSales}
            className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all shadow-lg ${
              cart.length === 0
                ? "bg-white/5 text-slate-500 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-500/10"
            }`}
          >
            🚀 Completar y Registrar Venta
          </button>
        </div>
      </div>
    </div>
  );
}
