// src/shared/api/restClient.js
import axios from 'axios';
import { useAuthStore } from '../store/authStore.js';

const REST_BASE = process.env.EXPO_PUBLIC_REST_URL || 'http://localhost:3006/api/v1';

const restClient = axios.create({
    baseURL: REST_BASE,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

restClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

restClient.interceptors.response.use(
    (r) => r,
    async (error) => {
        if (error.response?.status === 401) {
            await useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default restClient;