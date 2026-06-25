/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching"

declare const self: ServiceWorkerGlobalScope

// Precache gerado automaticamente pelo vite-plugin-pwa (injectManifest)
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

/**
 * Handler de Web Push. Dispara quando o back envia uma push notification
 * pro dispositivo — mesmo com o app fechado.
 *
 * O payload chega como JSON com { title, body, data }. O campo `data`
 * pode trazer { url } pra navegar direto pra tela certa ao clicar.
 */
self.addEventListener("push", (event) => {
  if (!event.data) return

  const payload = event.data.json() as {
    title: string
    body: string
    data?: { url?: string }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: payload.data,
    })
  )
})

/**
 * Handler de clique na notificação nativa. Abre o app na URL correta
 * se o back mandou um `data.url`, senão abre o dashboard.
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const url = (event.notification.data as { url?: string } | null)?.url ?? "/dashboard"

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        // Se já tem uma aba aberta, foca ela e navega
        const existing = clients.find((c) => "focus" in c)
        if (existing) {
          existing.focus()
          existing.navigate(url)
          return
        }
        // Senão abre uma nova aba
        self.clients.openWindow(url)
      })
  )
})
