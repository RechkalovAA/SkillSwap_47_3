import type {
  CreateExchangeRequestDTO,
  ExchangeRequest,
  RequestStatus,
} from '../model/types';

export const REQUESTS_STORAGE_KEY = 'exchange_requests';

const ACTIVE_REQUEST_STATUSES: RequestStatus[] = [
  'pending',
  'accepted',
  'inProgress',
];

function normalizeStatus(status: string): RequestStatus {
  if (status === 'pending') return 'pending';
  if (status === 'accepted') return 'accepted';
  if (status === 'inProgress') return 'inProgress';
  if (status === 'done') return 'done';
  return 'rejected';
}

function normalizeRequest(raw: ExchangeRequest): ExchangeRequest {
  return {
    ...raw,
    status: normalizeStatus(raw.status),
  };
}

function readRequestsFromStorage(): ExchangeRequest[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as ExchangeRequest[];
    return parsed.map(normalizeRequest);
  } catch {
    localStorage.removeItem(REQUESTS_STORAGE_KEY);
    return [];
  }
}

function writeRequestsToStorage(requests: ExchangeRequest[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
}

export function createExchangeRequest(
  dto: CreateExchangeRequestDTO,
): ExchangeRequest {
  const requests = readRequestsFromStorage();

  const newRequest: ExchangeRequest = {
    id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    fromUserId: dto.fromUserId,
    toUserId: dto.toUserId,
    skillId: dto.skillId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  requests.push(newRequest);
  writeRequestsToStorage(requests);

  return newRequest;
}

export function getRequestsByUser(userId: string): ExchangeRequest[] {
  const requests = readRequestsFromStorage();
  return requests.filter(
    (req) => req.fromUserId === userId || req.toUserId === userId,
  );
}

export function getIncomingRequests(userId: string): ExchangeRequest[] {
  const requests = getRequestsByUser(userId);
  return requests.filter((req) => req.toUserId === userId);
}

export function getOutgoingRequests(userId: string): ExchangeRequest[] {
  const requests = getRequestsByUser(userId);
  return requests.filter((req) => req.fromUserId === userId);
}

export function getExchangeRequests(userId: string): ExchangeRequest[] {
  const requests = getRequestsByUser(userId);
  return requests.filter(
    (req) =>
      req.status === 'accepted' ||
      req.status === 'inProgress' ||
      req.status === 'done',
  );
}

export function getRequestBySkillAndUsers(
  skillId: string,
  fromUserId: string,
  toUserId: string,
): ExchangeRequest | undefined {
  const requests = readRequestsFromStorage();
  return requests.find(
    (req) =>
      req.skillId === skillId &&
      req.fromUserId === fromUserId &&
      req.toUserId === toUserId,
  );
}

export function hasActiveRequest(
  skillId: string,
  fromUserId: string,
  toUserId: string,
): boolean {
  const request = getRequestBySkillAndUsers(skillId, fromUserId, toUserId);
  return Boolean(request && ACTIVE_REQUEST_STATUSES.includes(request.status));
}

function canTransitionRequestStatus(
  request: ExchangeRequest,
  actorUserId: string,
  nextStatus: RequestStatus,
): boolean {
  const isRequester = request.fromUserId === actorUserId;
  const isSkillOwner = request.toUserId === actorUserId;
  const isParticipant = isRequester || isSkillOwner;

  if (!isParticipant) {
    return false;
  }

  if (request.status === 'pending') {
    return (
      isSkillOwner && (nextStatus === 'accepted' || nextStatus === 'rejected')
    );
  }

  if (request.status === 'accepted') {
    return nextStatus === 'inProgress';
  }

  if (request.status === 'inProgress') {
    return nextStatus === 'done';
  }

  return false;
}

export function updateExchangeRequestStatus(
  requestId: string,
  actorUserId: string,
  nextStatus: RequestStatus,
): ExchangeRequest | null {
  const requests = readRequestsFromStorage();
  const requestIndex = requests.findIndex((req) => req.id === requestId);

  if (requestIndex < 0) {
    return null;
  }

  const request = requests[requestIndex];

  if (!canTransitionRequestStatus(request, actorUserId, nextStatus)) {
    return null;
  }

  const updated: ExchangeRequest = {
    ...request,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };

  requests[requestIndex] = updated;
  writeRequestsToStorage(requests);
  return updated;
}

export function removeExchangeRequest(
  requestId: string,
  actorUserId: string,
): boolean {
  const requests = readRequestsFromStorage();
  const request = requests.find((item) => item.id === requestId);

  if (!request) {
    return false;
  }

  const canDeletePendingOutgoing =
    request.status === 'pending' && request.fromUserId === actorUserId;

  if (!canDeletePendingOutgoing) {
    return false;
  }

  const filtered = requests.filter((item) => item.id !== requestId);
  writeRequestsToStorage(filtered);
  return true;
}
