import { v2 as cloudinary } from 'cloudinary';
import { config } from '../configs/config.js';
import fs from 'fs/promises';

// FIX: Bypass SSL (Cloudinary, etc.)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export const uploadImage = async (filePath, fileName) => {
  try {
    const folder = config.cloudinary.folder;
    
    const normalizedFilePath = filePath.replace(/\\/g, '/');
    const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    
    const options = {
      public_id: fileNameWithoutExt,
      folder: folder,
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    };

    const result = await cloudinary.uploader.upload(normalizedFilePath, options);

    try {
      await fs.unlink(normalizedFilePath);
    } catch {
      console.warn('Warning: Could not delete local file:', normalizedFilePath);
    }

    if (result.error) {
      throw new Error(`Error uploading image: ${result.error.message}`);
    }

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error?.message || error);

    try {
      await fs.unlink(filePath);
    } catch {
      console.warn('Warning: Could not delete local file after upload error');
    }

    throw new Error(
      `Failed to upload image to Cloudinary: ${error?.message || ''}`
    );
  }
};

export const deleteImage = async (imagePath) => {
  try {
    if (!imagePath || imagePath === config.cloudinary.defaultAvatarPath) {
      return true;
    }

    const folder = config.cloudinary.folder;
    
    let publicId;
    if (imagePath.includes('cloudinary.com')) {
      const urlParts = imagePath.split('/upload/');
      if (urlParts.length > 1) {
        const pathAfterUpload = urlParts[1];
        const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
        publicId = pathWithoutVersion.replace(/\.[^/.]+$/, '');
      } else {
        publicId = imagePath;
      }
    } else {
      publicId = imagePath.includes('/')
        ? imagePath
        : `${folder}/${imagePath}`;
    }
    
    const result = await cloudinary.uploader.destroy(publicId);

    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};

export const getFullImageUrl = (imagePath) => {
  // ✅ FIX: Si no hay imagePath, retornar null en lugar de llamar a getDefaultAvatarUrl
  // Esto evita el loop infinito cuando defaultAvatarPath también es null/undefined
  if (!imagePath) {
    return null;
  }

  // Si ya es una URL completa de Cloudinary, retornarla directamente
  if (imagePath.startsWith('https://res.cloudinary.com/') || 
      imagePath.startsWith('http://res.cloudinary.com/')) {
    return imagePath;
  }

  // Si no es URL completa, construirla (para compatibilidad con datos antiguos)
  const baseUrl = config.cloudinary.baseUrl || `https://res.cloudinary.com/${config.cloudinary.cloudName}/image/upload/`;
  const folder = config.cloudinary.folder;

  const pathToUse = imagePath.includes('/')
    ? imagePath
    : `${folder}/${imagePath}`;

  return `${baseUrl}${pathToUse}`;
};

export const getDefaultAvatarUrl = () => {
  const defaultPath = config.cloudinary.defaultAvatarPath;
  
  // ✅ FIX: Si no hay defaultPath, retornar null en lugar de entrar en loop
  if (!defaultPath) {
    return null;
  }

  return getFullImageUrl(defaultPath);
};

export const getDefaultAvatarPath = () => {
  const defaultPath = config.cloudinary.defaultAvatarPath;
  if (defaultPath && defaultPath.includes('${')) {
    const folder = process.env.CLOUDINARY_FOLDER;
    const filename = process.env.CLOUDINARY_DEFAULT_AVATAR_FILENAME;
    if (folder || filename) {
      return [folder, filename].filter(Boolean).join('/');
    }
  }
  if (defaultPath && defaultPath.includes('/')) {
    return defaultPath.split('/').pop();
  }
  return defaultPath;
};

export default {
  uploadImage,
  deleteImage,
  getFullImageUrl,
  getDefaultAvatarUrl,
  getDefaultAvatarPath,
};