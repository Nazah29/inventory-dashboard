
import { z } from "zod"

export const productSchema = z.object({
  id: z.string().uuid().optional(), // Opcional porque al crear un producto nuevo no tenemos ID
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  sku: z.string().min(4, { message: "El SKU debe tener al menos 4 caracteres" }),
  category: z.string().min(1, { message: "Debes seleccionar una categoría" }),
  // Usamos z.coerce.number() porque los inputs HTML siempre devuelven strings
  stock: z.coerce.number().int().min(0, { message: "El stock no puede ser negativo" }),
  price: z.coerce.number().min(0.01, { message: "El precio debe ser mayor a 0" }),
})

// Inferimos el tipo de TypeScript automáticamente desde el esquema de Zod
export type ProductFormValues = z.infer<typeof productSchema>