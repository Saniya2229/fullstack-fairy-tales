import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Custom hook to prevent browser back button navigation
 * This ensures users can't go back to previous pages without proper logout
 */
export function usePreventBackNavigation() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Push a new state to prevent going back
        window.history.pushState(null, '', window.location.href);

        const handlePopState = (event) => {
            // Prevent the default back action
            window.history.pushState(null, '', window.location.href);

            // Optional: Show a confirmation dialog
            const confirmLeave = window.confirm(
                'Are you sure you want to leave? Please use the logout button to exit safely.'
            );

            if (confirmLeave) {
                // If user confirms, clear token and redirect to home
                localStorage.removeItem('token');
                navigate('/', { replace: true });
            }
        };

        // Listen for back/forward button clicks
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate, location]);
}
