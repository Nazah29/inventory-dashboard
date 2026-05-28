import { useState } from "react";

// ─── Componentes Modulares Importados ──────────────────────────────────────────
import Sidebar from "./components/Sidebar";
import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";
import StatCard from "./components/StatCard";

// ─── Mock Data ────────────────────────────────────────────────────────────────
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

const CATEGORIES = ["Todas", "Electrónica", "Periféricos", "Componentes", "Computadoras", "Almacenamiento", "Audio", "Mobiliario", "Accesorios"];

const INITIAL_ACTIVITY = [
  { type: "add", text: 'Stock actualizado: "SSD Samsung 970 EVO"', time: "hace 2 min", qty: "+50 unidades" },
  { type: "sell", text: 'Venta registrada: "Mouse Logitech MX Master 3"', time: "hace 14 min", qty: "-3 unidades" },
  { type: "alert", text: '"Teclado Mecánico Keychron K2" bajo en stock', time: "hace 1 hora", qty: "3 restantes" },
  { type: "add", text: 'Nuevo producto agregado: "Hub USB-C Anker"', time: "hace 3 horas", qty: "+31 unidades" },
  { type: "sell", text: 'Venta registrada: "Auriculares Sony WH-1000XM5"', time: "hace 5 horas", qty: "-2 unidades" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function InventoryDashboard() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITY);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sortBy, setSortBy] = useState("name");
  const [modal, setModal] = useState(null); // null | "new" | product
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [view, setView] = useState("pos"); // Vista por defecto
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  // POS State
  const [posSearch, setPosSearch] = useState("");
  const [posCategory, setPosCategory] = useState("Todas");
  const [cart, setCart] = useState([]);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Stats calculations
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = products.filter(p => p.status === "low").length;
  const outStock = products.filter(p => p.status === "out").length;
  const totalSold = products.reduce((s, p) => s + (p.sold || 0), 0);

  // Filtered & sorted for Inventory
  const filtered = products
    .filter(p => (category === "Todas" || p.category === category) && (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => sortBy === "price" ? b.price - a.price : sortBy === "stock" ? b.stock - a.stock : a.name.localeCompare(b.name));

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Filtered for POS Selector
  const posFiltered = products.filter(p => 
    (posCategory === "Todas" || p.category === posCategory) && 
    (p.name.toLowerCase().includes(posSearch.toLowerCase()) || p.sku.toLowerCase().includes(posSearch.toLowerCase()))
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

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

  // Cart operations
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

  // Category chart distribution calculations
  const catCounts = CATEGORIES.filter(c => c !== "Todas").map(c => ({
    name: c, count: products.filter(p => p.category === c).length
  })).filter(c => c.count > 0);
  const maxCount = Math.max(...catCounts.map(c => c.count), 1);

  return (
    <>
      <style>{`
        ::-webkit-scrollbar { width: 6px; } 
        ::-webkit-scrollbar-track { background: transparent; } 
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        input::placeholder { color: #475569; }
        select option { background: #0f172a; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .row-hover:hover { background: rgba(99,102,241,0.06) !important; }
        .btn-icon:hover { background: rgba(255,255,255,0.12) !important; }
        .sidebar-item:hover { background: rgba(255,255,255,0.06) !important; color: #f1f5f9 !important; }
        .page-btn:hover { background: rgba(99,102,241,0.2) !important; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", background: "#060b14", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>

        {/* ── Sidebar Modular ── */}
        <Sidebar 
          currentView={view} 
          onViewChange={setView} 
          lowStockCount={lowStock} 
          outStockCount={outStock} 
        />

        {/* ── Main Area ── */}
        <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, animation: "fadeIn 0.4s ease" }}>
            <div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em" }}>
                {view === "pos" ? "Punto de Venta (POS)" : view === "table" ? "Inventario" : view === "reports" ? "Reportes" : "Dashboard"}
              </h1>
              <p style={{ color: "#475569", fontSize: 14, marginTop: 4 }}>
                {view === "pos" ? "Registra ventas rápidas y deduce stock al instante" : `${products.length} productos registrados · Actualizado ahora`}
              </p>
            </div>
            <button onClick={() => setModal("new")}
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", color: "#fff", padding: "12px 22px", borderRadius: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 20px rgba(99,102,241,0.4)", transition: "transform 0.15s, box-shadow 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(99,102,241,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.4)"; }}>
              ＋ Nuevo producto
            </button>
          </div>

          {/* Stats Modulares (Ocultos en POS para maximizar espacio) */}
          {view !== "pos" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32, animation: "fadeIn 0.5s ease 0.05s both" }}>
              <StatCard icon="📦" label="Total productos" value={products.length} sub={`${filtered.length} filtrados`} accentColor="indigo" />
              <StatCard icon="💰" label="Valor inventario" value={fmt(totalValue)} sub="Precio × stock" accentColor="emerald" />
              <StatCard icon="⚠️" label="Sin stock / bajo" value={`${outStock + lowStock}`} sub={`${outStock} agotados · ${lowStock} bajos`} accentColor="amber" />
              <StatCard icon="🛒" label="Unidades vendidas" value={totalSold.toLocaleString()} sub="Total histórico" accentColor="purple" />
            </div>
          )}

          {view === "pos" ? (
            /* ── VISTA POS ── */
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24, animation: "fadeIn 0.4s ease" }}>
              {/* Selector de productos */}
              <div>
                <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 16 }}>🔍</span>
                    <input value={posSearch} onChange={e => setPosSearch(e.target.value)} placeholder="Buscar producto por nombre o SKU..."
                      style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px 10px 42px", color: "#f1f5f9", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
                  </div>
                  <select value={posCategory} onChange={e => setPosCategory(e.target.value)}
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px", color: "#f1f5f9", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", cursor: "pointer" }}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16, maxHeight: "calc(100vh - 250px)", overflowY: "auto", paddingRight: 8 }}>
                  {posFiltered.length === 0 ? (
                    <div style={{ gridColumn: "1 / -1", padding: 48, textAlign: "center", color: "#475569" }}>No se encontraron productos coincidentes</div>
                  ) : posFiltered.map(p => {
                    const cartItem = cart.find(item => item.id === p.id);
                    const inCartQty = cartItem ? cartItem.qty : 0;
                    const availableStock = p.stock - inCartQty;

                    return (
                      <div key={p.id} style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: 16,
                        padding: 18,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        transition: "all 0.15s",
                      }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                            <span style={{ fontSize: 11, color: "#818cf8", background: "rgba(99,102,241,0.12)", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>{p.category}</span>
                            <span style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>{p.sku}</span>
                          </div>
                          <h4 style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 600, marginBottom: 6, lineHeight: 1.3 }}>{p.name}</h4>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                            <span style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>{fmt(p.price)}</span>
                            <span style={{ fontSize: 12, color: availableStock === 0 ? "#ef4444" : availableStock <= 4 ? "#f59e0b" : "#94a3b8", fontWeight: 600 }}>
                              {availableStock === 0 ? "Agotado" : `${availableStock} u. disp`}
                            </span>
                          </div>
                        </div>
                        <button
                          disabled={availableStock <= 0}
                          onClick={() => addToCart(p)}
                          style={{
                            width: "100%",
                            background: availableStock <= 0 ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            border: "none",
                            color: availableStock <= 0 ? "#475569" : "#fff",
                            padding: "8px 12px",
                            borderRadius: 10,
                            cursor: availableStock <= 0 ? "not-allowed" : "pointer",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13,
                            fontWeight: 700,
                            transition: "all 0.15s",
                          }}
                        >
                          {availableStock <= 0 ? "Sin Stock" : "＋ Agregar"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lateral del Carrito */}
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 24, display: "flex", flexDirection: "column", height: "calc(100vh - 200px)", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, color: "#e2e8f0" }}>🛒 Carrito de Venta</h3>
                  {cart.length > 0 && (
                    <button onClick={() => setCart([])} style={{ background: "none", border: "none", color: "#ef4444", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Vaciar</button>
                  )}
                </div>

                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 16, paddingRight: 4 }}>
                  {cart.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#475569" }}>
                      <span style={{ fontSize: 44, marginBottom: 12 }}>🛒</span>
                      <p style={{ fontSize: 13 }}>El carrito está vacío</p>
                    </div>
                  ) : cart.map(item => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: 12 }}>
                      <div style={{ flex: 1, marginRight: 12 }}>
                        <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{fmt(item.price)}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button onClick={() => updateCartQty(item.id, -1)}
                          style={{ width: 22, height: 22, borderRadius: 6, border: "none", background: "rgba(255,255,255,0.06)", color: "#94a3b8", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
                        <span style={{ fontSize: 13, color: "#f1f5f9", fontWeight: 600, width: 20, textAlign: "center" }}>{item.qty}</span>
                        <button disabled={item.qty >= item.maxStock} onClick={() => updateCartQty(item.id, 1)}
                          style={{ width: 22, height: 22, borderRadius: 6, border: "none", background: "rgba(255,255,255,0.06)", color: item.qty >= item.maxStock ? "#475569" : "#94a3b8", cursor: item.qty >= item.maxStock ? "not-allowed" : "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                        <button onClick={() => removeFromCart(item.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, marginLeft: 6 }}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "#94a3b8" }}>Subtotal</span>
                    <span style={{ fontSize: 13, color: "#cbd5e1" }}>{fmt(cartTotal)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <span style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 600 }}>Monto Total</span>
                    <span style={{ fontSize: 20, color: "#10b981", fontWeight: 800 }}>{fmt(cartTotal)}</span>
                  </div>
                  <button
                    disabled={cart.length === 0}
                    onClick={checkoutSales}
                    style={{
                      width: "100%",
                      background: cart.length === 0 ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, #10b981, #059669)",
                      border: "none",
                      color: cart.length === 0 ? "#475569" : "#fff",
                      padding: "12px 24px",
                      borderRadius: 12,
                      cursor: cart.length === 0 ? "not-allowed" : "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      boxShadow: cart.length === 0 ? "none" : "0 4px 20px rgba(16,185,129,0.3)",
                      transition: "all 0.15s",
                    }}
                  >
                    🚀 Completar y Registrar Venta
                  </button>
                </div>
              </div>
            </div>
          ) : view === "overview" ? (
            /* ── VISTA RESUMEN ── */
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, animation: "fadeIn 0.4s ease" }}>
              {/* Distribución por Categoría */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#e2e8f0", marginBottom: 20 }}>Productos por categoría</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {catCounts.map((c, i) => (
                    <div key={c.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 13, color: "#94a3b8" }}>{c.name}</span>
                        <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{c.count}</span>
                      </div>
                      <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 3, background: `hsl(${220 + i * 20}, 80%, 65%)`, width: `${(c.count / maxCount) * 100}%`, transition: "width 0.8s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registro de Actividad */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#e2e8f0", marginBottom: 20 }}>Actividad reciente</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {activities.slice(0, 5).map((a, i) => {
                    const colors = { add: "#10b981", sell: "#6366f1", alert: "#f59e0b" };
                    return (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[a.type] || "#cbd5e1", marginTop: 5, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, color: "#cbd5e1" }}>{a.text}</div>
                          <div style={{ display: "flex", gap: 10, marginTop: 3 }}>
                            <span style={{ fontSize: 11, color: "#475569" }}>{a.time}</span>
                            <span style={{ fontSize: 11, color: colors[a.type] || "#cbd5e1" }}>{a.qty}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top ventas */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24, gridColumn: "1 / -1" }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#e2e8f0", marginBottom: 20 }}>Top productos por ventas</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                  {[...products].sort((a, b) => b.sold - a.sold).slice(0, 4).map((p, i) => (
                    <div key={p.id} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 16 }}>
                      <div style={{ fontSize: 24, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#6366f1", marginBottom: 8 }}>#{i + 1}</div>
                      <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{p.sold} vendidos · {fmt(p.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : view === "reports" ? (
            /* ── VISTA REPORTES ── */
            <div style={{ display: "flex", flexDirection: "column", gap: 24, animation: "fadeIn 0.4s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
                {/* Resumen Financiero */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#e2e8f0", marginBottom: 16 }}>Finanzas & Valoración</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 12 }}>
                      <span style={{ color: "#94a3b8", fontSize: 14 }}>Valor Total Activos</span>
                      <span style={{ color: "#10b981", fontWeight: 700, fontSize: 18 }}>{fmt(totalValue)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 12 }}>
                      <span style={{ color: "#94a3b8", fontSize: 14 }}>Ventas Totales Registradas</span>
                      <span style={{ color: "#6366f1", fontWeight: 700, fontSize: 18 }}>{totalSold} unidades</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3b8", fontSize: 14 }}>Precio Promedio Producto</span>
                      <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 16 }}>{fmt(products.reduce((acc, curr) => acc + curr.price, 0) / products.length)}</span>
                    </div>
                  </div>
                </div>

                {/* Alertas stock */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#e2e8f0", marginBottom: 16 }}>Estado de Inventario</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#94a3b8", fontSize: 13 }}>Saludable (En Stock)</span>
                      <span style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", fontSize: 12, padding: "3px 8px", borderRadius: 12, fontWeight: 700 }}>
                        {products.filter(p => p.status === "ok").length} prod.
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#94a3b8", fontSize: 13 }}>Crítico (Bajo Stock)</span>
                      <span style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b", fontSize: 12, padding: "3px 8px", borderRadius: 12, fontWeight: 700 }}>
                        {lowStock} prod.
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#94a3b8", fontSize: 13 }}>Inactivo (Agotado)</span>
                      <span style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444", fontSize: 12, padding: "3px 8px", borderRadius: 12, fontWeight: 700 }}>
                        {outStock} prod.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Performers */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#e2e8f0", marginBottom: 20 }}>Rendimiento de Productos (Ordenado por más vendidos)</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", textAlign: "left" }}>
                        <th style={{ padding: "10px 12px", color: "#475569", fontSize: 11, textTransform: "uppercase" }}>Producto</th>
                        <th style={{ padding: "10px 12px", color: "#475569", fontSize: 11, textTransform: "uppercase" }}>Precio</th>
                        <th style={{ padding: "10px 12px", color: "#475569", fontSize: 11, textTransform: "uppercase" }}>Vendidos</th>
                        <th style={{ padding: "10px 12px", color: "#475569", fontSize: 11, textTransform: "uppercase" }}>Ingresos Estimados</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...products].sort((a,b) => b.sold - a.sold).slice(0, 5).map(p => (
                        <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                          <td style={{ padding: "12px", color: "#e2e8f0", fontSize: 13 }}>{p.name}</td>
                          <td style={{ padding: "12px", color: "#cbd5e1", fontSize: 13 }}>{fmt(p.price)}</td>
                          <td style={{ padding: "12px", color: "#818cf8", fontSize: 13, fontWeight: 700 }}>{p.sold} u.</td>
                          <td style={{ padding: "12px", color: "#10b981", fontSize: 13, fontWeight: 700 }}>{fmt(p.price * p.sold)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* ── VISTA TABLA DE INVENTARIO ── */
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              {/* Filtros */}
              <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 16 }}>🔍</span>
                  <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar por nombre o SKU..."
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px 10px 42px", color: "#f1f5f9", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
                </div>
                <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px", color: "#f1f5f9", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", cursor: "pointer" }}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px", color: "#f1f5f9", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", cursor: "pointer" }}>
                  <option value="name">Ordenar: Nombre</option>
                  <option value="price">Ordenar: Precio</option>
                  <option value="stock">Ordenar: Stock</option>
                </select>
              </div>

              {/* Tabla Modularizada */}
              <ProductTable 
                products={paginated} 
                onEdit={setModal} 
                onDelete={setDeleteConfirm} 
              />

              {/* Paginación */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", marginTop: 12 }}>
                  <span style={{ fontSize: 13, color: "#475569" }}>Mostrando {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} de {filtered.length}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                      <button key={n} className="page-btn" onClick={() => setPage(n)}
                        style={{ width: 30, height: 30, borderRadius: 7, border: "none", cursor: "pointer", background: n === page ? "#6366f1" : "rgba(255,255,255,0.05)", color: n === page ? "#fff" : "#64748b", fontSize: 13, fontWeight: n === page ? 700 : 400, transition: "background 0.15s" }}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── Modals Modulares ── */}
      {(modal === "new" || (modal && modal.id)) && (
        <ProductModal 
          product={modal === "new" ? null : modal} 
          onClose={() => setModal(null)} 
          onSave={handleSave} 
        />
      )}

      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 32, width: 380, textAlign: "center", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🗑️</div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", color: "#f1f5f9", marginBottom: 10 }}>¿Eliminar producto?</h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>"{deleteConfirm.name}" será removido permanentemente del inventario.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancelar</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} style={{ background: "#ef4444", border: "none", color: "#fff", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 28, right: 28, background: toast.type === "warn" ? "#ef4444" : "#10b981", color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", animation: "toastIn 0.3s ease", zIndex: 200 }}>
          {toast.msg}
        </div>
      )}
    </>
  );
}
