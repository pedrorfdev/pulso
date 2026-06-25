import { useEffect } from "react"
import { apiClient } from "@/shared/lib/api-client"

/**
 * Busca a VAPID public key do back e registra a push subscription
 * do dispositivo atual. Deve ser chamado uma vez depois que o usuário
 * está autenticado — coloca bem no RootLayout ou no AuthCallbackPage.
 *
 * Por que não registrar no service worker diretamente: a subscription
 * precisa ser enviada pro back (POST /push/subscribe) pra ele saber
 * pra onde mandar o push. Isso requer o cookie de auth, que só existe
 * no contexto da página, não do SW.
 *
 * Fluxo:
 *   1. Busca VAPID public key de GET /push/vapid-public-key
 *   2. Pede permissão de notificação ao usuário (browser nativo)
 *   3. Cria subscription via PushManager
 *   4. Envia pro back via POST /push/subscribe
 */
export function usePushSubscription(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return

    async function subscribe() {
      try {
        const permission = await Notification.requestPermission()
        if (permission !== "granted") return

        const registration = await navigator.serviceWorker.ready

        // Busca a VAPID public key do back
        const { data } = await apiClient.get<{ publicKey: string }>(
          "/push/vapid-public-key"
        )

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(data.publicKey).buffer as ArrayBuffer,
        })

        // Envia a subscription pro back no formato que ele espera
        const sub = subscription.toJSON()
        await apiClient.post("/push/subscribe", {
          subscription: {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.keys?.p256dh,
              auth: sub.keys?.auth,
            },
          },
        })
      } catch (err) {
        // Falha silenciosa — push é nice-to-have, não bloqueia o app
        console.warn("[Pulso] Push subscription failed:", err)
      }
    }

    subscribe()
  }, [enabled])
}

/**
 * Converte a VAPID public key de base64url pra Uint8Array,
 * formato que o PushManager.subscribe() exige.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}
