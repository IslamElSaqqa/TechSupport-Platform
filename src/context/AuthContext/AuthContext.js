
import { createContext, useReducer, useEffect, useState } from 'react'

// Create an AuthContext instance from createContext
export const AuthContext = createContext()
export const authReducer = (state, action) => {
    switch (action.type) { 
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        case 'FORGOT_PASSWORD':
            return { user: action.payload }
        case 'VERIFY_OTP':
            return { user: action.payload}
        case 'RESET_PASSWORD':
            return { user: action.payload }
        case 'UPDATE_PROFILE':
            return { user: action.payload }
        case 'GET_PROFILE':
            return {user: action.payload}
        default:
            return state
    }
}

// create a custom context using useReducer to share global user states
// authReducer is a func that defines all user states
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer,
        { user: null })
        const [loading, setLoading] = useState(true); 

    console.log('context state: ', state)
    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'))
        if (user) {
            dispatch({ type: 'LOGIN', payload: user });
        }
        setLoading(false);
    }, []);

    if (loading) return null;

    return (
        // passing props to the provider to wrap 
        <AuthContext.Provider value={{ ...state, dispatch }}>
            { children}
        </AuthContext.Provider>
    )
}
