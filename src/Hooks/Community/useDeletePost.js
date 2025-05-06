import { useState } from 'react'
import { useCommunityContext } from '../Community/useCommunityContext'
import { useAuthContext } from "../useAuthContext"

export const useDeletePost = () => { 
    const [deleteError, setDeleteError] = useState(null)
    const [isDeleteLoading, setIsDeleteLoading] = useState(false)
    const { user } = useAuthContext()
    const { dispatch } = useCommunityContext()

    const deletePost = async (postId) => {
        setIsDeleteLoading(true)
        setDeleteError(null)

        try {
            const response = await fetch(`/api/community/posts/${postId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user.token}`
                }
            })

            const json = await response.json()

            if (!response.ok) {
                setDeleteError(json.error || "Failed to delete post")
                setIsDeleteLoading(false)
                return false
            }

            dispatch({ type: 'DELETE_POSTS', payload: { _id: postId } })
            setIsDeleteLoading(false)
            return true

        } catch (e) {
            setDeleteError("Something went wrong")
            setIsDeleteLoading(false)
            return false
        }
        finally {
        setIsDeleteLoading(false)
        }
    }

    return { isDeleteLoading, deleteError, deletePost }
}