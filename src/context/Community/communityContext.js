import { createContext, useReducer } from 'react'
export const CommunityContext = createContext()
export const communityReducer = (state, action) => {
    switch (action.type) {
        case "CREATE_POSTS":
            return {
                // spreading states
                ...state,
                posts: [action.payload, ...state.posts],
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
        // case 'UPDATE_POST':
        //     return {
        //         ...state,
        //         posts: state.posts.map((post) =>
        //         post._id === action.payload.postId
        //             ? { ...post, content: action.payload.content } : post
        // ),
        //     };
        case 'UPDATE_POST':
            return {
                ...state,
                posts: state.posts.map(post => 
                post._id === action.payload.postId 
                    ? { 
                        ...post, 
                        content: action.payload.content,
                        is_edited: true,
                        updated_at: new Date().toISOString()
                    }
                    : post
                )
            }
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

    case 'ADD_COMMENT':
        console.log("ADD_COMMENT errr", action.payload.comment);
    return {
        ...state,
        posts: state.posts.map((post) =>
            post._id === action.payload.postId
                ? {
                    ...post,
                    comments: [...(post.comments || []), action.payload.comment], // Update post.comments
                }
                : post
        ),
        commentsByPost: {
            ...state.commentsByPost,
            [action.payload.postId]: [
                ...(state.commentsByPost?.[action.payload.postId] || []),
                action.payload.comment,
            ], 
        },
    };

    case 'DELETE_COMMENT':
        console.log("DELETE_COMMENT errr", action.payload);
        console.log("Previous comments:", state);
    return {
        ...state,
        posts: state.posts.map((post) =>
            post._id === action.payload.postId
                ? {
                    ...post,
                    comments: post.comments.filter(
                        (comment) => comment._id !== action.payload.commentId
                    ),
                }
                : post
        ),
        commentsByPost: {
            ...state.commentsByPost,
            [action.payload.postId]: state.commentsByPost?.[action.payload.postId]?.filter(
                (comment) => comment._id !== action.payload.commentId
            ),
        },
    };

        case 'GET_POST_COMMENTS':
            return {
                ...state,
                commentsByPost: {
                    ...state.commentsByPost,
                    [action.payload.postId]: action.payload.comments
                },
            };

        default:
            return state
    }
}

// create a custom context using useReducer to share global user states
export const CommunityContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(communityReducer,
        { commentsByPost:{} , posts: []})
        console.log('context state: ', state)

    return (
        // passing props to the provider to wrap
        <CommunityContext.Provider value={{ ...state, dispatch }}>
            { children}
        </CommunityContext.Provider>
    )
}
