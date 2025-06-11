import { useState, useRef, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCreatePost } from '../../Hooks/Community/useCreatePost';
import { useAuthContext } from '../../Hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { useCommunityContext } from '../../Hooks/Community/useCommunityContext';
import { useDeletePost } from '../../Hooks/Community/useDeletePost';
import { useUpdatePost } from "../../Hooks/Community/useUpdatePost"
import { useTogglePost } from '../../Hooks/Community/useTogglePost';
import { useAddComment } from '../../Hooks/Community/useAddComment';
import { useGetPostComments } from '../../Hooks/Community/useGetPostComments';
import { useUpdateComment } from '../../Hooks/Community/useUpdateComment';
import { useDeleteComment } from '../../Hooks/Community/useDeleteComment';
import { formatDate, formatFullDate } from '../../utils/dateHelpers';

import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useClickOutside } from '../../Hooks/Community/useClickOutside';

// Custom Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onConfirm, onCancel, title, message, confirmText = "Delete", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
        </div>
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>
        <div className="modal-footer">
          <button 
            className="modal-btn cancel-btn" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className="modal-btn confirm-btn" 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};


const Community = () => {
  
  // Delete confirmation states for comments
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  
  // Delete confirmation states for posts
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  
  const [content, setContent] = useState('');
  const [imageUpload, setImageUpload] = useState('');
  const [uploading, setUploading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const { isLoading, error, createPost } = useCreatePost();
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const { posts, dispatch } = useCommunityContext()
  const { deletePost, isDeleteLoading, deleteError } = useDeletePost();
  const { updatePost, updateError, isUpdateLoading } = useUpdatePost()
  const { isLoadingToggle, errorToggle, togglePost } = useTogglePost();
  const { isLoadingComment, errorAddingComment, addComment } = useAddComment()
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  // showing fetched comments utils
  const [activePostId, setActivePostId] = useState(null)
  const [commentsByPost, setCommentsByPost] = useState({});
  const [commentPageByPost, setCommentPageByPost] = useState({});
  const [hasMoreCommentsByPost, setHasMoreCommentsByPost] = useState({});
  const { getPostComments, errorComments } = useGetPostComments();
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');
  const { updateComment, isLoadingUpdate, errorUpdate } = useUpdateComment();
  const { deleteComment, isLoadingDelete, errorDelete } = useDeleteComment();

  // Handle fetching & scroll-based pagination of comments per post
  const observer = useRef({});
  const lastCommentRef = (postId) => (node) => {
    if (isFetchingRef.current || !hasMoreCommentsByPost[postId]) return;

    if (observer.current[postId]) observer.current[postId].disconnect();

    observer.current[postId] = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchCommentsForPost(postId, (commentPageByPost[postId] || 1) + 1);
      }
    });

    if (node) observer.current[postId].observe(node);
  };


  // For Creating Post section with emoji picker!
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  useClickOutside(emojiPickerRef, () => setShowEmojiPicker(false));


  // appending emojis to either the content or the updated content
  const handleEmojiSelect = (emoji) => {
    if (editingPostId) {
      setEditedContent((prev) => prev + emoji.native);
    } else {
      setContent((prev) => prev + emoji.native);
    }
  };

  useEffect(() => {
    fetchPosts(1); // Initial fetch on mount
  }, [user]);


  // using another useEffect to handle scroll of getting posts
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.body.offsetHeight;

      if (scrollTop + windowHeight >= docHeight - 100 && !isFetchingRef.current) {
        fetchPosts(page + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, hasMore]);


  const fetchPosts = async (pageNum = 1) => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;

    try {
      const res = await fetch(`/api/community/posts?page=${pageNum}&limit=5`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        console.error('Failed to fetch posts');
        return;
      }

      const data = await res.json();
      const newPosts = data.data || [];

      if (newPosts.length < 5) {
        setHasMore(false);
      }

      if (pageNum === 1) {
        dispatch({ type: 'SET_POST', payload: newPosts });
      } else {
        dispatch({ type: 'ADD_POSTS', payload: newPosts });
      }

      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setAuthError('Please log in to continue.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    const postData = {
      user: user._id,
      content,
      image_url: imageUpload,
    };

    const success = await createPost(postData);
    if (success) {
      setContent('');
      setImageUpload('');
      toast.success('Post created successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });

    }
  };

  // Updated handle delete to show confirmation modal
  const handleDelete = async (postId) => {
    setPostToDelete(postId);
    setShowDeletePostModal(true);
  };

  // Add this new function for confirming post deletion
  const confirmDeletePost = async () => {
    if (postToDelete) {
      const success = await deletePost(postToDelete);
      if (success) {
        toast.success('Post deleted successfully', {
          position: 'top-right',
          autoClose: 2000,
        });
      } else {
        toast.error('Failed to delete post', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
    
    setShowDeletePostModal(false);
    setPostToDelete(null);
  };

  // Add this function for canceling post deletion
  const cancelDeletePost = () => {
    setShowDeletePostModal(false);
    setPostToDelete(null);
  };

  // handle Edit Click before Update
  const handleEditClick = (postId, currentContent) => {
    setEditingPostId(postId);
    setEditedContent(currentContent);
  };


  const handleUpdate = async (postId) => {

    // Call the updatePost function when ready to update
    const success = await updatePost(postId, editedContent);

    if (success) {
      dispatch({
        type: 'UPDATE_POST',
        payload: {
          postId,
          content: editedContent,
        },
      });
      toast.success('Post updated successfully', {
        position: 'top-right',
        autoClose: 1000,
      });

        setEditingPostId(null);
        setEditedContent('');
      // setTimeout(() => { window.location.reload(); }, 1500)

    } else {
      toast.error('Failed to update post', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };


  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const response = await fetch('/api/uploadImage/toCloudinary', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');
      setImageUpload(data.imageUrl);
    } catch (err) {
      console.error('Upload error:', err.message);
    } finally {
      setUploading(false);
    }
  };


  const toggleComments = (postId) => {
    if (activePostId === postId) {
      console.log(activePostId)
      setActivePostId(null); // Close if already open
    } else {
      setActivePostId(postId);
      if (!commentsByPost[postId]) {
        fetchCommentsForPost(postId, 1); // Fetch first page
      }
    }
  };

  // fetching post comments
  const fetchCommentsForPost = async (postId, page = 1, limit = 3) => {
    try {
      const { comments: newComments, hasMore } = await getPostComments(postId, page, limit);

      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: page === 1
          ? newComments
          : [...(prev[postId] || []), ...newComments],
      }));

      setCommentPageByPost((prev) => ({
        ...prev,
        [postId]: page,
      }));

      setHasMoreCommentsByPost((prev) => ({
        ...prev,
        [postId]: hasMore,
      }));

    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // handle Adding Comment
  const handleAddComment = async (postId, navigate) => {

    const comment = commentInputs[postId]?.trim();
    if (!comment) return;

    const success = await addComment(postId, comment, navigate);

    if (success) {
      toast.success("Comment added!", { autoClose: 1500 });
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      fetchCommentsForPost(postId, 1);

    } else {
      toast.error("Failed to add comment.");
    }
  };

  // Check whether user liked the post or not!
  const hasUserLiked = (post) => {
    return user && Array.isArray(post.likedBy) && post.likedBy.includes(user._id);
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(currentContent);
  };

  const handleUpdateComment = async (postId, commentId) => {
    const success = await updateComment(postId, commentId, editedCommentContent);

    if (success) {
      toast.success('Comment updated successfully!', { autoClose: 1500 });
      setEditingCommentId(null);
      setEditedCommentContent('');
      // Refresh comments for this post
      fetchCommentsForPost(postId, 1);
    } else {
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    setCommentToDelete({ postId, commentId });
    setShowDeleteModal(true);
  };

  // Add this new function for confirming the comment deletion
  const confirmDeleteComment = async () => {
    if (commentToDelete) {
      const { postId, commentId } = commentToDelete;
      const success = await deleteComment(postId, commentId);

      if (success) {
        toast.success('Comment deleted successfully!', { autoClose: 1500 });
        // Refresh comments for this post
        fetchCommentsForPost(postId, 1);
      } else {
        toast.error('Failed to delete comment');
      }
    }
    
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };

  // Add this function for canceling the comment deletion
  const cancelDeleteComment = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };
  

  return (
    <div className="content-container">
      <ToastContainer />
      <main className="main-content">
        {authError && <div className="error">{authError}</div>}
        {error && <div className="error">{error}</div>}
        {deleteError && <div className="error">{deleteError}</div>}
        {updateError && <div className="error">{updateError}</div>}
        {errorToggle && <div className='error'>{errorToggle}</div>}
        {errorAddingComment && <div className='error'>{errorAddingComment}</div>}
        {errorComments && <div className='error'>{errorComments}</div>}

        <form onSubmit={handleSubmit}>
          <div className="create-post">
            <div className="top">
              <div className="user-text">
                 <img
                      src={
                        user?.profile_image ||
                        "https://res.cloudinary.com/dr9yx1tod/image/upload/v1748886234/ivrbbqhag7lp8l9bfmkv.png"
                      }
                      alt="User avatar"
                      className="avatar"
                    />
                <textarea
                  rows={4}
                  type="text"
                  placeholder="What's on your mind?"
                  className="text-Community"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {/* Post image preview under textarea */}

              {uploading && (
                <div className="spinner-container">
                  <div className="spinner"></div>
                </div>
              )}
            </div>
            <div>
              {imageUpload && (
                <div className="post-preview-image">
                  <img
                    src={imageUpload}
                    alt="Post preview"
                    className="post-image"
                  />
                </div>
              )}
            </div>
            <div className="actions-button">
              <div className="actions">
                <button
                  className="action-btn"
                  type="button"
                  onClick={() => {
                    if (!user) return;
                    fileInputRef.current.click();
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/dr9yx1tod/image/upload/v1748905224/gplrj3upc1lx6aogxner.png"
                    alt="Image2"
                  />
                </button>
                <input
                  type="file"
                  accept=".png,.jpg"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  disabled={uploading}
                />

                <div className="emoji-wrapper" ref={emojiPickerRef}>
                  <button
                    className="action-btn"
                    type="button"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                  >
                    <img
                      src="https://res.cloudinary.com/dr9yx1tod/image/upload/v1748905258/vz5fwaf6knje5df4d2ib.png"
                      alt="Emoji"
                    />
                  </button>

                  {showEmojiPicker && (
                    <div className="emoji-picker-dropdown" onClick={(e) => e.stopPropagation()}>
                      <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light"
                      />
                    </div>
                  )}
                </div>

              </div>
              <button
                disabled={isLoading || uploading}
                className="post-btn"
                type="submit"
              >
                POST
              </button>
            </div>
          </div>
        </form>

        {loading && (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        )}

        {/* Render Posts */}
        <div className="posts-list">
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="social-post">
                <div className="post-header">
                  <div className="user-info">
                    <img
                      src={
                        post.user?.profile_image ||
                        "https://res.cloudinary.com/dr9yx1tod/image/upload/v1748886234/ivrbbqhag7lp8l9bfmkv.png"
                      }
                      alt="User avatar"
                      className="avatar"
                    />
                    <div className="user-details">
                      <h3 className="username-community">
                        {post.user?.username || "Unknown User"}
                      </h3>
                      <div className="post-timestamp">
                        <span>{formatDate(post.createdAt)}</span>
                        {post.is_edited && (
                          <span className="edited-indicator" title={`Edited ${formatFullDate(post.updated_at)}`}>
                            (edited)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>

                    {user && post.user._id === user._id && (
                      <>
                        {/*Update functionality */}

                        <img onClick={() => !isUpdateLoading && handleEditClick(post._id, post.content)}
                          style={{ cursor: isUpdateLoading ? 'not-allowed' : 'pointer', opacity: isUpdateLoading ? 0.6 : 1 }}
                          src="https://res.cloudinary.com/dr9yx1tod/image/upload/v1746553462/edit-regular-240_rticyf.png"
                          alt="Edit Menu"
                          className="menu-icon"
                        />

                        {/* Delete Functionality */}
                        <img onClick={() => !isDeleteLoading && handleDelete(post._id)}
                          style={{ cursor: isDeleteLoading ? 'not-allowed' : 'pointer', opacity: isDeleteLoading ? 0.6 : 1 }}
                          src="https://res.cloudinary.com/dr9yx1tod/image/upload/v1746553320/trash-regular-240_veohgh.png"
                          alt="Delete Menu"
                          className="menu-icon"
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="post-content">
                  {editingPostId === post._id ? (
                    <>
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={3}
                        className="edit-textarea"
                      />
                      <button disabled={isUpdateLoading}
                        onClick={() => handleUpdate(post._id)} className="save-btn">
                        Save
                      </button>
                      <button onClick={() => setEditingPostId(null)} className="cancel-btn-community">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <p className="content-text">{post.content}</p>
                  )}


                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt="Post content"
                      className="content-image"
                    />
                  )}
                </div>

                <div className="post-stats">
                  <div className="stats-group">
                    <div className="stat-item"
                      onClick={() => !isLoadingToggle && togglePost(post, navigate)}
                      style={{
                        cursor: isLoadingToggle ? 'not-allowed' : 'pointer',

                      }}>

                      <img
                        src={
                          hasUserLiked(post)
                            ? "https://res.cloudinary.com/dr9yx1tod/image/upload/v1747341997/filled_heart_icon_rf7ubu.png"
                            : "https://res.cloudinary.com/dr9yx1tod/image/upload/v1747341878/icons8-heart-100_kg64kd.png"
                        }
                        alt="Heart"
                        className="heart-icon"
                      />
                      <span>{typeof post.likes === 'number' ? post.likes : 0} Likes</span>
                    </div>

                    {/* Comment toggle & comment list */}
                    <div
                      className="stat-item"
                      onClick={() => toggleComments(post._id)}
                    >
                      <img
                        src="https://res.cloudinary.com/dr9yx1tod/image/upload/v1748904625/lsoturowkhlj0ulbyyp5.png"
                        alt="Comment"
                      />
                      <span>{Array.isArray(post.comments) ? post.comments.length : 0} Comments</span>
                    </div>
                  </div>
                </div>


                {/* Comment section */}
                {activePostId === post._id && (
                  <div className="comments-section">
                    {(commentsByPost[post._id] || []).map((comment, idx, arr) => {
                      const isLast = idx === arr.length - 1;
                      const isUserComment = user && comment.user_id === user._id;

                      return (
                        <div
                          className="Comment-group-box"
                          key={comment._id || idx}
                          ref={isLast ? lastCommentRef(post._id) : null}
                        >
                          <div className="Comment-group-box-image">
                            <img
                              src={
                                comment.profile_image || "https://res.cloudinary.com/dr9yx1tod/image/upload/v1748886234/ivrbbqhag7lp8l9bfmkv.png"
                              }
                              alt="User avatar"
                              className="avatar"
                            />
                          </div>
                          <div className="Comment-group-box-content">
                            <div className="comment-header">
                              <span className="Comment-group-box-content-username">
                                {comment.username || 'Unknown'}
                              </span>
                              <span className="comment-timestamp">
                                {formatDate(comment.created_at)}
                                {comment.is_edited && (
                                  <span className="edited-indicator" title={`Edited ${formatFullDate(comment.updated_at)}`}>
                                    (edited)
                                  </span>
                                )}
                              </span>
                              {isUserComment && (
                                <div className="comment-actions-menu">
                                  <button
                                    className="comment-edit-btn"
                                    onClick={() => handleEditComment(comment._id, comment.content)}
                                    disabled={isLoadingUpdate}
                                  >
                                    <img
                                      src="https://res.cloudinary.com/dr9yx1tod/image/upload/v1746553462/edit-regular-240_rticyf.png"
                                      alt="Edit"
                                      className="comment-action-icon"
                                    />
                                  </button>
                                  <button
                                    className="comment-delete-btn"
                                    onClick={() => handleDeleteComment(post._id, comment._id)}
                                    disabled={isLoadingDelete}
                                  >
                                    <img
                                      src="https://res.cloudinary.com/dr9yx1tod/image/upload/v1746553320/trash-regular-240_veohgh.png"
                                      alt="Delete"
                                      className="comment-action-icon"
                                    />
                                  </button>
                                </div>
                              )}
                            </div>

                            {editingCommentId === comment._id ? (
                              <div className="edit-comment-section">
                                <textarea
                                  value={editedCommentContent}
                                  onChange={(e) => setEditedCommentContent(e.target.value)}
                                  className="edit-comment-textarea"
                                  rows={2}
                                />
                                <div className="edit-comment-buttons">
                                  <button
                                    onClick={() => handleUpdateComment(post._id, comment._id)}
                                    disabled={isLoadingUpdate}
                                    className="save-comment-btn"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingCommentId(null);
                                      setEditedCommentContent('');
                                    }}
                                    className="cancel-comment-btn"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="Comment-group-box-content-commented">
                                {comment.content}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {!hasMoreCommentsByPost[post._id] && (
                      <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'orange' }}>
                        No more comments
                      </p>
                    )}
                  </div>
                )}

                <div className="post-comment">
                  <img
                    src={user?.profile_image || "https://res.cloudinary.com/dr9yx1tod/image/upload/v1748886234/ivrbbqhag7lp8l9bfmkv.png"}
                    alt="User avatar"
                    className="avatar"
                  />
                  <input
                    type="text"
                    placeholder="Write your comment.."
                    className="comment-input"
                    value={commentInputs[post._id] || ""}
                    onChange={(e) =>
                      setCommentInputs({ ...commentInputs, [post._id]: e.target.value })
                    }
                  />

                  <div className="comment-actions"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >

                    <img
                      src="https://res.cloudinary.com/dr9yx1tod/image/upload/v1748904661/cajeeyxeouzxomualfp7.png"
                      alt="Add Comment"
                      className="action-icon"
                      onClick={() => !isLoadingComment && handleAddComment(post._id, navigate)}

                    />
                  </div>

                </div>

              </div>
            ))
          ) : (
            <span className="orange-text-posts">No Posts Yet!</span>
          )}
          
        </div>
        
        {/* Comment Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onConfirm={confirmDeleteComment}
          onCancel={cancelDeleteComment}
          title="Delete Comment"
          message="Are you sure you want to delete this comment? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
        
        {/* Post Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeletePostModal}
          onConfirm={confirmDeletePost}
          onCancel={cancelDeletePost}
          title="Delete Post"
          message="Are you sure you want to delete this post? This action will permanently remove the post and all its comments."
          confirmText="Delete"
          cancelText="Cancel"
        />
        
      </main>
    </div>
  );
};
export default Community;