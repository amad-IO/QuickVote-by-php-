import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    name: string;
    email: string;
}

interface UseAuthReturn {
    isAuthenticated: boolean;
    user: User | null;
    logout: () => void;
    requireAuth: () => void;
}

/**
 * Custom hook for authentication utilities
 * Provides authentication state and methods
 */
export const useAuth = (): UseAuthReturn => {
    const navigate = useNavigate();

    /**
     * Check if user is authenticated
     * Returns true if valid token exists in localStorage
     */
    const isAuthenticated = (): boolean => {
        const token = localStorage.getItem('token');
        return !!token && token.trim() !== '';
    };

    /**
     * Get current user from localStorage
     * Returns null if not authenticated
     */
    const getUser = (): User | null => {
        try {
            const userStr = localStorage.getItem('currentUser');
            if (!userStr) return null;
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    };

    /**
     * Logout user
     * Clears localStorage and redirects to login page
     */
    const logout = (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    /**
     * Require authentication
     * Throws error if not authenticated (for component use)
     */
    const requireAuth = (): void => {
        if (!isAuthenticated()) {
            throw new Error('Authentication required');
        }
    };

    return {
        isAuthenticated: isAuthenticated(),
        user: getUser(),
        logout,
        requireAuth,
    };
};
