import { IUser } from '../entities/IUser';

export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(user: Partial<IUser>): Promise<IUser>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  findPaginated(query: any, skip: number, limit: number): Promise<IUser[]>;
  countDocuments(query: any): Promise<number>;
}
