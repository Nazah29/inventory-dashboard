import { useState } from "react";

// ─── Componentes Modulares Importados ──────────────────────────────────────────
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import ProductModal from "./components/ProductModal";
import POSView from "./components/POSView";
import DashboardOverview from "./components/DashboardOverview";
import ReportsView from "./components/ReportsView";
import InventoryView from "./components/InventoryView";

// ─── Mock Data Inicial ────────────────────────────────────────────────────────
const INITIAL_PRODUCTS = [
  { id: 1, name: "Monitor LG UltraWide 34\"", category: "Electrónica", stock: 12, price: 1890, status: "ok", sku: "MON-LG-001", sold: 45 },
  { id: 2, name: "Teclado Mecánico Keychron K2", category: "Periféricos", stock: 3, price: 420, status: "low", sku: "TEC-KCH-002", sold: 134 },
  { id: 3, name: "Silla Gamer DXRacer Formula", category: "Mobiliario", stock: 0, price: 2100, status: "out", sku: "SIL-DXR-003", sold: 28 },
  { id: 4, name: "Laptop ASUS ROG Strix G15", category: "Computadoras", stock: 7, price: 5800, status: "ok", sku: "LAP-ASU-004", sold: 19 },
  { id: 5, name: "Auriculares Sony WH-1000XM5", category: "Audio", stock: 2, price: 1250, status: "low", sku: "AUR-SON-005", sold: 87 },
  { id: 6, name: "Mouse Logitech MX Master 3", category: "Periféricos", stock: 24, price: 380, status: "ok", sku: "MOU-LOG-006", sold: 203 },
  { id: 7, name: "Webcam Logitech C920 HD", category: "Periféricos", stock: 0, price: 290, status: "out", sku: "WEB-LOG-007", sold: 61 },
  { id: 8, name: "SSD Samsung 970 EVO 1TB", category: "Almacenamiento", stock: 18, price: 340, status: "ok", sku: "SSD-SAM-008", sold: 312 },
  { id: 9, name: "RAM Corsair Vengeance 32GB", category: "Componentes", stock: 5, price: 280, status: "low", sku: "RAM-COR-009", sold: 74 },
  { id: 10, name: "Tarjeta RTX 4070 Ti SUPER", category: "Componentes", stock: 4, price: 3200, status: "low", sku: "GPU-NVI-010", sold: 33 },
  { id: 11, name: "Hub USB-C Anker 10 en 1", category: "Accesorios", stock: 31, price: 180, status: "ok", sku: "HUB-ANK-011", sold: 156 },
  { id: 12, name: "Monitor Dell U2723D 27\"", category: "Electrónica", stock: 9, price: 2400, status: "ok", sku: "MON-DEL-012", sold: 22 },
];

