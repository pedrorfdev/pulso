import { QueryClient } from "@tanstack/react-query"

/**
 * Config do React Query.
 *
 * staleTime de 30s: dados "frescos" por 30s evita refetch redundante quando
 * o usuário navega entre telas rapidamente (ex: dashboard -> evento -> volta
 * pro dashboard). Depois disso, refetch acontece em background ao focar a
 * aba ou montar o componente de novo — sem bloquear a UI.
 *
 * retry: 1 em vez do padrão (3): numa rede de evento ao vivo, 3 retries
 * antes de mostrar erro deixa o usuário esperando demais sem feedback.
 * Preferimos falhar rápido e deixar a UI mostrar estado de erro/retry manual.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})
