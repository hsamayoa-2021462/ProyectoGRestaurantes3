// src/shared/store/authStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getRoleFromToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.role ?? decoded.roles?.[0] ?? decoded.roleName ?? null;
  } catch (_) { return null; }
};

const useAuthStore = create((set, get) => ({
  token:           null,
  user:            null,
  role:            null,
  isAuthenticated: false,
  _hasHydrated:    false,

  login: async (accessToken, userData) => {
    const role = getRoleFromToken(accessToken) ?? userData?.role ?? null;
    await AsyncStorage.setItem('gastro_token', accessToken);
    await AsyncStorage.setItem('gastro_user', JSON.stringify(userData || {}));
    await AsyncStorage.setItem('gastro_role', role || '');
    set({ token: accessToken, user: userData, role, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['gastro_token', 'gastro_user', 'gastro_role']);
    set({ token: null, user: null, role: null, isAuthenticated: false });
  },

  setAccessToken: (accessToken) => {
    const role = getRoleFromToken(accessToken);
    set((s) => ({ token: accessToken, isAuthenticated: !!accessToken, role: role ?? s.role }));
  },

  updateUser: (partial) => {
    set((state) => ({ user: state.user ? { ...state.user, ...partial } : partial }));
  },

  setHasHydrated: (value) => set({ _hasHydrated: value }),

  hydrate: async () => {
    try {
      const token = await AsyncStorage.getItem('gastro_token');
      const userStr = await AsyncStorage.getItem('gastro_user');
      const role = await AsyncStorage.getItem('gastro_role');
      if (token) {
        const user = userStr ? JSON.parse(userStr) : null;
        set({ token, user, role, isAuthenticated: true });
      }
    } catch (_) {}
    set({ _hasHydrated: true });
  },
}));

export { useAuthStore };
export default useAuthStore;