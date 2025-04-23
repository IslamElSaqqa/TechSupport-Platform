import { createContext, useReducer } from 'react'

// Create an windowErrorsContext instance from createContext
export const RepairShopsContext = createContext()
export const repairShopReducer = (state, action) => {
    switch (action.type) { 
        case "GET_REPAIR_SHOPS":
            return { repairShops: action.payload }
        default:
            return state
    }
}

// create a custom context using useReducer to share global user states
// authReducer is a func that defines all user states
export const RepairShopsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(repairShopReducer,
        { repairShops: null })
        console.log('context state: ', state)

    return (
        // passing props to the provider to wrap 
        <RepairShopsContext.Provider value={{ ...state, dispatch }}>
            { children}
        </RepairShopsContext.Provider>
    )
}