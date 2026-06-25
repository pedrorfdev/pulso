import { QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from "@tanstack/react-router"
import { queryClient } from "./query-client"
import { router } from "./router"

/**
 * Ponto único onde todos os providers globais vivem.
 * Mantém o main.tsx limpo e dá um lugar óbvio pra adicionar futuros
 * providers (ex: um ThemeProvider, se decidirmos suportar light mode).
 */
export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
