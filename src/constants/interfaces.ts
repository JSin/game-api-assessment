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
