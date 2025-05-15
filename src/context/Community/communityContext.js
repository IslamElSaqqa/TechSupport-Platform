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
        case 'ADD_POSTS':
            return {
                ...state,
                posts: [...state.posts, ...action.payload],
            };
        case 'DELETE_POSTS':
            return {
                ...state,
                posts: state.posts.filter((p)=> p._id !== action.payload._id)
            }
        case 'UPDATE_POST':
            return {
                ...state,
                posts: state.posts.map((post) =>
                post._id === action.payload.postId
                    ? { ...post, content: action.payload.content } : post
        ),
            };
        case 'LIKE_POST':
            return {
                ...state,
                posts: state.posts.map(post =>
                    post._id === action.payload.postId
                        ? {
                            ...post,
                            likes: action.payload.likes,
                            likedBy: action.payload.likedBy 
                            } : post
                ),
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