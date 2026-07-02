import { useState } from "react";
import { useConfirmAttendance } from "../hooks/use-confirm-attendance";
import type { AttendanceStatus } from "@/types/enums";

interface Props {
  attendanceId: string;
  eventId: string;
  currentStatus: AttendanceStatus;
}

export function ConfirmAttendanceButton({
  attendanceId,
  eventId,
  currentStatus,
}: Props) {
  const [mode, setMode] = useState<"idle" | "decline-form">("idle");
  const [justification, setJustification] = useState("");
  const { mutate, isPending } = useConfirmAttendance();

  function confirm() {
    mutate({ attendanceId, eventId, status: "CONFIRMED" });
  }

  function submitDecline() {
    if (!justification.trim()) return;
    mutate({
      attendanceId,
      eventId,
      status: "DECLINED",
      justification: justification.trim(),
    });
    setMode("idle");
    setJustification("");
  }

  // Prazo expirado — nada a fazer
  if (currentStatus === "DEADLINE_MISSED") {
    return (
      <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-center text-sm text-warning">
        Prazo encerrado
      </div>
    );
  }

  // Formulário de justificativa do declínio
  if (mode === "decline-form") {
    return (
      <div className="flex flex-col gap-3">
        <textarea
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          placeholder="O que aconteceu? (obrigatório)"
          rows={2}
          autoFocus
          className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-pulse"
        />
        <div className="flex gap-2">
          <button
            onClick={() => {
              setMode("idle");
              setJustification("");
            }}
            className="flex-1 rounded-xl border border-border py-3 text-sm text-muted-foreground"
          >
            Voltar
          </button>
          <button
            onClick={submitDecline}
            disabled={!justification.trim() || isPending}
            className="flex-1 rounded-xl bg-pulse py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            {isPending ? "..." : "Confirmar ausência"}
          </button>
        </div>
      </div>
    );
  }

  // CONFIRMED — pode mudar de ideia
  if (currentStatus === "CONFIRMED") {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3">
          <span className="text-sm font-medium text-success">
            Você confirmou ✓
          </span>
        </div>
        <button
          onClick={() => setMode("decline-form")}
          disabled={isPending}
          className="text-xs text-muted-foreground underline-offset-2 hover:text-pulse hover:underline disabled:opacity-50"
        >
          Mudou de planos? Avisar que não vai
        </button>
      </div>
    );
  }

  // DECLINED — pode mudar de ideia
  if (currentStatus === "DECLINED") {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3">
          <span className="text-sm text-muted-foreground">
            Você avisou que não vai
          </span>
        </div>
        <button
          onClick={confirm}
          disabled={isPending}
          className="text-xs text-muted-foreground underline-offset-2 hover:text-success hover:underline disabled:opacity-50"
        >
          {isPending ? "..." : "Conseguiu ir afinal? Confirmar presença"}
        </button>
      </div>
    );
  }

  // PENDING — decisão pendente, botões grandes
  return (
    <div className="flex gap-3">
      <button
        onClick={confirm}
        disabled={isPending}
        className="flex-1 rounded-xl bg-gradient-pulse py-4 text-base font-semibold text-white transition active:scale-[0.98] disabled:opacity-50"
      >
        Vou estar lá ✓
      </button>
      <button
        onClick={() => setMode("decline-form")}
        disabled={isPending}
        className="flex-1 rounded-xl border border-border py-4 text-base text-muted-foreground transition active:scale-[0.98] disabled:opacity-50"
      >
        Não consigo ir
      </button>
    </div>
  );
}
