import { injectable, inject } from 'tsyringe';
import { IKycService } from '../domain/services/IKycService';
import { IS3Service } from '../domain/services/IS3Service';
import { IUserRepository } from '../domain/repositories/IUserRepository';

@injectable()
export class KycService implements IKycService {
  constructor(
    @inject('IS3Service') private s3Service: IS3Service,
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  async uploadKycArtifacts(userId: string, imageFile?: Express.Multer.File, videoFile?: Express.Multer.File): Promise<void> {
    if (!imageFile && !videoFile) {
      throw new Error('No files uploaded');
    }

    const updates: any = {};

    if (imageFile) {
      const imageKey = await this.s3Service.uploadFileToS3(
        imageFile.buffer, 
        imageFile.mimetype, 
        imageFile.originalname, 
        'kyc/images'
      );
      updates.kycImageKey = imageKey;
    }

    if (videoFile) {
      const videoKey = await this.s3Service.uploadFileToS3(
        videoFile.buffer, 
        videoFile.mimetype, 
        videoFile.originalname, 
        'kyc/videos'
      );
      updates.kycVideoKey = videoKey;
    }

    await this.userRepository.update(userId, updates);
  }
}
