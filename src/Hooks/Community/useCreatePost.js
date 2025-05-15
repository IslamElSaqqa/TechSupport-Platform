import { useState } from 'react'
import { useCommunityContext } from '../Community/useCommunityContext'
import { useAuthContext } from "../useAuthContext"

// Create a useSignup hook
export const useCreatePost =  () => { 
    // define Error and IsLoading States to track errors and time loading requests
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { user } = useAuthContext()
    const { dispatch } = useCommunityContext()

    const createPost = async (postData) => {
        
        // tracking error states
        setIsLoading(true)
        setError(null)
        try {
            // creating The API using fetch 
            const response = await fetch('/api/community/posts', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user.token}`

                },
                body: JSON.stringify(postData)
            })
            const json = await response.json()

            // check the response status
            if (!response.ok) {
                setIsLoading(false)
                setError(json.error)
                return false;
            }

            if (response.ok) {
                sessionStorage.setItem('communityData', JSON.stringify(json.post))
                dispatch({ type: 'CREATE_POSTS', payload: json.post })
                setIsLoading(false); 
                return true;
            }
        } catch (e) {
            setError("Something went wrong");
            return false;
        } finally { 
            setIsLoading(false); // always reset

        }
            
    }
    return {isLoading, error, createPost}
}