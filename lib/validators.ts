import { z } from "zod"

export const productSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(), // Acepta números (para mock) o strings (UUID para base de datos real)
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  sku: z.string().min(4, { message: "El SKU debe tener al menos 4 caracteres" }),
  category: z.string().min(1, { message: "Debes seleccionar una categoría" }),
  // En Zod v4, el parámetro para mensajes de error de tipo inválido se simplificó a simplemente 'message' o 'error'
  stock: z.number({ message: "El stock debe ser un número" }).int().min(0, { message: "El stock no puede ser negativo" }),
  price: z.number({ message: "El precio debe ser un número" }).min(0.01, { message: "El precio debe ser mayor a 0" }),
})

// Inferimos el tipo de TypeScript automáticamente desde el esquema de Zod
export type ProductFormValues = z.infer<typeof productSchema>