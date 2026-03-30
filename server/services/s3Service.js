const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');
const path = require('path');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

exports.uploadFileToS3 = async (fileBuffer, mimetype, originalName, folder = 'kyc') => {
  if (!BUCKET_NAME) throw new Error("AWS_BUCKET_NAME is not defined in .env");

  const randomSuffix = crypto.randomBytes(16).toString('hex');
  const extension = path.extname(originalName) || (mimetype.includes('video') ? '.webm' : '.jpg');
  const key = `${folder}/${Date.now()}-${randomSuffix}${extension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: mimetype,
  });

  await s3Client.send(command);
   
  return key; 
};
 
exports.getPresignedUrl = async (key) => {
  if (!key) return null;
  if (!BUCKET_NAME) return null;

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }); 
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error("Error generating AWS presigned URL:", error);
    return null;
  }
};
