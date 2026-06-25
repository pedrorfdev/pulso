import { useEffect, useState } from "react"

interface DeadlineCountdownProps {
  deadline: string // ISO 8601
}

/**
 * Mostra quanto tempo falta pro prazo de confirmação ("expira em 6h",
 * "expira em 23min"). Atualiza a cada minuto — não precisa de mais
 * frequência que isso, o usuário não vai ficar olhando segundo a segundo.
 *
 * Quando o prazo já passou, mostra "prazo encerrado" em vez de tempo
 * negativo — evita o visual confuso de "-2h".
 */
export function DeadlineCountdown({ deadline }: DeadlineCountdownProps) {
  const [label, setLabel] = useState(() => formatCountdown(deadline))

  useEffect(() => {
    const interval = setInterval(() => {
      setLabel(formatCountdown(deadline))
    }, 60_000)
    return () => clearInterval(interval)
  }, [deadline])

  const isUrgent = label.includes("min") || label.includes("encerrado")

  return (
    <span className={isUrgent ? "text-warning" : "text-muted-foreground"}>
      {label}
    </span>
  )
}

function formatCountdown(deadline: string): string {
  const diffMs = new Date(deadline).getTime() - Date.now()

  if (diffMs <= 0) return "prazo encerrado"

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffHours >= 24) {
    const diffDays = Math.floor(diffHours / 24)
    return `expira em ${diffDays}d`
  }

  if (diffHours >= 1) {
    return `expira em ${diffHours}h`
  }

  return `expira em ${diffMinutes}min`
}
