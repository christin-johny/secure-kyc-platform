import { injectable } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IUser } from '../../domain/entities/IUser';
import User from '../../models/User';

@injectable()
export class MongoUserRepository implements IUserRepository {
  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).lean() as unknown as IUser;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).select('+password').lean() as unknown as IUser;
  }

  async create(user: Partial<IUser>): Promise<IUser> {
    const newUser = await User.create(user);
    return newUser.toObject() as unknown as IUser;
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    const updated = await User.findByIdAndUpdate(id, user, { new: true, runValidators: true }).lean();
    return updated as unknown as IUser;
  }

  async findPaginated(query: any, skip: number, limit: number): Promise<IUser[]> {
    return User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password')
      .lean() as unknown as IUser[];
  }

  async countDocuments(query: any): Promise<number> {
    return User.countDocuments(query);
  }
}
