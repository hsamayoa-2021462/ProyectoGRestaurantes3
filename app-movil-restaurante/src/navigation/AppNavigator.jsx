// src/navigation/AppNavigator.jsx
import React from 'react';
import AuthStack from './AuthStack.jsx';
import { useAuthStore } from '../shared/store/authStore.js';
import { LoadingSpinner } from '../shared/components/common/UI.jsx';
import { COLORS } from '../shared/constants/theme.js';
import ClientDashboard from '../features/client/screens/ClientDashboard.jsx';

export default function AppNavigator({ deepLink }) {
    const _hasHydrated = useAuthStore((s) => s._hasHydrated);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);

    if (!_hasHydrated) {
        return <LoadingSpinner fullScreen color={COLORS.emerald} message="Cargando..." />;
    }

    if (isAuthenticated) {
        return <ClientDashboard user={user} logout={logout} />;
    }

    return (
        <AuthStack
            initialRoute={deepLink?.screen ?? 'Login'}
            initialParams={deepLink ? { token: deepLink.token, autoVerify: deepLink.autoVerify ?? false } : undefined}
        />
    );
}