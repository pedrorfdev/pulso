import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { useOrgStore } from "@/shared/store/org-store";

interface CreateOrgResponse {
  id: string;
  name: string;
  slug: string;
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
      navigate({ to: "/dashboard" });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return;
    mutate();
  }

  function handleCancel() {
    // Volta pro dashboard se já tem org ativa, senão pra seleção
    if (activeOrgId) {
      navigate({ to: "/dashboard" });
    } else {
      navigate({ to: "/select-organization" });
    }
  }

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

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do grupo (ex: Louvor Jovem)"
          className="rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-pulse"
        />

        {error && (
          <p className="text-sm text-pulse">
            Não deu pra criar o grupo. Tenta de novo em instantes.
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || name.trim().length < 2}
          className="rounded-xl bg-gradient-pulse px-6 py-3 font-medium text-pulse-foreground disabled:opacity-50"
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
      </form>
    </div>
  );
}
