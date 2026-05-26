# StockOS — Sistema de Gestión de Inventario

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=vercel)

> Dashboard SaaS full-stack para gestión de inventario en tiempo real, con autenticación, CRUD completo, filtros avanzados y visualización de datos.

🔗 **[Ver demo en vivo](https://stockos.vercel.app)** &nbsp;·&nbsp; 📸 **[Screenshots](#screenshots)**

---

## ✨ Funcionalidades

- 🔐 **Autenticación** con Supabase Auth (registro, login, sesiones persistentes)
- 📦 **CRUD completo** de productos con validación de formularios (React Hook Form + Zod)
- 🔍 **Búsqueda y filtros** por nombre, SKU, categoría y ordenamiento
- 📊 **Dashboard overview** con estadísticas, gráficos de categorías y actividad reciente
- ⚠️ **Alertas de stock** automáticas (bajo stock / agotado)
- 📱 **Diseño responsivo** adaptado a mobile, tablet y desktop
- 🔄 **Paginación** y manejo eficiente de grandes catálogos
- 🎨 **UI moderna** con tema oscuro y animaciones

---

## 🛠️ Tech Stack

| Área | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Backend / DB | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Formularios | React Hook Form + Zod |
| Estado servidor | TanStack Query (React Query) |
| Deploy | Vercel |

---

## 🚀 Instalación y uso local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Nazah29/stockos.git
cd stockos

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales de Supabase

# 4. Ejecutar en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## ⚙️ Variables de entorno

Crea un archivo `.env.local` con lo siguiente:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

> Puedes obtener estas claves en [supabase.com](https://supabase.com) → tu proyecto → Settings → API.

---

## 🗄️ Esquema de base de datos

```sql
-- Tabla de productos
create table products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sku         text unique not null,
  category    text not null,
  stock       integer not null default 0,
  price       numeric(10, 2) not null,
  sold        integer default 0,
  status      text check (status in ('ok', 'low', 'out')) default 'ok',
  created_at  timestamp with time zone default now(),
  updated_at  timestamp with time zone default now()
);

-- Row Level Security
alter table products enable row level security;
create policy "Usuarios autenticados pueden ver productos"
  on products for select using (auth.role() = 'authenticated');
create policy "Usuarios autenticados pueden modificar productos"
  on products for all using (auth.role() = 'authenticated');
```

---

## 📁 Estructura del proyecto

```
stockos/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx          # Overview / stats
│   │   └── inventory/
│   │       └── page.tsx      # Tabla de productos
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                   # Componentes reutilizables
│   ├── ProductTable.tsx
│   ├── ProductModal.tsx
│   ├── StatCard.tsx
│   └── Sidebar.tsx
├── lib/
│   ├── supabase.ts
│   └── validators.ts         # Schemas Zod
├── hooks/
│   └── useProducts.ts        # TanStack Query hooks
└── types/
    └── index.ts
```

---

## 📸 Screenshots

> *(Agrega capturas o un GIF del dashboard aquí)*

---

## 🧠 Lo que aprendí construyendo esto

- Implementación de **autenticación con Supabase** y protección de rutas con middleware en Next.js
- Gestión de **estado del servidor con TanStack Query**: caché, revalidación y mutaciones optimistas
- Validación de formularios con **React Hook Form + Zod** para tipado end-to-end
- Diseño de **Row Level Security (RLS)** en PostgreSQL para seguridad a nivel de base de datos
- Optimización de rendimiento con **Suspense boundaries** y carga progresiva

---

## 👤 Autor

**Franco Nazario Gómez** — [@Nazah29](https://github.com/Nazah29)

---

## 📄 Licencia

MIT © Franco Nazario Gómez
