import { useContext, useState } from 'react';
import { CommunityContext } from '../../context/Community/communityContext';
import { useAuthContext } from '../useAuthContext'; 

export const useTogglePost = () => {
    const { dispatch } = useContext(CommunityContext);
    const { user } = useAuthContext();
    const [errorToggle, setErrorToggle] = useState(null);
    const [isLoadingToggle, setIsLoadingToggle] = useState(false);

    const togglePost = async (post, navigate) => {
        setIsLoadingToggle(true);
        setErrorToggle(null);

        if (!user || !user.token) {
            setErrorToggle("You must be logged in to like or unlike a post.");
            setIsLoadingToggle(false);

            setTimeout(() => {
                navigate('/login');
            }, 1500);
            return false;
        }
        
        const postId = post._id
        try {
            const alreadyLiked = post.likedBy?.includes(user._id);
            
            const endpoint = alreadyLiked
                ? `/api/community/posts/${postId}/unlike`
                : `/api/community/posts/${postId}/like`
            
            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user.token}`
                },
            });

            const json = await response.json();

            if (!response.ok) {
                setErrorToggle(json.error);
                return false;
            }

            if (response.ok) {
                dispatch({
                    type: 'LIKE_POST',
                    payload: { 
                        postId: post._id,
                        likes: json.likes,
                        likedBy: json.likedBy
                    }
                });

                return json.likedBy?.includes(user._id) ?? false;
            }

        } catch (error) {
            setErrorToggle(error.message);
        } finally {
            setIsLoadingToggle(false);
        }
    };

    return { togglePost, isLoadingToggle, errorToggle };
};
