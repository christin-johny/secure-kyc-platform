import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import * as path from 'path';
import { injectable } from 'tsyringe';
import { IS3Service } from '../domain/services/IS3Service';

@injectable()
export class S3Service implements IS3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
      }
    });
    this.bucketName = process.env.AWS_BUCKET_NAME || '';
  }

  async uploadFileToS3(fileBuffer: Buffer, mimetype: string, originalName: string, folder = 'kyc'): Promise<string> {
    if (!this.bucketName) throw new Error("AWS_BUCKET_NAME is not defined in .env");

    const randomSuffix = crypto.randomBytes(16).toString('hex');
    const extension = path.extname(originalName) || (mimetype.includes('video') ? '.webm' : '.jpg');
    const key = `${folder}/${Date.now()}-${randomSuffix}${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimetype,
    });

    await this.s3Client.send(command);
    return key; 
  }
   
  async getPresignedUrl(key: string): Promise<string | null> {
    if (!key) return null;
    if (!this.bucketName) return null;

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }); 
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      return url;
    } catch (error) {
      console.error("Error generating AWS presigned URL:", error);
      return null;
    }
  }
}
