import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Component that protects routes from unauthenticated access
 * Redirects to login page if user is not authenticated
 * Preserves the intended destination URL for post-login redirect
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation();

    /**
     * Check if user is authenticated
     * Simple check for token existence in localStorage
     */
    const isAuthenticated = (): boolean => {
        const token = localStorage.getItem('token');
        return !!token && token.trim() !== '';
    };

    // If not authenticated, redirect to login with return URL
    if (!isAuthenticated()) {
        // Preserve the current path to redirect back after login
        const returnUrl = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
    }

    // If authenticated, render the protected component
    return <>{children}</>;
};

export default ProtectedRoute;
