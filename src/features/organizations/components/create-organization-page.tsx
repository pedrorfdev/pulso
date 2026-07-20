import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { useOrgStore } from "@/shared/store/org-store";

interface CreateOrgResponse {
  id: string;
  name: string;
  slug: string;
  invite_token?: string; // ASSUNÇÃO: o back retorna o token junto ao criar
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CreateOrganizationPage() {
  const [name, setName] = useState("");
  const [createdOrg, setCreatedOrg] = useState<CreateOrgResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setActiveOrgId = useOrgStore((s) => s.setActiveOrgId);
  const activeOrgId = useOrgStore((s) => s.activeOrgId);

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post<CreateOrgResponse>(
        "/organizations",
        {
          name: name.trim(),
          slug: slugify(name.trim()),
        },
      );
      return data;
    },
    onSuccess: (org) => {
      setActiveOrgId(org.id);
      queryClient.invalidateQueries({ queryKey: ["organizations", "mine"] });
      setCreatedOrg(org);
    },
  });

  // Link de invite — usa token do response ou fallback pro slug
  const inviteUrl = createdOrg
    ? `${window.location.origin}/join/${createdOrg.invite_token ?? createdOrg.slug}`
    : null;

  async function handleCopy() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCancel() {
    if (activeOrgId) navigate({ to: "/dashboard" });
    else navigate({ to: "/select-organization" });
  }

  // ── Tela de sucesso — grupo criado, mostra o link ─────────────────────────
  if (createdOrg) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <div className="relative w-full max-w-sm">
          {/* Glow decorativo */}
          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-gradient-pulse opacity-20 blur-3xl" />

          <div className="relative flex flex-col gap-5">
            {/* Header de sucesso */}
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-pulse shadow-lg shadow-pulse/30">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-foreground">
                {createdOrg.name} criado!
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Compartilha o link abaixo pra convidar sua equipe.
              </p>
            </div>

            {/* Link copiável */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground">
                Link de convite
              </p>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5">
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
            </div>

            {/* Compartilhar nativo — só aparece no mobile */}
            {typeof navigator.share === "function" && (
              <button
                onClick={() =>
                  navigator.share({
                    title: `Entrar no ${createdOrg.name}`,
                    text: "Te convidei pro Pulso — clica pra entrar no grupo:",
                    url: inviteUrl!,
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

            {/* Ir pro dashboard */}
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="rounded-xl bg-gradient-pulse py-3.5 font-medium text-white"
            >
              Ir pro grupo →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Formulário de criação ─────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Criar um grupo novo
        </h1>
        <p className="mt-2 text-muted-foreground">
          Você vira o líder responsável por ele.
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && name.trim().length >= 2 && mutate()
          }
          placeholder="Nome do grupo (ex: Louvor Jovem)"
          className="rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-pulse"
          autoFocus
        />

        {error && (
          <p className="text-sm text-pulse">
            Não deu pra criar o grupo. Tenta de novo em instantes.
          </p>
        )}

        <button
          onClick={() => mutate()}
          disabled={isPending || name.trim().length < 2}
          className="rounded-xl bg-gradient-pulse px-6 py-3.5 font-medium text-white disabled:opacity-50"
        >
          {isPending ? "Criando..." : "Criar grupo"}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="rounded-xl border border-border px-6 py-3 text-sm text-muted-foreground hover:bg-surface transition disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
