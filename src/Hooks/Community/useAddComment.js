import { useState, useContext } from 'react';
import { useAuthContext } from "../useAuthContext";
import { CommunityContext } from '../../context/Community/communityContext';

export const useAddComment = () => {
    const { dispatch } = useContext(CommunityContext);
    const { user } = useAuthContext();
    const [errorAddingComment, setErrorAddingComment] = useState(null);
    const [isLoadingComment, setIsLoadingComment] = useState(false);

    const addComment = async (postId, content, navigate) => {
        setIsLoadingComment(true);
        setErrorAddingComment(null);

        if (!user || !user.token) {
            setErrorAddingComment("You must be logged in to add a comment");
            setIsLoadingComment(false);

            setTimeout(() => {
                navigate('/login');
            }, 1500);
            return;
        }

        try {
            const response = await fetch(`/api/community/posts/${postId}/addcomments`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ content, username: user.username, postId})
            });

            const json = await response.json();

            if (!response.ok) {
                console.error("Failed to add comment:", json)
                setErrorAddingComment(json.error|| 'Failed to add comment');
                return false;
            }

            // Attaching the comment comming from json to payload for state
            dispatch({
                type: 'ADD_COMMENT',
                payload: {
                    postId,
                    // updated
                    comment: {
                        ...json.comment,
                        profile_image: user.profile_image,
                    }
                }
            });
            return true

        } catch (error) {
            setErrorAddingComment(error.message);
        } finally {
            setIsLoadingComment(false);
        }
    };

    return { addComment, isLoadingComment, errorAddingComment };
};
