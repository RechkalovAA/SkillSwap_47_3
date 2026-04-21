// src/features/requests/hooks/useExchangeRequest.ts
import { useState, useCallback } from 'react';
import {
  createExchangeRequest,
  hasActiveRequest,
  getRequestBySkillAndUsers,
  getRequestsByUser,
  getIncomingRequests,
  getOutgoingRequests,
  getExchangeRequests,
  updateExchangeRequestStatus,
  removeExchangeRequest,
} from '../api/requestsApi';
import type { ExchangeRequest, RequestStatus } from '../model/types';

interface UseExchangeRequestReturn {
  createRequest: (
    fromUserId: string,
    toUserId: string,
    skillId: string,
  ) => ExchangeRequest | null;
  hasActiveRequestForSkill: (
    skillId: string,
    fromUserId: string,
    toUserId: string,
  ) => boolean;
  getUserRequests: (userId: string) => ExchangeRequest[];
  getIncomingRequestsForUser: (userId: string) => ExchangeRequest[];
  getOutgoingRequestsForUser: (userId: string) => ExchangeRequest[];
  getExchangeRequestsForUser: (userId: string) => ExchangeRequest[];
  updateRequestStatus: (
    requestId: string,
    actorUserId: string,
    status: RequestStatus,
  ) => ExchangeRequest | null;
  removeRequest: (requestId: string, actorUserId: string) => boolean;
  isLoading: boolean;
  error: string | null;
}

export function useExchangeRequest(): UseExchangeRequestReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = useCallback(
    (
      fromUserId: string,
      toUserId: string,
      skillId: string,
    ): ExchangeRequest | null => {
      setIsLoading(true);
      setError(null);

      try {
        const existingRequest = getRequestBySkillAndUsers(
          skillId,
          fromUserId,
          toUserId,
        );
        if (
          existingRequest &&
          (existingRequest.status === 'pending' ||
            existingRequest.status === 'accepted' ||
            existingRequest.status === 'inProgress')
        ) {
          setError('Заявка уже отправлена');
          return null;
        }

        const newRequest = createExchangeRequest({
          fromUserId,
          toUserId,
          skillId,
        });

        return newRequest;
      } catch (err) {
        setError('Не удалось создать заявку');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const hasActiveRequestForSkill = useCallback(
    (skillId: string, fromUserId: string, toUserId: string): boolean =>
      hasActiveRequest(skillId, fromUserId, toUserId),
    [],
  );

  const getUserRequests = useCallback(
    (userId: string): ExchangeRequest[] => getRequestsByUser(userId),
    [],
  );

  const getIncomingRequestsForUser = useCallback(
    (userId: string): ExchangeRequest[] => getIncomingRequests(userId),
    [],
  );

  const getOutgoingRequestsForUser = useCallback(
    (userId: string): ExchangeRequest[] => getOutgoingRequests(userId),
    [],
  );

  const getExchangeRequestsForUser = useCallback(
    (userId: string): ExchangeRequest[] => getExchangeRequests(userId),
    [],
  );

  const updateRequestStatus = useCallback(
    (
      requestId: string,
      actorUserId: string,
      status: RequestStatus,
    ): ExchangeRequest | null => {
      setIsLoading(true);
      setError(null);

      try {
        const updated = updateExchangeRequestStatus(
          requestId,
          actorUserId,
          status,
        );
        if (!updated) {
          setError('Не удалось обновить статус заявки');
          return null;
        }
        return updated;
      } catch {
        setError('Не удалось обновить статус заявки');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const removeRequest = useCallback(
    (requestId: string, actorUserId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const removed = removeExchangeRequest(requestId, actorUserId);
        if (!removed) {
          setError('Не удалось удалить заявку');
          return false;
        }
        return true;
      } catch {
        setError('Не удалось удалить заявку');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    createRequest,
    hasActiveRequestForSkill,
    getUserRequests,
    getIncomingRequestsForUser,
    getOutgoingRequestsForUser,
    getExchangeRequestsForUser,
    updateRequestStatus,
    removeRequest,
    isLoading,
    error,
  };
}
