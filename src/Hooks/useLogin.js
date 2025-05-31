import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
// Create a useSignup hook
export const useLogin =  () => { 
    // define Error and IsLoading States to track errors and time loading requests
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)

    const { dispatch } = useAuthContext()
    const login = async (identifier, password) => {
        
        // tracking error states
        setIsLoading(true)
        setError(null)

        // creating The API using fetch 
        const response = await fetch('/api/users/login', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({identifier, password})
        })
        const json = await response.json()

        // check the response status
        if (!response.ok) { 
            setIsLoading(false)
            setError(json.error)
            // return false to indicate that there is an error in the response
            return false
        }

        if (response.ok) { 
            
            const normalizedUser = {
                _id: json.userId,
                email: json.identifier,
                token: json.token,
                username: json.username,
                user_presence: json.user_presence
            };
            
            // save the user to session storage in key value pairs
            sessionStorage.setItem('user', JSON.stringify(normalizedUser));

            dispatch({
                type: 'LOGIN',
                payload: normalizedUser
            })
                setIsLoading(false);
                return normalizedUser

        }
    }
    return {isLoading, error, login}
}