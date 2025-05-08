import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
// Create a useSignup hook
export const useSignup =  () => { 
    // define Error and IsLoading States to track errors and time loading requests
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const signup = async (username, email, password_hash, phone_number, user_presence = 0) => {
        
        // tracking error states
        setIsLoading(true)
        setError(null)
        
        // creating The API using fetch
        const response = await fetch('/api/users/register', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, email, password_hash, phone_number, user_presence})
        })
        const json = await response.json()

        // check the response status
        if (!response.ok) { 
            setIsLoading(false)
            setError(json.error)
            return false; // return false to indicate failure
        }

        if (response.ok) { 
            // save the user to sessoin storage in key value pairs
            sessionStorage.setItem('user', JSON.stringify(json.user))

            // update auth context using dispatch from useReducer 
            // (Type: '', payload: '')
            dispatch({ type: 'LOGIN', payload: json.user })
            return true
        }
            
    }
    return {isLoading, error, signup}
}