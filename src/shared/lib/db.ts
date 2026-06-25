import Dexie, { type Table } from "dexie"
import type { EventDetail } from "@/features/events/types"
import type { Song } from "@/features/songs/types"
import type { TechCheckItem } from "@/features/tech-check/types"

/**
 * Banco local IndexedDB via Dexie.
 *
 * O que cacheamos e por quê:
 *
 *   events   → a escala do próximo culto precisa abrir offline. É o
 *              dado mais crítico do app — sem isso, o membro não sabe
 *              o que tocar nem pode confirmar presença offline.
 *
 *   songs    → repertório do evento precisa estar disponível sem rede.
 *              Músico abre o app no palco sem sinal (situação real).
 *
 *   techCheck → checklist de equipamentos precisa estar acessível no
 *               momento da montagem, que frequentemente é sem wifi.
 *
 * O que NÃO cacheamos:
 *   swaps, stats, notifications → dados que mudam frequentemente e
 *   perdem valor se desatualizados. Melhor mostrar erro de rede do que
 *   dado obsoleto nessas features.
 *
 * Estratégia: React Query busca da API normalmente. Em caso de sucesso,
 * o hook correspondente salva no Dexie. Em caso de falha (offline), lê
 * do Dexie como fallback. O componente não sabe a diferença.
 */
class PulsoDB extends Dexie {
  events!: Table<EventDetail & { orgId: string; cachedAt: number }>
  songs!: Table<Song & { orgId: string; cachedAt: number }>
  techCheck!: Table<{ eventId: string; orgId: string; items: TechCheckItem[]; cachedAt: number }>

  constructor() {
    super("pulso-offline")

    this.version(1).stores({
      // índices: chave primária + campos buscáveis
      events: "id, orgId, cachedAt",
      songs: "id, orgId, cachedAt",
      techCheck: "eventId, orgId, cachedAt",
    })
  }
}

export const db = new PulsoDB()

/**
 * TTL de cache: 24h. Depois disso, o dado é considerado "muito velho"
 * mesmo offline e não é exibido — melhor mostrar tela de erro do que
 * dado de uma semana atrás como se fosse atual.
 */
export const CACHE_TTL_MS = 24 * 60 * 60 * 1000

export function isExpired(cachedAt: number): boolean {
  return Date.now() - cachedAt > CACHE_TTL_MS
}
