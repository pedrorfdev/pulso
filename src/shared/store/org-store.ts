import { create } from "zustand"
import { persist } from "zustand/middleware"

interface OrgStore {
  activeOrgId: string | null
  setActiveOrgId: (orgId: string) => void
  clearActiveOrgId: () => void
}

/**
 * Guarda só o ID da org ativa — não o objeto inteiro.
 *
 * Por quê: os dados completos da org (nome, config de deadline, etc) já
 * vivem no cache do React Query via useOrganizations(). Se duplicássemos
 * esse objeto aqui no Zustand, teríamos duas fontes de verdade que podem
 * dessincronizar. Mantendo só o ID, qualquer componente busca os dados
 * atualizados via React Query usando esse ID como parte da query key.
 *
 * `persist` salva no localStorage: se o usuário fecha a aba e volta,
 * continua na mesma org sem precisar escolher de novo toda vez.
 */
export const useOrgStore = create<OrgStore>()(
  persist(
    (set) => ({
      activeOrgId: null,
      setActiveOrgId: (orgId) => set({ activeOrgId: orgId }),
      clearActiveOrgId: () => set({ activeOrgId: null }),
    }),
    { name: "pulso-active-org" }
  )
)
