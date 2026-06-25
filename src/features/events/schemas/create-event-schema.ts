import { z } from "zod"

/**
 * Schema de validação do form de criar evento. Vive separado do
 * componente porque o mesmo schema serve tanto pro react-hook-form
 * (validação em tempo real) quanto, futuramente, pra reaproveitar em
 * testes sem precisar montar um componente inteiro.
 */
export const createEventSchema = z.object({
  title: z
    .string()
    .min(3, "O título precisa ter pelo menos 3 letras")
    .max(100, "Título muito longo"),
  description: z.string().max(500, "Descrição muito longa").optional(),
  location: z.string().max(150, "Local muito longo").optional(),
  startsAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data e hora inválidas",
  }),
})

export type CreateEventFormValues = z.infer<typeof createEventSchema>
