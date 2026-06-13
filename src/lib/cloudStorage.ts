import { v2 as cloudinary } from 'cloudinary';

// Cloudinary automatically picks up the CLOUDINARY_URL environment variable.
// No need to call cloudinary.config() explicitly if CLOUDINARY_URL is set, 
// but we do it here just in case, though relying on the env var is standard.

export async function uploadMedia(
  fileBuffer: Buffer,
  folder: string = 'portfolio',
  mimeType?: string,
  fileName?: string
): Promise<{ url: string; publicId: string; format: string; bytes: number; resourceType: string }> {
  return new Promise((resolve, reject) => {
    const isPdf = mimeType === 'application/pdf' || mimeType?.includes('pdf') || fileName?.toLowerCase().endsWith('.pdf');
    
    // Cloudinary requires PDFs to be uploaded as 'image' resource_type 
    // to properly serve them with Content-Type: application/pdf for inline browser viewing.
    const uploadOptions: any = { 
      folder, 
      resource_type: isPdf ? 'image' : 'auto' 
    };

    if (isPdf) {
      // Force the format to pdf so Cloudinary knows it's a PDF stream
      uploadOptions.format = 'pdf';
      const safeName = fileName ? fileName.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.pdf$/i, '') : `resume_${Date.now()}`;
      uploadOptions.public_id = safeName;
    }

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
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
