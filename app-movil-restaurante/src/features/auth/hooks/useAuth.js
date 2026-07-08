// src/features/auth/hooks/useAuth.js
import { useState, useCallback } from 'react';
import authClient from '../../../shared/api/authClient.js';
import { useAuthStore } from '../../../shared/store/authStore.js';
import { ENDPOINTS } from '../../../shared/constants/endpoints.js';

const parseError = (err) => {
    const data = err?.response?.data;
    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (err?.message) return err.message;
    return 'Ocurrió un error inesperado.';
};

export default function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login: storeLogin, logout: storeLogout } = useAuthStore();

    const handleLogin = useCallback(async ({ emailOrUsername, password }) => {
        setLoading(true); setError(null);
        try {
            const { data } = await authClient.post(ENDPOINTS.AUTH.LOGIN, { emailOrUsername, password });
            const accessToken = data.accessToken ?? data.token;
            const userData = data.userDetails ?? data.user ?? null;
            if (!accessToken) throw new Error('El servidor no devolvió un token.');
            await storeLogin(accessToken, userData);
            return { success: true };
        } catch (err) {
            const msg = parseError(err);
            setError(msg);
            return { success: false, error: msg };
        } finally { setLoading(false); }
    }, [storeLogin]);

    const handleRegister = useCallback(async ({ name, surname, username, email, password, phone }) => {
        setLoading(true); setError(null);
        try {
            const form = new FormData();
            form.append('name', name);
            form.append('surname', surname);
            form.append('username', username);
            form.append('email', email);
            form.append('password', password);
            form.append('phone', phone);
            const { data } = await authClient.post(ENDPOINTS.AUTH.REGISTER, form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return { success: true, data };
        } catch (err) {
            const msg = parseError(err);
            setError(msg);
            return { success: false, error: msg };
        } finally { setLoading(false); }
    }, []);

    const handleVerifyEmail = useCallback(async (token) => {
        setLoading(true); setError(null);
        try {
            const { data } = await authClient.post(ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
            return { success: true, data };
        } catch (err) {
            const msg = parseError(err); setError(msg);
            return { success: false, error: msg };
        } finally { setLoading(false); }
    }, []);

    const handleResendVerification = useCallback(async (email) => {
        setLoading(true); setError(null);
        try {
            const { data } = await authClient.post(ENDPOINTS.AUTH.RESEND_VERIFICATION, { email });
            return { success: true, data };
        } catch (err) {
            const msg = parseError(err); setError(msg);
            return { success: false, error: msg };
        } finally { setLoading(false); }
    }, []);

    const handleForgotPassword = useCallback(async (email) => {
        setLoading(true); setError(null);
        try {
            const { data } = await authClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
            return { success: true, data };
        } catch (err) {
            const msg = parseError(err); setError(msg);
            return { success: false, error: msg };
        } finally { setLoading(false); }
    }, []);

    const handleResetPassword = useCallback(async ({ token, newPassword }) => {
        setLoading(true); setError(null);
        try {
            const { data } = await authClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
            return { success: true, data };
        } catch (err) {
            const msg = parseError(err); setError(msg);
            return { success: false, error: msg };
        } finally { setLoading(false); }
    }, []);

    const logout = useCallback(async () => { await storeLogout(); }, [storeLogout]);

    return {
        handleLogin, handleRegister, handleVerifyEmail,
        handleResendVerification, handleForgotPassword, handleResetPassword,
        logout, loading, error, clearError: () => setError(null),
    };
}