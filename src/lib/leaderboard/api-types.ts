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

/** Body of POST /api/leaderboard/submit. */
export interface SubmitRequestBody {
  /** The signed receipt from the run's final /api/game/guess response. */
  receipt: string;
  /** Raw, unvalidated handle. The server validates and normalizes it. */
  handle: string;
  /** The anonymous per-browser id from useClientId. */
  clientId: string;
}

export interface SubmitResponse {
  /** 1-based position of the submitted run in the current ordering. */
  rank: number;
  /** The handle as stored, after trimming and space-collapsing. */
  handle: string;
  streak: number;
  durationMs: number;
}

export interface SubmitErrorResponse {
  error: string;
}
