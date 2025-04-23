import { createContext, useReducer } from 'react'

// Create an windowErrorsContext instance from createContext
export const WindowErrorsContext = createContext()
export const windowsErrorsReducer = (state, action) => {
    switch (action.type) { 
        case "GET_WINDOWS_ERRORS":
            return { windowsErrors: action.payload }
        default:
            return state
    }
}

// create a custom context using useReducer to share global user states
export const WindowsErrorsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(windowsErrorsReducer,
        { windowsErrors: null })
        console.log('context state: ', state)

    return (
        // passing props to the provider to wrap 
        <WindowErrorsContext.Provider value={{ ...state, dispatch }}>
            { children}
        </WindowErrorsContext.Provider>
    )
}