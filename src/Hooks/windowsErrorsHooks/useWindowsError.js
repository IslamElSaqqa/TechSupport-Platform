import { useState } from 'react';
import { useWindowsErrorsContext } from './useWindowsErrorsContext';

export const useWindowsErrors = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 

    const { dispatch } = useWindowsErrorsContext();

    const getWindowsError = async (errorCode) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/WindowsError/search?code=${errorCode}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.error || 'Something went wrong');
                return false;
            }
            // save the user to local storage in key value pairs
            localStorage.setItem('errorCode', String(json.error.error_code))
            dispatch({ type: 'GET_WINDOWS_ERRORS', payload: json.error});
            return true;
        } catch (err) {
            setError('Network error or unexpected issue');
            return false;
        } finally {
            setIsLoading(false); 
        }
    };


    return { isLoading, error, getWindowsError};
};
