import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  useMyProfile,
  useMemberProfile,
  useUpdateNickname,
} from "../hooks/use-profile";
import type { MemberProfile } from "../hooks/use-profile";

export function MyProfilePage() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useMyProfile();

  return (
    <ProfileShell
      profile={profile ?? null}
      isLoading={isLoading}
      isOwnProfile
      onBack={() => navigate({ to: "/dashboard" })}
    />
  );
}

export function MemberProfilePage() {
  const navigate = useNavigate();
  const { memberId } = useParams({ strict: false }) as { memberId: string };
  const { data: profile, isLoading } = useMemberProfile(memberId);

  return (
    <ProfileShell
      profile={profile ?? null}
      isLoading={isLoading}
      isOwnProfile={false}
      onBack={() => navigate({ to: "/team" })}
    />
  );
}

function ProfileShell({
  profile,
  isLoading,
  isOwnProfile,
  onBack,
}: {
  profile: MemberProfile | null;
  isLoading: boolean;
  isOwnProfile: boolean;
  onBack: () => void;
}) {
  if (isLoading) return <ProfileSkeleton onBack={onBack} />;
  if (!profile) return <ProfileNotFound onBack={onBack} />;

  return (
    <div className="flex flex-col pb-24">
      <ProfileHero
        profile={profile}
        isOwnProfile={isOwnProfile}
        onBack={onBack}
      />
      {profile.stats && <StatsRow stats={profile.stats} />}
      <HistoryTimeline history={profile.history} />
    </div>
  );
}

