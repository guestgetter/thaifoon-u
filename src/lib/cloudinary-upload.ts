import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  fileName: string,
  folder: string = 'thaifoon-university'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${folder}/${folder}`,
        public_id: fileName.split('.')[0],
        resource_type: 'auto', // Handles images, videos, raw files automatically
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result!.secure_url)
        }
      }
    )

    uploadStream.end(fileBuffer)
  })
}

export async function deleteFromCloudinary(url: string): Promise<void> {
  // Extract public_id from Cloudinary URL
  const urlParts = url.split('/')
  const fileWithExt = urlParts[urlParts.length - 1]
  const publicId = fileWithExt.split('.')[0]
  const folder = urlParts.slice(-3, -1).join('/')

  await cloudinary.uploader.destroy(`${folder}/${publicId}`)
}