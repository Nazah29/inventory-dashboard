import { useState, useEffect, useRef } from "react";

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

const ACTIVITY = [
  { type: "add", text: 'Stock actualizado: "SSD Samsung 970 EVO"', time: "hace 2 min", qty: "+50 unidades" },
  { type: "sell", text: 'Venta registrada: "Mouse Logitech MX Master 3"', time: "hace 14 min", qty: "-3 unidades" },
  { type: "alert", text: '"Teclado Mecánico Keychron K2" bajo en stock', time: "hace 1 hora", qty: "3 restantes" },
  { type: "add", text: 'Nuevo producto agregado: "Hub USB-C Anker"', time: "hace 3 horas", qty: "+31 unidades" },
  { type: "sell", text: 'Venta registrada: "Auriculares Sony WH-1000XM5"', time: "hace 5 horas", qty: "-2 unidades" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => `S/ ${n.toLocaleString("es-PE")}`;
const statusConfig = {
  ok:  { label: "En stock",    dot: "#10b981", bg: "rgba(16,185,129,0.12)", color: "#10b981" },
  low: { label: "Stock bajo",  dot: "#f59e0b", bg: "rgba(245,158,11,0.12)",  color: "#f59e0b" },
  out: { label: "Agotado",     dot: "#ef4444", bg: "rgba(239,68,68,0.12)",   color: "#ef4444" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: "24px 28px", position: "relative", overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s", cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${accent}30`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at top right, ${accent}22, transparent 70%)`, borderRadius: "0 16px 0 0" }} />
      <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 13, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: accent, marginTop: 8, fontFamily: "'DM Sans', sans-serif" }}>{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: cfg.bg, color: cfg.color, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

function Modal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product || { name: "", category: "Electrónica", stock: 0, price: 0, sku: "", status: "ok" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10, padding: "10px 14px", color: "#f1f5f9", fontSize: 14,
    fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box",
  };
  const labelStyle = { display: "block", fontSize: 12, color: "#94a3b8", marginBottom: 6, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 32, width: 480, maxWidth: "90vw", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontSize: 22, color: "#f1f5f9" }}>{product ? "Editar producto" : "Nuevo producto"}</h2>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#94a3b8", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 18 }}>×</button>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <div><label style={labelStyle}>Nombre</label><input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Nombre del producto" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Categoría</label>
              <select style={inputStyle} value={form.category} onChange={e => set("category", e.target.value)}>
                {CATEGORIES.filter(c => c !== "Todas").map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>SKU</label><input style={inputStyle} value={form.sku} onChange={e => set("sku", e.target.value)} placeholder="XXX-000" /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={labelStyle}>Stock</label><input type="number" style={inputStyle} value={form.stock} onChange={e => set("stock", parseInt(e.target.value) || 0)} /></div>
            <div><label style={labelStyle}>Precio (S/)</label><input type="number" style={inputStyle} value={form.price} onChange={e => set("price", parseFloat(e.target.value) || 0)} /></div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>Cancelar</button>
          <button onClick={() => onSave({ ...form, stock: Number(form.stock), price: Number(form.price), status: form.stock === 0 ? "out" : form.stock <= 4 ? "low" : "ok", sold: form.sold || 0, id: form.id || Date.now() })}
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", color: "#fff", padding: "10px 24px", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700 }}>
            {product ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function InventoryDashboard() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sortBy, setSortBy] = useState("name");
  const [modal, setModal] = useState(null); // null | "new" | product
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [view, setView] = useState("table"); // "table" | "overview"
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Stats
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = products.filter(p => p.status === "low").length;
  const outStock = products.filter(p => p.status === "out").length;
  const totalSold = products.reduce((s, p) => s + (p.sold || 0), 0);

  // Filtered & sorted
  const filtered = products
    .filter(p => (category === "Todas" || p.category === category) && (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => sortBy === "price" ? b.price - a.price : sortBy === "stock" ? b.stock - a.stock : a.name.localeCompare(b.name));

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSave = (product) => {
    if (products.find(p => p.id === product.id)) {
      setProducts(ps => ps.map(p => p.id === product.id ? product : p));
      showToast("Producto actualizado correctamente");
    } else {
      setProducts(ps => [...ps, product]);
      showToast("Producto creado correctamente");
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    setProducts(ps => ps.filter(p => p.id !== id));
    setDeleteConfirm(null);
    showToast("Producto eliminado", "warn");
  };

  // Category distribution for mini chart
  const catCounts = CATEGORIES.filter(c => c !== "Todas").map(c => ({
    name: c, count: products.filter(p => p.category === c).length
  })).filter(c => c.count > 0);
  const maxCount = Math.max(...catCounts.map(c => c.count));

  const sidebarItems = [
    { icon: "⊞", label: "Dashboard", active: view === "overview" },
    { icon: "📦", label: "Inventario", active: view === "table" },
    { icon: "📊", label: "Reportes", active: false },
    { icon: "🔔", label: "Alertas", badge: lowStock + outStock },
    { icon: "⚙️", label: "Config", active: false },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #060b14; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
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

        {/* ── Sidebar ── */}
        <aside style={{ width: 220, background: "rgba(255,255,255,0.025)", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", padding: "28px 16px", flexShrink: 0 }}>
          <div style={{ padding: "0 8px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
              <span style={{ color: "#6366f1" }}>■</span> StockOS
            </div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>Sistema de inventario</div>
          </div>
          <nav style={{ marginTop: 24, flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            {sidebarItems.map(item => (
              <button key={item.label} className="sidebar-item"
                onClick={() => item.label === "Inventario" ? setView("table") : item.label === "Dashboard" ? setView("overview") : null}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left", width: "100%", background: item.active ? "rgba(99,102,241,0.15)" : "transparent", color: item.active ? "#818cf8" : "#64748b", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: item.active ? 600 : 400, transition: "all 0.15s", position: "relative" }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
                {item.badge > 0 && <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", borderRadius: 20, fontSize: 10, padding: "1px 7px", fontWeight: 700 }}>{item.badge}</span>}
              </button>
            ))}
          </nav>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>FN</div>
              <div>
                <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>Franco N.</div>
                <div style={{ fontSize: 11, color: "#475569" }}>Admin</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, animation: "fadeIn 0.4s ease" }}>
            <div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em" }}>
                {view === "table" ? "Inventario" : "Dashboard"}
              </h1>
              <p style={{ color: "#475569", fontSize: 14, marginTop: 4 }}>{products.length} productos · Actualizado ahora</p>
            </div>
            <button onClick={() => setModal("new")}
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", color: "#fff", padding: "12px 22px", borderRadius: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 20px rgba(99,102,241,0.4)", transition: "transform 0.15s, box-shadow 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(99,102,241,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.4)"; }}>
              ＋ Nuevo producto
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32, animation: "fadeIn 0.5s ease 0.05s both" }}>
            <StatCard icon="📦" label="Total productos" value={products.length} sub={`${filtered.length} filtrados`} accent="#6366f1" />
            <StatCard icon="💰" label="Valor inventario" value={`S/ ${(totalValue / 1000).toFixed(1)}k`} sub="Precio × stock" accent="#10b981" />
            <StatCard icon="⚠️" label="Sin stock / bajo" value={`${outStock + lowStock}`} sub={`${outStock} agotados · ${lowStock} bajos`} accent="#f59e0b" />
            <StatCard icon="🛒" label="Unidades vendidas" value={totalSold.toLocaleString()} sub="Total histórico" accent="#8b5cf6" />
          </div>

          {view === "overview" ? (
            /* ── Overview panels ── */
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, animation: "fadeIn 0.4s ease" }}>
              {/* Category chart */}
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

              {/* Activity feed */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#e2e8f0", marginBottom: 20 }}>Actividad reciente</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {ACTIVITY.map((a, i) => {
                    const colors = { add: "#10b981", sell: "#6366f1", alert: "#f59e0b" };
                    return (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[a.type], marginTop: 5, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, color: "#cbd5e1" }}>{a.text}</div>
                          <div style={{ display: "flex", gap: 10, marginTop: 3 }}>
                            <span style={{ fontSize: 11, color: "#475569" }}>{a.time}</span>
                            <span style={{ fontSize: 11, color: colors[a.type] }}>{a.qty}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top products */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24, gridColumn: "1 / -1" }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#e2e8f0", marginBottom: 20 }}>Top productos por ventas</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
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
          ) : (
            /* ── Table view ── */
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              {/* Filters */}
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

              {/* Table */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      {["Producto", "SKU", "Categoría", "Stock", "Precio", "Estado", "Acciones"].map(h => (
                        <th key={h} style={{ padding: "14px 18px", textAlign: "left", fontSize: 11, color: "#475569", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr><td colSpan={7} style={{ padding: 48, textAlign: "center", color: "#475569", fontSize: 14 }}>No se encontraron productos</td></tr>
                    ) : paginated.map(p => (
                      <tr key={p.id} className="row-hover" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}>
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>{p.sold} vendidos</div>
                        </td>
                        <td style={{ padding: "14px 18px", fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>{p.sku}</td>
                        <td style={{ padding: "14px 18px" }}>
                          <span style={{ fontSize: 12, color: "#94a3b8", background: "rgba(255,255,255,0.06)", padding: "3px 10px", borderRadius: 6 }}>{p.category}</span>
                        </td>
                        <td style={{ padding: "14px 18px", fontSize: 14, color: p.stock === 0 ? "#ef4444" : p.stock <= 4 ? "#f59e0b" : "#e2e8f0", fontWeight: 600 }}>{p.stock} u.</td>
                        <td style={{ padding: "14px 18px", fontSize: 14, color: "#e2e8f0" }}>{fmt(p.price)}</td>
                        <td style={{ padding: "14px 18px" }}><StatusBadge status={p.status} /></td>
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn-icon" onClick={() => setModal(p)} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#94a3b8", width: 30, height: 30, borderRadius: 7, cursor: "pointer", fontSize: 14, transition: "background 0.15s" }}>✏️</button>
                            <button className="btn-icon" onClick={() => setDeleteConfirm(p)} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#94a3b8", width: 30, height: 30, borderRadius: 7, cursor: "pointer", fontSize: 14, transition: "background 0.15s" }}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
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
            </div>
          )}
        </main>
      </div>

      {/* ── Modals ── */}
      {(modal === "new" || (modal && modal.id)) && (
        <Modal product={modal === "new" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />
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
