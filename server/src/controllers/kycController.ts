import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { IKycService } from '../domain/services/IKycService';
import * as ERRORS from '../constants/errors';

@injectable()
export class KycController {
  constructor(
    @inject('IKycService') private kycService: IKycService
  ) {}

  uploadKycArtifacts = async (req: Request, res: Response) => {
    try { 
      const files = req.files as unknown as { [fieldname: string]: Express.Multer.File[] };
      const imageFile = files && files.image ? files.image[0] : undefined;
      const videoFile = files && files.video ? files.video[0] : undefined;

      const userId = (req as any).user.id;
      await this.kycService.uploadKycArtifacts(userId, imageFile, videoFile);

      res.status(200).json({ success: true, message: 'KYC data securely stored in AWS S3 and MongoDB keys updated.' });
    } catch (error: any) {
      console.error(error);
      if (error.message === 'No files uploaded') {
         return res.status(400).json({ success: false, error: ERRORS.KYC.NO_FILES });
      }
      res.status(500).json({ success: false, error: error.message || 'AWS Upload Error' });
    }
  };
}
