// src/shared/api/authClient.js
import axios from 'axios';
import { ENDPOINTS } from '../constants/endpoints.js';
import { useAuthStore } from '../store/authStore.js';

const authClient = axios.create({
    baseURL: ENDPOINTS.AUTH.BASE,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

authClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

authClient.interceptors.response.use(
    (r) => r,
    async (error) => {
        if (error.response?.status === 401) {
            await useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default authClient;