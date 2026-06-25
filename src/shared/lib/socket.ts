import { io, type Socket } from "socket.io-client"

let socket: Socket | null = null

/**
 * Cria (ou retorna) a conexão única de socket do app.
 *
 * NOTA SOBRE AUTH — PENDENTE DE CONFIRMAÇÃO (ver Pedro):
 * O JWT do Pulso vive num cookie httpOnly, então o JS do front não consegue
 * lê-lo pra mandar em `auth.token` manualmente. Duas hipóteses:
 *
 *   (a) O servidor Socket.io lê o cookie direto do header da request de
 *       handshake (não precisa de nada explícito aqui além de
 *       `withCredentials: true`, que já manda o cookie automaticamente).
 *
 *   (b) Existe um endpoint tipo GET /auth/socket-token que devolve um token
 *       de curta duração pra ser passado em `auth.token`.
 *
 * Implementado abaixo assumindo (a), por ser o caminho mais comum quando
 * o resto da API já usa cookie httpOnly. Se for (b), o ajuste é trocar
 * o objeto `auth` por uma chamada prévia ao apiClient buscando o token.
 */
export function getSocket(): Socket {
  if (socket) return socket

  socket = io(import.meta.env.VITE_API_URL ?? "http://localhost:3000", {
    withCredentials: true,
    autoConnect: false,
  })

  return socket
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}
