import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Junta classes condicionais (clsx) e resolve conflitos do Tailwind (twMerge).
 *
 * Por que isso existe: sem o twMerge, `cn("p-2", condition && "p-4")` deixaria
 * as duas classes no DOM e o resultado dependeria da ordem de specificity do
 * CSS gerado, o que é frágil. Com twMerge, a última prevalece de forma
 * previsível: "p-2 p-4" -> "p-4".
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
