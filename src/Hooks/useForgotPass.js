// 
import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useForgotPass = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // default should be false

    const { dispatch } = useAuthContext();

    const forgotPassword = async (email) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.error || 'Something went wrong');
                return false;
            }
            // save the user to local storage in key value pairs
            sessionStorage.setItem('otp', String(json.otp))
            sessionStorage.setItem('email', String(json.email))
            dispatch({ type: 'FORGOT_PASSWORD', payload: json });
            return true;
        } catch (err) {
            setError('Network error or unexpected issue');
            return false;
        } finally {
            setIsLoading(false); 
        }
    };

    return { isLoading, error, forgotPassword };
};
