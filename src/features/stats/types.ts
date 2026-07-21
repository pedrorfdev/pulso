export interface MemberStats {
  confirmed_on_time: number;
  confirmed_late: number;
  absences: number;
  deadline_misses: number;
  swaps_requested: number;
  swaps_accepted: number;
  reliability_score: number;
}

export interface MemberStatsEntry {
  member: {
    id: string;
    nickname: string | null;
    user: {
      name: string;
      avatar_url: string | null;
    };
  };
  stats: MemberStats;
}

export interface OrgStatsReport {
  members: MemberStatsEntry[];
}

export interface MemberAbsence {
  member: {
    id: string;
    user: {
      name: string;
      avatar_url: string | null;
    };
  };
  absences: number;
  justification: string | null;
}
