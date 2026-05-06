export interface IS3Service {
  uploadFileToS3(fileBuffer: Buffer, mimetype: string, originalName: string, folder?: string): Promise<string>;
  getPresignedUrl(key: string): Promise<string | null>;
}
