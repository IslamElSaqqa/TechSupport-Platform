import { useState, useRef, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCreatePost } from '../../Hooks/Community/useCreatePost';
import { useAuthContext } from '../../Hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { useCommunityContext } from '../../Hooks/Community/useCommunityContext';
import { useDeletePost } from '../../Hooks/Community/useDeletePost';
import { useUpdatePost } from "../../Hooks/Community/useUpdatePost"

const Community = () => {
  const [content, setContent] = useState('');
  const [imageUpload, setImageUpload] = useState('');
  const [uploading, setUploading] = useState(false);
  const [authError, setAuthError] = useState('');
  const { isLoading, error, createPost } = useCreatePost();
  const [loading, setLoading] = useState(true); 
  const { user } = useAuthContext();
  const { posts, dispatch } = useCommunityContext()
  const { deletePost, isDeleteLoading, deleteError } = useDeletePost();
  const { updatePost, updateError, isUpdateLoading } = useUpdatePost()
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState('');


  useEffect(() => {
    fetchPosts(1); // Initial fetch on mount
  }, [user]);
  

  // using another useEffect to handle scroll
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
        setHasMore(false); // No more posts to load
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


  // handle delete
  const handleDelete = async (postId) => {
    const success = await deletePost(postId);
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
      setTimeout(() => {  window.location.reload(); }, 1500)
      
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

  return (
    <div className="content-container">
      <ToastContainer />
      <main className="main-content">
        {authError && <div className="error">{authError}</div>}
        {error && <div className="error">{error}</div>}
        {deleteError && <div className="error">{deleteError}</div>}
        {updateError && <div className="error">{updateError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="create-post">
            <div className="top">
              <div className="user-text">
                <img
                  src="https://dashboard.codeparrot.ai/api/image/Z9SwAyppvFKitUIo/avatar.png"
                  alt="Avatar"
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
                    src="https://dashboard.codeparrot.ai/api/image/Z9SwAyppvFKitUIo/image.png"
                    alt="Image"
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

                <button className="action-btn" type="button">
                  <img
                    src="https://dashboard.codeparrot.ai/api/image/Z9SwAyppvFKitUIo/emoji.png"
                    alt="Emoji"
                  />
                </button>
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
                        post.user.avatar ||
                        "https://dashboard.codeparrot.ai/api/image/Z9SwAyppvFKitUIo/avatar-2.png"
                      }
                      alt="User avatar"
                      className="avatar"
                    />
                    <div className="user-details">
                      <h3 className="username-community">
                        {post.user.username || "Unknown User"}
                      </h3>
                    </div>
                  </div>
                  <div>
  
                  {user && post.user._id === user._id && (
                    <>
                      {/*Update functionality */}
                      
                        <img disabled={ isUpdateLoading} onClick={()=>handleEditClick(post._id, post.content)}
                          src="https://res.cloudinary.com/dr9yx1tod/image/upload/v1746553462/edit-regular-240_rticyf.png"
                          alt="Edit Menu"
                          className="menu-icon"
                        />

                      {/* Delete Functionality */}
                        <img disabled={ isDeleteLoading} onClick={() => handleDelete(post._id)}
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
                    <button onClick={() => setEditingPostId(null)} className="cancel-btn">
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
                    <div className="stat-item">
                      <img
                        src="https://dashboard.codeparrot.ai/api/image/Z9SwAyppvFKitUIo/thumbs-up.png"
                        alt="Like"
                      />
                      <img
                        src="https://dashboard.codeparrot.ai/api/image/Z9SwAyppvFKitUIo/vector.png"
                        alt="Heart"
                        className="heart-icon"
                      />
                      <span>{post.likes} Likes</span>
                    </div>
                    <div className="stat-item">
                      <img
                        src="https://dashboard.codeparrot.ai/api/image/Z9SwAyppvFKitUIo/chat-dots.png"
                        alt="Comment"
                      />
                      <span>{Array.isArray(post.comments) ? post.comments.length : 0} Comments</span>
                    </div>
                  </div>
                </div>

                <div className="post-comment">
                  <img
                    src="https://dashboard.codeparrot.ai/api/image/Z9SwAyppvFKitUIo/avatar-3.png"
                    alt="User avatar"
                    className="avatar"
                  />
                  <input
                    type="text"
                    placeholder="Write your comment.."
                    className="comment-input"
                  />
                  <div className="comment-actions">
                    <img
                      src="https://dashboard.codeparrot.ai/api/image/Z9SwAyppvFKitUIo/monotone-2.png"
                      alt="Action 2"
                      className="action-icon"
                    />
                    <img
                      src="https://dashboard.codeparrot.ai/api/image/Z9SwAyppvFKitUIo/monotone-3.png"
                      alt="Action 3"
                      className="action-icon"
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <span className="orange-text-posts">No Posts Yet!</span>
          )}
        </div>
      </main>
    </div>
  );
};

export default Community;