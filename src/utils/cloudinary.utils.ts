import { v2 as cloudinary } from 'cloudinary';
import env from './env.utils';
import { ValidationError } from './error.utils';

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];

export async function uploadFile(buffer: Buffer, mimetype: string): Promise<string> {
  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
    throw new ValidationError(
      'Unsupported file type. Only PNG, JPEG, JPG, and PDF files are allowed.'
    );
  }

  const isImage = mimetype.startsWith('image/');
  const resourceType = isImage ? 'image' : 'raw';
  const uploadOptions: any = {
    resource_type: resourceType,
  };

  // Apply transformations for images
  if (isImage) {
    uploadOptions.transformation = [
      { width: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
    ];
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
        if (!result?.secure_url) {
          return reject(new Error('Cloudinary upload failed: No secure URL returned'));
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}
