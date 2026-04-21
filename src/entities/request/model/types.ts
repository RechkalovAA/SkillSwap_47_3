// src/entities/request/model/types.ts
export type RequestStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'inProgress'
  | 'done';

export interface ExchangeRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  skillId: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExchangeRequestDTO {
  fromUserId: string;
  toUserId: string;
  skillId: string;
}

export const TERMINAL_REQUEST_STATUSES: RequestStatus[] = ['rejected', 'done'];