function ProfileHero({
  profile,
  isOwnProfile,
  onBack,
}: {
  profile: MemberProfile;
  isOwnProfile: boolean;
  onBack: () => void;
}) {
  const [editingNick, setEditingNick] = useState(false);
  const [nickValue, setNickValue] = useState(profile.nickname ?? "");
  const { mutate: updateNick, isPending } = useUpdateNickname();

  const displayName = profile.nickname ?? profile.user.name;
  const score = profile.stats?.reliability_score ?? null;

  function saveNick() {
    if (!nickValue.trim()) return;
    updateNick(nickValue.trim(), { onSuccess: () => setEditingNick(false) });
  }

  return (
    <div className="relative overflow-hidden px-4 pb-6 pt-12">
      {/* Gradiente de fundo atrás do hero */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-pulse/20 via-background/60 to-background" />

      {/* Botão voltar */}
      <button
        onClick={onBack}
        className="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface/80 text-muted-foreground backdrop-blur-sm"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 4L6 8l4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="relative flex flex-col items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          {profile.user.avatar_url ? (
            <img
              src={profile.user.avatar_url}
              alt={displayName}
              className="h-20 w-20 rounded-full object-cover ring-2 ring-pulse/40 ring-offset-2 ring-offset-background"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-pulse text-2xl font-bold text-white ring-2 ring-pulse/40 ring-offset-2 ring-offset-background">
              {initials(displayName)}
            </div>
          )}

          {/* Score arc sobre o avatar */}
          {score !== null && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <ScorePill score={score} />
            </div>
          )}
        </div>

        {/* Nome / nickname */}
        <div className="mt-3 flex flex-col items-center gap-1">
          {editingNick ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={nickValue}
                onChange={(e) => setNickValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveNick()}
                className="rounded-lg border border-pulse bg-surface px-3 py-1 text-center text-lg font-semibold text-foreground outline-none"
              />
              <button
                onClick={saveNick}
                disabled={isPending}
                className="rounded-lg bg-pulse px-3 py-1 text-sm font-medium text-white disabled:opacity-50"
              >
                {isPending ? "..." : "Ok"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground">
                {displayName}
              </h1>
              {isOwnProfile && (
                <button
                  onClick={() => setEditingNick(true)}
                  className="text-muted-foreground/60 hover:text-muted-foreground transition"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          <p className="text-sm text-muted-foreground">{profile.user.email}</p>

          <RoleBadge role={profile.role} />
        </div>
      </div>
    </div>
  );
}

// ── Score pill pequeno ────────────────────────────────────────────────────────

function ScorePill({ score }: { score: number }) {
  const color =
    score >= 90
      ? "text-success bg-success/10 border-success/30"
      : score >= 70
        ? "text-info bg-info/10 border-info/30"
        : score >= 50
          ? "text-warning bg-warning/10 border-warning/30"
          : "text-pulse bg-pulse/10 border-pulse/30";

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${color}`}
    >
      {Math.round(score)}%
    </span>
  );
}

// ── Row de stats ──────────────────────────────────────────────────────────────

function StatsRow({ stats }: { stats: MemberProfile["stats"] }) {
  if (!stats) return null;

  const items = [
    {
      label: "Confirmações",
      value: stats.confirmed_on_time + stats.confirmed_late,
      color: "text-success",
    },
    {
      label: "Faltas",
      value: stats.absences,
      color: stats.absences > 3 ? "text-pulse" : "text-muted-foreground",
    },
    {
      label: "Trocas pedidas",
      value: stats.swaps_requested,
      color: "text-info",
    },
    { label: "Coberturas", value: stats.swaps_accepted, color: "text-info" },
  ];

  return (
    <div className="mx-4 mb-4 grid grid-cols-4 gap-2">
      {items.map(({ label, value, color }) => (
        <div
          key={label}
          className="flex flex-col items-center rounded-xl border border-border bg-surface py-3"
        >
          <span className={`text-xl font-bold ${color}`}>{value}</span>
          <span className="mt-0.5 text-center text-[10px] leading-tight text-muted-foreground">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Timeline de histórico ─────────────────────────────────────────────────────

function HistoryTimeline({ history }: { history: MemberProfile["history"] }) {
  if (history.length === 0) {
    return (
      <div className="mx-4 rounded-xl border border-border bg-surface p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Nenhum evento no histórico ainda.
        </p>
      </div>
    );
  }

  // Mais recentes primeiro
  const sorted = [...history].sort(
    (a, b) =>
      new Date(b.event.starts_at).getTime() -
      new Date(a.event.starts_at).getTime(),
  );

  return (
    <div className="px-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Histórico
      </p>
      <div className="flex flex-col">
        {sorted.map((entry, idx) => (
          <HistoryEntry
            key={entry.event.id + idx}
            entry={entry}
            isLast={idx === sorted.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function HistoryEntry({
  entry,
  isLast,
}: {
  entry: MemberProfile["history"][number];
  isLast: boolean;
}) {
  const status = entry.attendance?.status ?? "PENDING";
  const config =
    ATTENDANCE_CONFIG[status as keyof typeof ATTENDANCE_CONFIG] ??
    ATTENDANCE_CONFIG.PENDING;

  return (
    <div className="flex gap-3">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center">
        <div
          className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${config.dotClass}`}
        >
          {config.icon}
        </div>
        {!isLast && <div className="w-px flex-1 bg-border" />}
      </div>

      {/* Conteúdo */}
      <div className={`flex-1 pb-4 ${isLast ? "" : "mb-0"}`}>
        <div className="rounded-xl border border-border bg-surface px-3 py-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {entry.event.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(entry.event.starts_at)}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${config.badgeClass}`}
            >
              {config.label}
            </span>
          </div>

          {/* Funções */}
          {entry.role_labels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {entry.role_labels.map((r) => (
                <span
                  key={r}
                  className="rounded-full bg-border px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {r}
                </span>
              ))}
            </div>
          )}

          {/* Justificativa */}
          {entry.attendance?.justification && (
            <p className="mt-1.5 text-xs italic text-muted-foreground">
              "{entry.attendance.justification}"
            </p>
          )}

          {/* Swap */}
          {entry.swap && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-xs text-info">
                {entry.swap.was_requester ? "↔ Pediu troca" : "↔ Cobriu alguém"}
              </span>
              <span
                className={`text-xs ${SWAP_STATUS_COLOR[entry.swap.status] ?? "text-muted-foreground"}`}
              >
                · {SWAP_STATUS_LABEL[entry.swap.status] ?? entry.swap.status}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Configs visuais ───────────────────────────────────────────────────────────

const ATTENDANCE_CONFIG = {
  CONFIRMED: {
    label: "Confirmou",
    dotClass: "border-success/40 bg-success/10 text-success",
    badgeClass: "bg-success/10 text-success",
    icon: <CheckIcon />,
  },
  PENDING: {
    label: "Aguardando",
    dotClass: "border-warning/40 bg-warning/10 text-warning",
    badgeClass: "bg-warning/10 text-warning",
    icon: <ClockIcon />,
  },
  DECLINED: {
    label: "Não foi",
    dotClass: "border-border bg-surface text-muted-foreground",
    badgeClass: "bg-border text-muted-foreground",
    icon: <XIcon />,
  },
  DEADLINE_MISSED: {
    label: "Sem resposta",
    dotClass: "border-pulse/40 bg-pulse/10 text-pulse",
    badgeClass: "bg-pulse/10 text-pulse",
    icon: <XIcon />,
  },
};

const SWAP_STATUS_LABEL: Record<string, string> = {
  APPROVED: "aprovada",
  PENDING_OPEN: "aberta",
  PENDING_LEADER: "aguardando líder",
  CANCELLED: "cancelada",
};

const SWAP_STATUS_COLOR: Record<string, string> = {
  APPROVED: "text-success",
  PENDING_OPEN: "text-warning",
  PENDING_LEADER: "text-info",
  CANCELLED: "text-muted-foreground",
};

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  LEADER: "Líder",
  MEMBER: "Membro",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function RoleBadge({ role }: { role: string }) {
  const isLeader = role === "ADMIN" || role === "LEADER";
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${isLeader ? "bg-pulse/10 text-pulse" : "bg-border text-muted-foreground"}`}
    >
      {ROLE_LABEL[role] ?? role}
    </span>
  );
}

// ── Micro ícones inline ───────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M2 6l3 3 5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M3 3l6 6M9 3l-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M6 4v2.5l1.5 1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Skeleton / not found ──────────────────────────────────────────────────────

function ProfileSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <button
        onClick={onBack}
        className="h-8 w-8 rounded-full bg-surface animate-pulse"
      />
      <div className="flex flex-col items-center gap-3">
        <div className="h-20 w-20 rounded-full bg-surface animate-pulse" />
        <div className="h-4 w-32 rounded bg-surface animate-pulse" />
        <div className="h-3 w-48 rounded bg-surface animate-pulse" />
      </div>
    </div>
  );
}

function ProfileNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <p className="text-muted-foreground">Perfil não encontrado.</p>
      <button onClick={onBack} className="text-pulse text-sm">
        Voltar
      </button>
    </div>
  );
}
