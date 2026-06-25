import { useState } from "react"
import { useCreateTechCheckItem } from "../hooks/use-tech-check"

interface AddTechCheckItemFormProps {
  eventId: string
  onSuccess?: () => void
}

const CATEGORIES = ["Instrumentos", "Cabos", "PA / Som", "Iluminação", "Outros"]

export function AddTechCheckItemForm({
  eventId,
  onSuccess,
}: AddTechCheckItemFormProps) {
  const [label, setLabel] = useState("")
  const [category, setCategory] = useState(CATEGORIES[0])
  const [isCritical, setIsCritical] = useState(false)
  const { mutate, isPending } = useCreateTechCheckItem()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!label.trim()) return

    mutate(
      { eventId, label: label.trim(), category, isCritical },
      {
        onSuccess: () => {
          setLabel("")
          setIsCritical(false)
          onSuccess?.()
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Ex: DI Box, cabo XLR, notebook..."
        className="rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-pulse"
      />

      <div className="flex gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-pulse"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setIsCritical((v) => !v)}
          className={`rounded-xl border px-4 py-2 text-sm transition ${
            isCritical
              ? "border-pulse bg-pulse/10 text-pulse"
              : "border-border text-muted-foreground"
          }`}
        >
          Crítico
        </button>
      </div>

      <button
        type="submit"
        disabled={!label.trim() || isPending}
        className="rounded-xl bg-gradient-pulse py-3 font-medium text-pulse-foreground disabled:opacity-50"
      >
        {isPending ? "Adicionando..." : "Adicionar item"}
      </button>
    </form>
  )
}
