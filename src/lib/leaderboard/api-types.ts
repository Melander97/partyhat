/**
 * What the public leaderboard exposes for each entry. Deliberately has no
 * `clientId` or `runId`: the client id is a per-browser identifier that
 * shouldn't be linkable across entries by strangers, and the run id is
 * only meaningful to the server's duplicate-submission check.
 */
export interface LeaderboardEntryDto {
  /** 1-based position in the current ordering. */
  rank: number;
  handle: string;
  streak: number;
  durationMs: number;
  /** ISO 8601 timestamp. */
  createdAt: string;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntryDto[];
}
