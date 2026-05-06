import { IUser } from '../entities/IUser';

export interface IPaginatedResult<T> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: T[];
}

export interface IUserService {
  getUsersPaginated(page?: number, limit?: number, search?: string): Promise<IPaginatedResult<IUser>>;
  getUserProfile(userId: string): Promise<IUser>;
}
