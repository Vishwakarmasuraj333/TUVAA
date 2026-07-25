import { v2 as cloudinary } from 'cloudinary';

// TUVAA uses the same Cloudinary account but stores all assets in tuvaa/gallery folder.
// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 1200000,
});

/**
 * Upload a buffer file to Cloudinary
 * @param fileBuffer The file buffer
 * @param folder The target folder in Cloudinary
 * @param resourceType The type of resource ('image' or 'video' or 'auto')
 * @returns Upload result object
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = 'tuvaa/gallery',
  resourceType: 'image' | 'video' | 'auto' = 'auto'
) {
  return new Promise((resolve, reject) => {
    const isLarge = resourceType === 'video';
    const uploadMethod = isLarge ? cloudinary.uploader.upload_chunked_stream : cloudinary.uploader.upload_stream;
    
    const uploadStream = uploadMethod(
      {
        folder,
        resource_type: resourceType,
        timeout: 1200000, // 20 minutes timeout for large videos
        ...(isLarge && { chunk_size: 6000000 })
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export async function deleteFromCloudinary(publicId: string, resourceType: 'image' | 'video' = 'image') {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: resourceType },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
  });
}
