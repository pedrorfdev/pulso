import axios from "axios"

/**
 * Client HTTP único do app, usado por todas as features.
 *
 * `withCredentials: true` é o ponto crítico aqui: o back-end seta o JWT
 * como cookie httpOnly (não como Bearer token), então o navegador precisa
 * ser instruído a enviar esse cookie em toda request — inclusive em
 * requests cross-origin (front em :5173, back em :3000 durante o dev).
 *
 * Sem essa flag, toda rota autenticada do back retornaria 401 mesmo
 * com o login tendo funcionado, porque o cookie simplesmente não seria
 * anexado na request.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  withCredentials: true,
})

/**
 * Intercepta respostas 401 globalmente. Se a sessão expirou ou nunca
 * existiu, redireciona pro login em vez de deixar cada feature tratar
 * isso individualmente.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)
