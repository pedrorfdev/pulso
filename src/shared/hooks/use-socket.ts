import { useEffect, useRef } from "react";
import { getSocket } from "@/shared/lib/socket";
import { useOrgStore } from "@/shared/store/org-store";
import { useAuth } from "./use-auth";

/**
 * Conecta o socket uma vez por sessão e entra na sala da org ativa.
 * Quando a org muda, sai da sala anterior antes de entrar na nova.
 */
export function useSocketConnection() {
  const { isAuthenticated } = useAuth();
  const activeOrgId = useOrgStore((s) => s.activeOrgId);
  const prevOrgIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !activeOrgId) return;

    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    // Sai da sala anterior ao trocar de org
    if (prevOrgIdRef.current && prevOrgIdRef.current !== activeOrgId) {
      socket.emit("leave:org", prevOrgIdRef.current);
    }

    socket.emit("join:org", activeOrgId);
    prevOrgIdRef.current = activeOrgId;
  }, [isAuthenticated, activeOrgId]);
}

/**
 * Escuta um evento específico do socket enquanto o componente estiver
 * montado, e remove o listener automaticamente ao desmontar.
 */
export function useSocketEvent<T = unknown>(
  eventName: string,
  handler: (payload: T) => void,
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const socket = getSocket();

    function wrappedHandler(payload: T) {
      handlerRef.current(payload);
    }

    socket.on(eventName, wrappedHandler);
    return () => {
      socket.off(eventName, wrappedHandler);
    };
  }, [eventName]);
}