const INITIAL_ACTIVITY = [
  { type: "add", text: 'Stock actualizado: "SSD Samsung 970 EVO"', time: "hace 2 min", qty: "+50 unidades" },
  { type: "sell", text: 'Venta registrada: "Mouse Logitech MX Master 3"', time: "hace 14 min", qty: "-3 unidades" },
  { type: "alert", text: '"Teclado Mecánico Keychron K2" bajo en stock', time: "hace 1 hora", qty: "3 restantes" },
  { type: "add", text: 'Nuevo producto agregado: "Hub USB-C Anker"', time: "hace 3 horas", qty: "+31 unidades" },
  { type: "sell", text: 'Venta registrada: "Auriculares Sony WH-1000XM5"', time: "hace 5 horas", qty: "-2 unidades" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITY);
  const [view, setView] = useState("pos"); // Vista inicial
  const [modal, setModal] = useState(null); // null | "new" | product
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [cart, setCart] = useState([]);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Resumen de Estadísticas
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = products.filter(p => p.status === "low").length;
  const outStock = products.filter(p => p.status === "out").length;
  const totalSold = products.reduce((s, p) => s + (p.sold || 0), 0);

  const handleSave = (productData) => {
    const stock = Number(productData.stock);
    const price = Number(productData.price);
    const status = stock === 0 ? "out" : stock <= 4 ? "low" : "ok";

    setProducts(prevProducts => {
      const exists = prevProducts.find(p => p.id === productData.id);
      if (exists) {
        showToast("Producto actualizado correctamente");
        return prevProducts.map(p => p.id === productData.id 
          ? { ...p, ...productData, stock, price, status } 
          : p
        );
      } else {
        const newProduct = {
          ...productData,
          id: productData.id || Date.now(),
          stock,
          price,
          status,
          sold: 0,
        };
        const newAct = {
          type: "add",
          text: `Nuevo producto creado: "${newProduct.name}"`,
          time: "ahora mismo",
          qty: `+${newProduct.stock} unidades`
        };
        setActivities(prev => [newAct, ...prev]);
        showToast("Producto creado correctamente");
        return [...prevProducts, newProduct];
      }
    });
    setModal(null);
  };

  const handleDelete = (id) => {
    const deletedProduct = products.find(p => p.id === id);
    setProducts(ps => ps.filter(p => p.id !== id));
    setDeleteConfirm(null);
    if (deletedProduct) {
      const newAct = {
        type: "alert",
        text: `Producto removido del inventario: "${deletedProduct.name}"`,
        time: "ahora mismo",
        qty: "Eliminado"
      };
      setActivities(prev => [newAct, ...prev]);
    }
    showToast("Producto eliminado", "warn");
  };

  // Operaciones del Carrito POS
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.qty < product.stock) {
          return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
        }
        showToast("No puedes agregar más de la cantidad en stock", "warn");
        return prev;
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1, maxStock: product.stock }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        if (newQty > 0 && newQty <= item.maxStock) {
          return { ...item, qty: newQty };
        }
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const checkoutSales = () => {
    if (cart.length === 0) return;

    setProducts(prevProducts => 
      prevProducts.map(p => {
        const cartItem = cart.find(item => item.id === p.id);
        if (cartItem) {
          const newStock = Math.max(0, p.stock - cartItem.qty);
          const newSold = (p.sold || 0) + cartItem.qty;
          const newStatus = newStock === 0 ? "out" : newStock <= 4 ? "low" : "ok";
          return { ...p, stock: newStock, sold: newSold, status: newStatus };
        }
        return p;
      })
    );

    cart.forEach(item => {
      const newAct = {
        type: "sell",
        text: `Venta registrada: "${item.name}" x${item.qty}`,
        time: "ahora mismo",
        qty: `-${item.qty} u. (${fmt(item.price * item.qty)})`
      };
      setActivities(prev => [newAct, ...prev]);
    });

    setCart([]);
    showToast("¡Venta registrada con éxito y stock actualizado!", "ok");
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.3s ease both; }
        @keyframes toastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      <div className="flex h-screen bg-[#0b0f19] text-slate-100 font-sans overflow-hidden">
        
        {/* ── Sidebar Modular ── */}
        <Sidebar 
          currentView={view} 
          onViewChange={setView} 
          lowStockCount={lowStock} 
          outStockCount={outStock} 
        />

        {/* ── Área Principal ── */}
        <main className="flex-1 overflow-y-auto px-9 py-8">
          
          {/* Cabecera superior común */}
          <div className="flex justify-between items-center mb-8 animate-fade-in">
            <div>
              <h1 className="font-sans text-3xl font-extrabold tracking-tight text-white">
                {view === "pos" ? "Punto de Venta (POS)" : view === "table" ? "Inventario" : view === "reports" ? "Reportes" : "Dashboard"}
              </h1>
              <p className="text-slate-400 text-sm mt-1 font-bold">
                {view === "pos" ? "Registra ventas rápidas y deduce stock al instante" : `${products.length} productos registrados · Actualizado ahora`}
              </p>
            </div>
            <button onClick={() => setModal("new")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95">
              ＋ Nuevo producto
            </button>
          </div>

          {/* Tarjetas de estadísticas (Ocultas en la pantalla de POS) */}
          {view !== "pos" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
              <StatCard icon="📦" label="Total productos" value={products.length} sub={`${products.length} registrados`} accentColor="indigo" />
              <StatCard icon="💰" label="Valor inventario" value={fmt(totalValue)} sub="Precio × stock" accentColor="emerald" />
              <StatCard icon="⚠️" label="Sin stock / bajo" value={`${outStock + lowStock}`} sub={`${outStock} agotados · ${lowStock} bajos`} accentColor="amber" />
              <StatCard icon="🛒" label="Unidades vendidas" value={totalSold.toLocaleString()} sub="Total histórico" accentColor="purple" />
            </div>
          )}

          {/* ── Renderizado Condicional de Vistas Modulares ── */}
          {view === "pos" && (
            <POSView 
              products={products}
              cart={cart}
              addToCart={addToCart}
              updateCartQty={updateCartQty}
              removeFromCart={removeFromCart}
              clearCart={() => setCart([])}
              checkoutSales={checkoutSales}
              fmt={fmt}
            />
          )}

          {view === "overview" && (
            <DashboardOverview 
              products={products}
              activities={activities}
              fmt={fmt}
            />
          )}

          {view === "reports" && (
            <ReportsView 
              products={products}
              totalValue={totalValue}
              totalSold={totalSold}
              lowStock={lowStock}
              outStock={outStock}
              fmt={fmt}
            />
          )}

          {view === "table" && (
            <InventoryView 
              products={products}
              onEdit={setModal}
              onDelete={setDeleteConfirm}
            />
          )}
        </main>
      </div>

      {/* ── Modales Modulares ── */}
      {(modal === "new" || (modal && modal.id)) && (
        <ProductModal 
          product={modal === "new" ? null : modal} 
          onClose={() => setModal(null)} 
          onSave={handleSave} 
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center z-50 backdrop-blur-md">
          <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl">
            <div className="text-4xl mb-4">🗑️</div>
            <h3 className="font-sans text-lg text-white mb-2 font-extrabold">¿Eliminar producto?</h3>
            <p className="text-slate-400 font-semibold text-sm mb-6">"{deleteConfirm.name}" será removido permanentemente del inventario.</p>
            <div className="flex gap-2.5 justify-center">
              <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-350 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/30 transition-colors">Cancelar</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-red-650 hover:bg-red-700 transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* Notificaciones Toast */}
      {toast && (
        <div style={{ animation: "toastIn 0.3s ease" }} className={`fixed bottom-7 right-7 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-xl z-50 ${toast.type === 'warn' ? 'bg-red-600 shadow-md' : 'bg-emerald-600 shadow-md'}`}>
          {toast.msg}
        </div>
      )}
    </>
  );
}
