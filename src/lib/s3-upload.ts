import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!

export async function uploadToS3(
  file: Buffer, 
  fileName: string, 
  contentType: string,
  folder: string = 'uploads'
): Promise<string> {
  const key = `${folder}/${Date.now()}-${fileName}`

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read', // Make files publicly accessible
  })

  await s3Client.send(command)
  
  // Return the public URL
  return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`
}

export async function deleteFromS3(url: string): Promise<void> {
  // Extract key from URL
  const urlParts = url.split('.s3.amazonaws.com/')
  if (urlParts.length !== 2) return
  
  const key = urlParts[1]

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  await s3Client.send(command)
}