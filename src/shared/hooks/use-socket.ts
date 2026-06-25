import { useEffect, useRef } from "react"
import { getSocket } from "@/shared/lib/socket"
import { useOrgStore } from "@/shared/store/org-store"
import { useAuth } from "./use-auth"

/**
 * Conecta o socket uma vez por sessão e entra na sala da org ativa.
 *
 * Por que isso fica num hook central em vez de cada feature conectar
 * sozinha: o socket é uma conexão ÚNICA e cara (handshake, autenticação).
 * Se cada componente que precisasse de real-time chamasse io() de novo,
 * teríamos múltiplas conexões redundantes. Esse hook garante que a
 * conexão acontece uma vez (via getSocket(), que já é singleton) e o
 * join na sala da org acontece sempre que a org ativa muda.
 *
 * Esse hook NÃO escuta eventos específicos — ele só garante "estou
 * conectado e na sala certa". Cada feature (attendance, swaps...) usa
 * o hook `useSocketEvent` abaixo pra escutar o que importa pra ela.
 */
export function useSocketConnection() {
  const { isAuthenticated } = useAuth()
  const activeOrgId = useOrgStore((s) => s.activeOrgId)

  useEffect(() => {
    if (!isAuthenticated || !activeOrgId) return

    const socket = getSocket()

    if (!socket.connected) {
      socket.connect()
    }

    socket.emit("join:org", activeOrgId)

    // Não desconectamos no cleanup — a conexão deve sobreviver entre
    // navegações de tela. Só desconecta de verdade no logout
    // (ver useInvalidateAuth / fluxo de logout, Épico futuro).
  }, [isAuthenticated, activeOrgId])
}

/**
 * Escuta um evento específico do socket enquanto o componente estiver
 * montado, e remove o listener automaticamente ao desmontar.
 *
 * Uso típico: useSocketEvent('attendance:updated', (data) => { ... })
 */
export function useSocketEvent<T = unknown>(
  eventName: string,
  handler: (payload: T) => void
) {
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    const socket = getSocket()

    function wrappedHandler(payload: T) {
      handlerRef.current(payload)
    }

    socket.on(eventName, wrappedHandler)
    return () => {
      socket.off(eventName, wrappedHandler)
    }
  }, [eventName])
}
