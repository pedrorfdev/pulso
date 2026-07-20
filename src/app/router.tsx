/**
 * router.tsx
 *
 * Responsável apenas por:
 *   1. Criar o router a partir da routeTree
 *   2. Registrar o tipo globalmente (interface Register)
 *
 * A árvore de rotas fica em route-tree.tsx, que NÃO importa este arquivo.
 * Isso quebra o ciclo de dependência de tipos que causava o erro:
 *   "eventId does not exist in type ParamsReducerFn<..., AnyRoute, ...>"
 *
 * Com o ciclo quebrado, o TypeScript consegue inferir corretamente os
 * parâmetros de cada rota ($eventId, $memberId, $token) em qualquer
 * componente que use useParams, Link ou useNavigate.
 */
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./route-tree";

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
