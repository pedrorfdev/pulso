import { useState } from "react";
import { useOrgStats, useMemberAbsences } from "../hooks/use-stats";
import { ReliabilityScore } from "./reliability-score";
import type { MemberStatsEntry, MemberAbsence } from "../types";

export function OrgStatsPage() {
  const [tab, setTab] = useState<"team" | "absences">("team");
  const { data: orgStats, isLoading: loadingOrg } = useOrgStats();
  const { data: absences, isLoading: loadingAbsences } = useMemberAbsences();

  const isLoading = tab === "team" ? loadingOrg : loadingAbsences;

  return (
    <div className="flex flex-col gap-6 p-6 pb-24">
      <h1 className="text-xl font-semibold text-foreground">
        Relatório do grupo
      </h1>

      <div className="flex gap-0 border-b border-border">
        <TabButton active={tab === "team"} onClick={() => setTab("team")}>
          Time
        </TabButton>
        <TabButton
          active={tab === "absences"}
          onClick={() => setTab("absences")}
        >
          Faltas
        </TabButton>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
      )}

      {!isLoading && tab === "team" && (
        <TeamRanking members={orgStats?.members ?? []} />
      )}

      {!isLoading && tab === "absences" && (
        <AbsencesList absences={absences ?? []} />
      )}
    </div>
  );
}

function TeamRanking({ members }: { members: MemberStatsEntry[] }) {
  const valid = members.filter((e) => !!e.member && !!e.stats);
  const sorted = [...valid].sort(
    (a, b) => b.stats.reliability_score - a.stats.reliability_score,
  );

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum dado ainda. Stats são calculados à meia-noite.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((entry, index) => {
        const displayName = entry.member.nickname ?? entry.member.user.name;
        const score = Math.round(entry.stats.reliability_score);

        return (
          <div
            key={entry.member.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
          >
            {/* Posição */}
            <span className="w-5 shrink-0 text-center text-sm text-muted-foreground">
              {index + 1}
            </span>

            {/* Avatar */}
            {entry.member.user.avatar_url ? (
              <img
                src={entry.member.user.avatar_url}
                alt={displayName}
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-pulse text-xs font-semibold text-white">
                {initials(displayName)}
              </div>
            )}

            {/* Nome + barra de score */}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {displayName}
              </p>
              <div className="mt-1">
                <ReliabilityScore
                  score={entry.stats.reliability_score}
                  size="sm"
                />
              </div>
            </div>

            {/* Score numérico */}
            <span
              className={`shrink-0 text-sm font-bold ${
                score >= 90
                  ? "text-success"
                  : score >= 70
                    ? "text-info"
                    : score >= 50
                      ? "text-warning"
                      : "text-pulse"
              }`}
            >
              {score}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function AbsencesList({ absences }: { absences: MemberAbsence[] }) {
  const valid = absences.filter((e) => !!e.member);
  const sorted = [...valid].sort((a, b) => b.absences - a.absences);

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma falta registrada ainda.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((entry) => (
        <div
          key={entry.member.id}
          className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm text-foreground">
              {entry.member.user.name}
            </p>
            {entry.justification && (
              <p className="mt-0.5 truncate text-xs italic text-muted-foreground">
                "{entry.justification}"
              </p>
            )}
          </div>
          <span
            className={`ml-4 shrink-0 text-sm font-semibold ${
              entry.absences >= 3 ? "text-pulse" : "text-muted-foreground"
            }`}
          >
            {entry.absences} {entry.absences === 1 ? "falta" : "faltas"}
          </span>
        </div>
      ))}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 text-sm font-medium transition border-b-2 ${
        active
          ? "border-pulse text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
