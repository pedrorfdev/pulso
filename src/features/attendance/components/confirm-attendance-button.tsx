import { useState } from "react"
import { useConfirmAttendance } from "../hooks/use-confirm-attendance"
import type { AttendanceStatus } from "@/types/enums"

interface ConfirmAttendanceButtonProps {
  attendanceId: string
  eventId: string
  currentStatus: AttendanceStatus
}

/**
 * O botão mais importante do Pulso. Dois estados de interação:
 *
 *   1. PENDING -> mostra os dois botões grandes ("Vou estar lá ✓" / "Não consigo ir")
 *   2. Clicou em "Não consigo ir" -> abre um campo de justificativa,
 *      porque o back REJEITA declínio sem justification (regra de
 *      negócio crítica nº 2 do doc de contexto). Não dá pra simplesmente
 *      mandar DECLINED direto.
 *
 * Depois de CONFIRMED/DECLINED, mostra o estado já decidido (sem
 * remover a possibilidade de mudar de ideia antes do deadline).
 */
export function ConfirmAttendanceButton({
  attendanceId,
  eventId,
  currentStatus,
}: ConfirmAttendanceButtonProps) {
  const [showDeclineForm, setShowDeclineForm] = useState(false)
  const [justification, setJustification] = useState("")
  const { mutate, isPending } = useConfirmAttendance()

  function handleConfirm() {
    mutate({ attendanceId, eventId, status: "CONFIRMED" })
  }

  function handleDeclineSubmit() {
    if (justification.trim().length === 0) return
    mutate({
      attendanceId,
      eventId,
      status: "DECLINED",
      justification: justification.trim(),
    })
    setShowDeclineForm(false)
  }

  if (currentStatus === "CONFIRMED") {
    return (
      <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-center text-success">
        Você confirmou ✓
      </div>
    )
  }

  if (currentStatus === "DECLINED") {
    return (
      <div className="rounded-xl border border-border bg-surface px-4 py-3 text-center text-muted-foreground">
        Você avisou que não vai
      </div>
    )
  }

  if (currentStatus === "DEADLINE_MISSED") {
    return (
      <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-center text-warning">
        Prazo de confirmação encerrado
      </div>
    )
  }

  if (showDeclineForm) {
    return (
      <div className="flex flex-col gap-3">
        <textarea
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          placeholder="Por que não vai dar? (obrigatório)"
          rows={2}
          autoFocus
          className="rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-pulse"
        />
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeclineForm(false)}
            className="flex-1 rounded-xl border border-border px-4 py-3 text-muted-foreground"
          >
            Voltar
          </button>
          <button
            onClick={handleDeclineSubmit}
            disabled={justification.trim().length === 0 || isPending}
            className="flex-1 rounded-xl bg-pulse px-4 py-3 font-medium text-pulse-foreground disabled:opacity-50"
          >
            Confirmar ausência
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleConfirm}
        disabled={isPending}
        className="flex-1 rounded-xl bg-gradient-pulse px-4 py-4 text-lg font-medium text-pulse-foreground transition active:scale-[0.98] disabled:opacity-50"
      >
        Vou estar lá ✓
      </button>
      <button
        onClick={() => setShowDeclineForm(true)}
        disabled={isPending}
        className="flex-1 rounded-xl border border-border px-4 py-4 text-lg text-muted-foreground transition active:scale-[0.98] disabled:opacity-50"
      >
        Não consigo ir
      </button>
    </div>
  )
}
