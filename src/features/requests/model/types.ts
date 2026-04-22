import type { ExchangeRequest as BaseExchangeRequest } from '../../../entities/request/model/types';

export type {
  RequestStatus,
  ExchangeRequest,
  CreateExchangeRequestDTO,
} from '../../../entities/request/model/types';

export interface ExchangeRequestWithUser extends BaseExchangeRequest {
  fromUserName?: string;
  toUserName?: string;
  skillName?: string;
}
