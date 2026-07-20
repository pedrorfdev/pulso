import { useState } from "react";
import { useInviteLink, buildInviteUrl } from "../hooks/use-invite-link";
import { useOrgStore } from "@/shared/store/org-store";
import { useOrganizations } from "../hooks/use-organizations";

interface InviteModalProps {
  onClose: () => void;
}

export function InviteModal({ onClose }: InviteModalProps) {
  const [copied, setCopied] = useState(false);
  const { data: invite, isLoading, error } = useInviteLink();
  const activeOrgId = useOrgStore((s) => s.activeOrgId);
  const { data: memberships } = useOrganizations();

  const orgName = memberships?.find((m) => m.organization.id === activeOrgId)
    ?.organization.name;

  const inviteUrl = invite ? buildInviteUrl(invite.token) : null;

  async function handleCopy() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      {/* Modal — para o clique no conteúdo de propagar pro backdrop */}
      <div
        className="w-full max-w-sm rounded-t-2xl border border-border bg-background p-6 pb-8 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Convidar membros
            </h2>
            {orgName && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                Para {orgName}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-surface transition"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 3l8 8M11 3l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Conteúdo */}
        {isLoading && (
          <div className="h-12 animate-pulse rounded-xl bg-surface" />
        )}

        {error && (
          <div className="rounded-xl border border-warning/20 bg-warning/5 px-4 py-3">
            <p className="text-sm text-warning">
              Não foi possível carregar o link. Verifica se o back está rodando.
            </p>
          </div>
        )}

        {inviteUrl && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Compartilha esse link. Quem abrir vai entrar direto no grupo como
              membro.
            </p>

            {/* Campo com link + botão copiar */}
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
              <p className="flex-1 truncate text-sm text-foreground">
                {inviteUrl}
              </p>
              <button
                onClick={handleCopy}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  copied
                    ? "bg-success/10 text-success"
                    : "bg-gradient-pulse text-white"
                }`}
              >
                {copied ? "Copiado ✓" : "Copiar"}
              </button>
            </div>

            {/* Botão de compartilhar nativo (mobile) */}
            {typeof navigator.share === "function" && (
              <button
                onClick={() =>
                  navigator.share({
                    title: `Entrar no ${orgName ?? "Pulso"}`,
                    text: "Te convidei pro Pulso — clica pra entrar no grupo:",
                    url: inviteUrl,
                  })
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-3 text-sm text-muted-foreground hover:bg-border/40 transition"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M11 5.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM5 8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM11 15.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM7.3 7.35l1.4.8M7.3 9.65l1.4-.8"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
                Compartilhar via...
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
