import {
  registerUserHelper,
  loginUserHelper,
  verifyEmailHelper,
  resendVerificationEmailHelper,
  forgotPasswordHelper,
  resetPasswordHelper,
} from '../../helpers/auth-operations.js';
import { getUserProfileHelper } from '../../helpers/profile-operations.js';
import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import { UserProfile } from '../users/user.model.js';
import { uploadImage, deleteImage } from '../../helpers/cloudinary-service.js';
import { findUserById } from '../../helpers/user-db.js';
import path from 'path';
import crypto from 'crypto';

export const register = asyncHandler(async (req, res) => {
  try {
    // Agregar la imagen de perfil si fue subida
    const userData = {
      ...req.body,
      profilePicture: req.file ? req.file.path : null,
    };

    const result = await registerUserHelper(userData);

    res.status(201).json(result);
  } catch (error) {
    console.error('Error in register controller:', error);

    let statusCode = 400;
    if (
      error.message.includes('ya está registrado') ||
      error.message.includes('ya está en uso') ||
      error.message.includes('Ya existe un usuario')
    ) {
      statusCode = 409; // Conflict
    }

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error en el registro',
      error: error.message,
    });
  }
});

export const login = asyncHandler(async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    const result = await loginUserHelper(emailOrUsername, password);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in login controller:', error);

    let statusCode = 401;
    if (
      error.message.includes('bloqueada') ||
      error.message.includes('desactivada')
    ) {
      statusCode = 423; // Locked
    }

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error en el login',
      error: error.message,
    });
  }
});

export const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const { token } = req.body;
    const result = await verifyEmailHelper(token);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in verifyEmail controller:', error);

    let statusCode = 400;
    if (error.message.includes('no encontrado')) {
      statusCode = 404;
    } else if (
      error.message.includes('inválido') ||
      error.message.includes('expirado')
    ) {
      statusCode = 401;
    }

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error en la verificación',
      error: error.message,
    });
  }
});

export const resendVerification = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const result = await resendVerificationEmailHelper(email);

    // Check result.success to determine status code
    if (!result.success) {
      if (result.message.includes('no encontrado')) {
        return res.status(404).json(result);
      }
      if (result.message.includes('ya ha sido verificado')) {
        return res.status(400).json(result);
      }
      // Email sending failed
      return res.status(503).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in resendVerification controller:', error);

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
});

export const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const result = await forgotPasswordHelper(email);

    // forgotPassword always returns success for security, even if user not found
    // But if email sending fails, we should return 503
    if (!result.success && result.data?.initiated === false) {
      return res.status(503).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in forgotPassword controller:', error);

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await resetPasswordHelper(token, newPassword);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in resetPassword controller:', error);

    let statusCode = 400;
    if (error.message.includes('no encontrado')) {
      statusCode = 404;
    } else if (
      error.message.includes('inválido') ||
      error.message.includes('expirado')
    ) {
      statusCode = 401;
    }

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error al resetear contraseña',
      error: error.message,
    });
  }
});

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.userId; // Viene del middleware validateJWT
  const user = await getUserProfileHelper(userId);

  // Respuesta estandarizada con envelope
  return res.status(200).json({
    success: true,
    message: 'Perfil obtenido exitosamente',
    data: user,
  });
});

export const getProfileById = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'El userId es requerido',
    });
  }

  const user = await getUserProfileHelper(userId);

  // Respuesta estandarizada con envelope
  return res.status(200).json({
    success: true,
    message: 'Perfil obtenido exitosamente',
    data: user,
  });
});

export const updateProfilePicture = asyncHandler(async (req, res) => {
  const userId = req.userId;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No se proporcionó ninguna imagen',
    });
  }

  const user = await findUserById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado',
    });
  }

  // Borrar foto anterior de Cloudinary si existe
  const oldPicture = user.UserProfile?.ProfilePicture;
  if (oldPicture) {
    await deleteImage(oldPicture).catch(() => {});
  }

  // Subir nueva imagen a Cloudinary
  const ext = path.extname(req.file.path);
  const randomHex = crypto.randomBytes(6).toString('hex');
  const cloudinaryFileName = `profile-${randomHex}${ext}`;

  const cloudinaryUrl = await uploadImage(req.file.path, cloudinaryFileName);

  // Actualizar en base de datos
  await UserProfile.update(
    { ProfilePicture: cloudinaryUrl },
    { where: { UserId: userId } }
  );

  return res.status(200).json({
    success: true,
    message: 'Foto de perfil actualizada exitosamente',
    data: { profilePicture: cloudinaryUrl },
  });
});
