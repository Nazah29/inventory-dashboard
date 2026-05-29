// components/ProductModal.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, type ProductFormValues } from "../lib/validators"

const CATEGORIES = ["Electrónica", "Periféricos", "Componentes", "Computadoras", "Almacenamiento", "Audio", "Mobiliario", "Accesorios"]

interface ProductModalProps {
  product?: ProductFormValues | null;
  onClose: () => void;
  onSave: (data: ProductFormValues) => void;
}

export default function ProductModal({ product, onClose, onSave }: ProductModalProps) {
  // Inicializamos React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: "",
      sku: "",
      category: "Electrónica",
      stock: 0,
      price: 0,
    },
  })

  // Esta función solo se ejecuta si los datos pasan la validación de Zod
  const onSubmit = async (data: ProductFormValues) => {
    // Aquí es donde luego llamaremos a la mutación de TanStack Query
    await onSave(data)
  }

  // Estilos extraídos para limpiar el JSX
  const inputStyle = "w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-4 py-2 text-slate-200 text-sm outline-none focus:border-blue-550 transition-colors shadow-sm";
  const labelStyle = "block text-[10px] text-slate-400 mb-1.5 uppercase font-bold tracking-wider";
  const errorStyle = "text-red-400 text-xs mt-1 font-bold";

  return (
    <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center z-50 backdrop-blur-md">
      <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-100">
            {product ? "Editar producto" : "Nuevo producto"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:bg-slate-800 hover:text-slate-200 p-1.5 rounded-md transition-colors">
            ✕
          </button>
        </div>

        {/* handleSubmit envuelve tu función onSubmit */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Nombre */}
          <div>
            <label className={labelStyle}>Nombre</label>
            <input 
              {...register("name")} 
              className={inputStyle} 
              placeholder='Ej: Monitor LG UltraWide 34"' 
            />
            {errors.name && <p className={errorStyle}>{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Categoría */}
            <div>
              <label className={labelStyle}>Categoría</label>
              <select {...register("category")} className={inputStyle}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c} className="bg-[#0b0f19] text-slate-200">{c}</option>
                ))}
              </select>
              {errors.category && <p className={errorStyle}>{errors.category.message}</p>}
            </div>

            {/* SKU */}
            <div>
              <label className={labelStyle}>SKU</label>
              <input 
                {...register("sku")} 
                className={inputStyle} 
                placeholder="XXX-000" 
              />
              {errors.sku && <p className={errorStyle}>{errors.sku.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Stock */}
            <div>
              <label className={labelStyle}>Stock</label>
              <input 
                type="number" 
                {...register("stock", { valueAsNumber: true })} 
                className={inputStyle} 
              />
              {errors.stock && <p className={errorStyle}>{errors.stock.message}</p>}
            </div>

            {/* Precio */}
            <div>
              <label className={labelStyle}>Precio (S/)</label>
              <input 
                type="number" 
                step="0.01"
                {...register("price", { valueAsNumber: true })} 
                className={inputStyle} 
              />
              {errors.price && <p className={errorStyle}>{errors.price.message}</p>}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 mt-8 justify-end">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-350 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/30 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {isSubmitting ? "Guardando..." : (product ? "Guardar cambios" : "Crear producto")}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}