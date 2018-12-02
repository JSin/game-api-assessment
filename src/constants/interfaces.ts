export interface TransactionRequest {
  TransactionId: number;
  UserId: number;
  CurrencyAmount: number;
  Verifier: string;
}

export interface TransactionStatsRequest {
  UserId: number;
}

export interface TransactionStatsResponse {
  UserId: number;
  TransactionCount: number;
  CurrencySum: number;
}

export interface SuccessResponse {
  Success: true;
}

export interface ErrorResponse {
  Error: boolean;
  ErrorMessage: string;
}

export interface ScorePostRequest {
  UserId: number;
  LeaderboardId: number;
  Score: number;
}

export interface ScorePostResponse {
  UserId: number;
  LeaderboardId: number;
  Score: number;
  Rank: number;
}

export interface LeaderboardGetRequest {
  UserId: number;
  LeaderboardId: number;
  Offset: number;
  Limit: number;
}

export interface LeaderboardGetResponse extends ScorePostResponse {
  Entries: LeaderboardEntries[];
}

export interface LeaderboardEntries {
  UserId: number;
  Score: number;
  Rank: number;
}

export interface UserSaveRequest {
  UserId: number;
  Data: any;
}

export interface UserLoadRequest {
  UserId: number;
}
