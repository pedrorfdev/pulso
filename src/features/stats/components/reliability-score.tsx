interface ReliabilityScoreProps {
  score: number // 0-100
  size?: "sm" | "lg"
}

/**
 * Visualização do reliability score. Decisão de produto deliberada:
 * não mostramos o número 0-100 diretamente pro membro comum — isso
 * vira ansiedade desnecessária ("meu score caiu 3 pontos!"). Em vez
 * disso, traduzimos o range em níveis com labels humanos.
 *
 * O número exato aparece só na visão do líder (StatsPage do líder),
 * onde ele precisa comparar membros objetivamente.
 *
 * Faixas definidas com base na fórmula do back:
 *   >= 85 → Muito confiável
 *   >= 65 → Confiável
 *   >= 45 → Regular
 *   <  45 → Precisa melhorar
 */
export function ReliabilityScore({ score, size = "lg" }: ReliabilityScoreProps) {
  const { label, color, description } = getScoreConfig(score)
  const circumference = 2 * Math.PI * 36 // raio 36
  const filled = (score / 100) * circumference

  if (size === "sm") {
    return (
      <div className="flex items-center gap-2">
        <div
          className="h-2 w-16 overflow-hidden rounded-full bg-border"
        >
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${score}%`, backgroundColor: color }}
          />
        </div>
        <span className="text-xs font-medium" style={{ color }}>
          {label}
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Anel circular com o score */}
      <div className="relative">
        <svg width="96" height="96" viewBox="0 0 96 96">
          {/* Trilha de fundo */}
          <circle
            cx="48"
            cy="48"
            r="36"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="8"
          />
          {/* Arco de progresso */}
          <circle
            cx="48"
            cy="48"
            r="36"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference - filled}`}
            strokeDashoffset={circumference * 0.25} // começa do topo
            className="transition-all duration-700"
          />
        </svg>
        {/* Score numérico no centro — visível aqui pra o próprio membro */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold text-foreground">
            {Math.round(score)}
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="font-medium" style={{ color }}>
          {label}
        </p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function getScoreConfig(score: number): {
  label: string
  color: string
  description: string
} {
  if (score >= 85) {
    return {
      label: "Muito confiável",
      color: "var(--color-success)",
      description: "Você raramente falta e sempre avisa com antecedência.",
    }
  }
  if (score >= 65) {
    return {
      label: "Confiável",
      color: "var(--color-info)",
      description: "Você costuma cumprir os compromissos do grupo.",
    }
  }
  if (score >= 45) {
    return {
      label: "Regular",
      color: "var(--color-warning)",
      description: "Algumas faltas ou confirmações fora do prazo.",
    }
  }
  return {
    label: "Precisa melhorar",
    color: "var(--color-pulse)",
    description: "Muitas faltas ou confirmações perdidas. Tenta avisar mais cedo!",
  }
}
