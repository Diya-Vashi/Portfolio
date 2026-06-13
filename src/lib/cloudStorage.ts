import { v2 as cloudinary } from 'cloudinary';

// Cloudinary automatically picks up the CLOUDINARY_URL environment variable.
// No need to call cloudinary.config() explicitly if CLOUDINARY_URL is set, 
// but we do it here just in case, though relying on the env var is standard.

export async function uploadMedia(
  fileBuffer: Buffer,
  folder: string = 'portfolio',
  mimeType?: string
): Promise<{ url: string; publicId: string; format: string; bytes: number; resourceType: string }> {
  return new Promise((resolve, reject) => {
    // If the file is a PDF, we MUST upload it as "raw" so it doesn't get corrupted as an image
    const isPdf = mimeType === 'application/pdf' || mimeType?.includes('pdf');
    const rType = isPdf ? 'raw' : 'auto';

    cloudinary.uploader
      .upload_stream({ folder, resource_type: rType }, (error, result) => {
        if (error || !result) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
          resourceType: result.resource_type,
        });
      })
      .end(fileBuffer);
  });
}

export async function deleteMedia(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Note: Cloudinary sometimes categorizes PDFs as 'image' depending on how they were uploaded, 
    // but destroying works best if we pass the correct type, or try a few.
    cloudinary.uploader.destroy(publicId, { resource_type: resourceType }, (error, result) => {
      if (error) return reject(error);
      resolve();
    });
  });
}
