// src/features/client/perfil/hooks/useProfile.js
import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { useAuthStore } from '../../../../shared/store/authStore.js';
import authClient from '../../../../shared/api/authClient.js';
import { ENDPOINTS } from '../../../../shared/constants/endpoints.js';

export default function useProfile() {
  const user       = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [loading,    setLoading]    = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState(null);
  const [success,    setSuccess]    = useState(null);

  const clearMsg = () => { setError(null); setSuccess(null); };

  // ── GET perfil ──
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authClient.get(ENDPOINTS.AUTH.PROFILE);
      const profile = res.data?.userDetails ?? res.data?.user ?? res.data?.data ?? res.data;
      if (profile && typeof profile === 'object' && !Array.isArray(profile)) {
        updateUser(profile);
      }
    } catch {
      // Silencioso
    } finally { setLoading(false); }
  }, [updateUser]);

  // ── Cambiar foto — sube al servidor (Cloudinary) ──
  const changePhoto = useCallback(async (imageAsset) => {
    setSubmitting(true); setError(null); setSuccess(null);
    try {
      const uri = imageAsset.uri;

      // Crear FormData para subir al backend
      const form = new FormData();

      if (Platform.OS === 'web') {
        // En web convertir blob a File
        const resp = await fetch(uri);
        const blob = await resp.blob();
        const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
        form.append('profilePicture', file);
      } else {
        // En móvil usar el formato de React Native
        form.append('profilePicture', {
          uri,
          name: 'profile.jpg',
          type: imageAsset.mimeType || 'image/jpeg',
        });
      }

      // Subir al servidor
      const res = await authClient.put(ENDPOINTS.AUTH.UPDATE_PICTURE, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Obtener la URL de Cloudinary que devuelve el servidor
      const newPicture = res.data?.profilePicture || res.data?.data?.profilePicture || res.data?.user?.profilePicture;

      if (newPicture) {
        updateUser({ profilePicture: newPicture });
      } else {
        // Si el servidor no devuelve la URL, guardar la URI local
        updateUser({ profilePicture: uri });
      }

      setSuccess('Foto de perfil actualizada.');
      return { success: true };
    } catch (e) {
      // Si falla el servidor, guardar solo localmente
      try {
        let photoLocal = imageAsset.uri;
        if (Platform.OS === 'web' && imageAsset.uri.startsWith('blob:')) {
          const resp = await fetch(imageAsset.uri);
          const blob = await resp.blob();
          photoLocal = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload  = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        }
        updateUser({ profilePicture: photoLocal });
        setSuccess('Foto guardada localmente.');
        return { success: true };
      } catch {
        setError('No se pudo guardar la foto.');
        return { success: false };
      }
    } finally { setSubmitting(false); }
  }, [updateUser]);

  return {
    user, loading, submitting, error, success,
    clearMsg, fetchProfile, changePhoto,
  };
}