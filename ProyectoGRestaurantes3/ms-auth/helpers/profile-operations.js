import { findUserById } from './user-db.js';
import { buildUserResponse } from '../utils/user-helpers.js';
import { UserProfile } from '../src/users/user.model.js';
import { uploadImage } from './cloudinary-service.js';

export const getUserProfileHelper = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  return buildUserResponse(user);
};

export const updateProfilePictureHelper = async (userId, file) => {
  const user = await findUserById(userId);
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  // Subir imagen a Cloudinary
  const url = await uploadImage(file.path, file.filename);
  // Actualizar en PostgreSQL
  await UserProfile.update(
    { ProfilePicture: url },
    { where: { UserId: userId } }
  );
  // Refrescar datos y devolver perfil actualizado
  const updated = await findUserById(userId);
  return buildUserResponse(updated);
};