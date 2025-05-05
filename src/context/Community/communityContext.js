import { createContext, useReducer } from 'react'

// Create an windowErrorsContext instance from createContext
export const CommunityContext = createContext()
export const communityReducer = (state, action) => {
    switch (action.type) { 
        case "CREATE_POSTS":
            return {
                posts: [action.payload, ...state.posts]
            }
        case "SET_POST":
            return {
                posts: Array.isArray(action.payload) ? action.payload : []
            }
        default:
            return state
    }
}

// create a custom context using useReducer to share global user states
export const CommunityContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(communityReducer,
        { posts: [] })
        console.log('context state: ', state)

    return (
        // passing props to the provider to wrap 
        <CommunityContext.Provider value={{ ...state, dispatch }}>
            { children}
        </CommunityContext.Provider>
    )
}