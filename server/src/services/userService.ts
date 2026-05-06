import { injectable, inject } from 'tsyringe';
import { IUserService, IPaginatedResult } from '../domain/services/IUserService';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IS3Service } from '../domain/services/IS3Service';
import { IUser } from '../domain/entities/IUser';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('IS3Service') private s3Service: IS3Service
  ) {}

  async getUsersPaginated(page = 1, limit = 5, search = ''): Promise<IPaginatedResult<IUser>> {
    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    };
    
    const startIndex = (page - 1) * limit;
    const total = await this.userRepository.countDocuments(query);
    const users = await this.userRepository.findPaginated(query, startIndex, limit);

    const usersWithS3Urls = await Promise.all(users.map(async (user) => {
      let imageUrl: string | null = null;
      let videoUrl: string | null = null;
      
      if (user.kycImageKey) {
         imageUrl = await this.s3Service.getPresignedUrl(user.kycImageKey);
      }
      if (user.kycVideoKey) {
         videoUrl = await this.s3Service.getPresignedUrl(user.kycVideoKey);
      }

      return {
        ...user,
        kycImageUrl: imageUrl,
        kycVideoUrl: videoUrl
      } as IUser;
    }));

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      data: usersWithS3Urls
    };
  }

  async getUserProfile(userId: string): Promise<IUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    
    let imageUrl: string | null = null;
    let videoUrl: string | null = null;
    
    if (user.kycImageKey) {
       imageUrl = await this.s3Service.getPresignedUrl(user.kycImageKey);
    }
    if (user.kycVideoKey) {
       videoUrl = await this.s3Service.getPresignedUrl(user.kycVideoKey);
    }

    return {
      ...user,
      kycImageUrl: imageUrl,
      kycVideoUrl: videoUrl
    } as IUser;
  }
}
