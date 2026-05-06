export interface IKycService {
  uploadKycArtifacts(userId: string, imageFile?: Express.Multer.File, videoFile?: Express.Multer.File): Promise<void>;
}
