import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env.js';
import fs from 'fs';
import path from 'path';

if (ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
  });
}

export async function uploadFile(filePath: string, folder = 'resumes'): Promise<{ url: string; publicId: string }> {
  try {
    if (ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY) {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `ai_resume_analyzer/${folder}`,
        resource_type: 'auto',
      });
      return { url: result.secure_url, publicId: result.public_id };
    }
  } catch (err) {
    console.warn('Cloudinary upload skipped, using local storage fallback.', err);
  }

  // Local fallback logic
  const fileName = path.basename(filePath);
  const targetDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const destPath = path.join(targetDir, fileName);
  fs.copyFileSync(filePath, destPath);
  return {
    url: `/uploads/${fileName}`,
    publicId: `local_${fileName}`,
  };
}
