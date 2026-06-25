import { useState } from "react";
import { useOrgStats } from "../hooks/use-stats";
import { useMemberAbsences } from "../hooks/use-stats";
import { ReliabilityScore } from "./reliability-score";
import type { MemberStatsEntry } from "../types";

export function OrgStatsPage() {
  const [tab, setTab] = useState<"team" | "absences">("team");
  const { data: orgStats, isLoading: loadingOrg } = useOrgStats();
  const { data: absences, isLoading: loadingAbsences } = useMemberAbsences();

  const isLoading = tab === "team" ? loadingOrg : loadingAbsences;

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold text-foreground">
        Relatório do grupo
      </h1>

      <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
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
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
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
  // Guard: filtra entradas sem member (shape inesperado da API)
  const valid = members.filter((e) => !!e.member);
  const sorted = [...valid].sort(
    (a, b) => b.stats.reliabilityScore - a.stats.reliabilityScore,
  );

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum dado ainda. Os stats são calculados à meia-noite.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((entry, index) => {
        const displayName = entry.member.nickname ?? entry.member.name ?? "—";
        const initials = displayName
          .split(" ")
          .slice(0, 2)
          .map((p: string) => p[0]?.toUpperCase() ?? "")
          .join("");

        return (
          <div
            key={entry.member.id}
            className="flex items-center gap-4 rounded-xl border border-border bg-surface px-4 py-3"
          >
            <span className="w-5 text-center text-sm text-muted-foreground">
              {index + 1}
            </span>

            {/* Avatar */}
            {entry.member.avatarUrl ? (
              <img
                src={entry.member.avatarUrl}
                alt={displayName}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-pulse text-xs font-medium text-white">
                {initials}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {displayName}
              </p>
              <div className="mt-1">
                <ReliabilityScore
                  score={entry.stats.reliabilityScore}
                  size="sm"
                />
              </div>
            </div>

            <span className="text-sm font-semibold text-foreground">
              {Math.round(entry.stats.reliabilityScore)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function AbsencesList({
  absences,
}: {
  absences: {
    member: { id: string; name: string } | null;
    absences: number;
    justification: string | null;
  }[];
}) {
  const valid = absences.filter((e) => !!e.member);

  if (valid.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma falta registrada ainda.
      </p>
    );
  }

  const sorted = [...valid].sort((a, b) => b.absences - a.absences);

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((entry) => (
        <div
          key={entry.member!.id}
          className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
        >
          <div>
            <p className="text-sm text-foreground">{entry.member!.name}</p>
            {entry.justification && (
              <p className="text-xs italic text-muted-foreground">
                "{entry.justification}"
              </p>
            )}
          </div>
          <span
            className={`text-sm font-semibold ${
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
      className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
        active ? "bg-background text-foreground" : "text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}
