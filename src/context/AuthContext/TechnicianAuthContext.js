
import { createContext, useReducer, useEffect } from 'react'

// Create an AuthContext instance from createContext
export const TechnicianAuthContext = createContext()
export const techReducer = (state, action) => {
    switch (action.type) { 
        case 'LOGIN':
            return { technician: action.payload }
        case 'LOGOUT':
            return { technician: null }
        case 'GET_PROFILE':
            return {technician: action.payload}
        default:
            return state
    }
}

export const TechnicianContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(techReducer,
        { technician: null })
    
    console.log('context state: ', state)
    useEffect(() => {
        const technician = JSON.parse(sessionStorage.getItem('Technician'))
        dispatch({type: 'LOGIN', payload: technician})
    }, [])



    return (
        // passing props to the provider to wrap 
        <TechnicianAuthContext.Provider value={{ ...state, dispatch }}>
            { children}
        </TechnicianAuthContext.Provider>
    )
}
