import { User } from '../../../entities/user/model/types';

export type AuthUser = Omit<User, 'password'>;
