import { AppHeader } from "./app-header"
import { BottomNav } from "./bottom-nav"

/**
 * Layout das telas autenticadas. Envolve qualquer rota que precise de
 * header + bottom nav. As telas de auth (login, callback, join) não usam
 * esse layout — ficam sem header.
 *
 * O padding-bottom de 80px compensa a bottom nav fixa pra o conteúdo
 * não ficar escondido atrás dela.
 */
export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  )
}
