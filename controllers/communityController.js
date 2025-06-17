const CommunityPost = require('../models/communityModel')
const User = require('../models/userModel')
const cloudinary = require("../Cloudinary/cloudinary");
const mongoose = require('mongoose')


// synchronizing user data with community posts after updating user profile
const syncUserDataInPosts = async (posts) => {
    if (!posts || posts.length === 0) return posts;
    
    try {
        // Extract unique user IDs from posts and comments
        const userIds = new Set();
        
        posts.forEach(post => {
            if (post.user && post.user._id) {
                userIds.add(post.user._id.toString());
            }
            if (post.comments && post.comments.length > 0) {
                post.comments.forEach(comment => {
                    if (comment.user_id) {
                        userIds.add(comment.user_id.toString());
                    }
                });
            }
        });

        // Fetch current user data
        const users = await User.find({ _id: { $in: Array.from(userIds) } })
            .select('_id username profile_image');
        
        // Create a map for quick lookup
        const userMap = new Map();
        users.forEach(user => {
            userMap.set(user._id.toString(), {
                username: user.username,
                profile_image: user.profile_image
            });
        });

        // Update posts with current user data
        posts.forEach(post => {
            if (post.user && post.user._id) {
                const currentUserData = userMap.get(post.user._id.toString());
                if (currentUserData) {
                    post.user.username = currentUserData.username;
                    post.user.profile_image = currentUserData.profile_image;
                }
            }

            // Update comments with current user data
            if (post.comments && post.comments.length > 0) {
                post.comments.forEach(comment => {
                    if (comment.user_id) {
                        const currentUserData = userMap.get(comment.user_id.toString());
                        if (currentUserData) {
                            comment.username = currentUserData.username;
                            comment.profile_image = currentUserData.profile_image;
                        }
                    }
                });
            }
        });

        return posts;
    } catch (error) {
        console.error('Error syncing user data in posts:', error);
        return posts; // Return original posts if sync fails
    }
};


 // GET All posts assigned to the user when logged in!
// const getPosts = async (req, res) => {
//     try {
//         // Ensure req.user exists
//         if (!req.user || !req.user._id) {
//             return res.status(401).json({ success: false, error: "Unauthorized: User not authenticated" });
//         }

//         const userId = req.user._id; // Now safe to access

//         // Pagination setup
//         const page = Math.max(parseInt(req.query.page) || 1, 1);
//         const limit = Math.max(parseInt(req.query.limit) || 10, 1);
//         const skip = (page - 1) * limit;

//         // Fetch posts related to logged-in user
//         const posts = await CommunityPost.find({ "user._id": userId })
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(limit);

//         const total = await CommunityPost.countDocuments({ "user._id": userId });

//         if (posts.length === 0) {
//             return res.status(204).json({ success: true, message: "No posts available for this user" });
//         }

//         res.status(200).json({
//             success: true,
//             count: posts.length,
//             total,
//             totalPages: Math.ceil(total / limit),
//             currentPage: page,
//             data: posts,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Error fetching user's posts",
//             error: error.message,
//         });
//     }
// };

// Get All posts from the database
const getAllPosts = async (req, res) => {
    try {
        // Pagination setup
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit) || 10, 1);
        const skip = (page - 1) * limit;

        // Fetch all posts from the database
        let posts = await CommunityPost.find()
            .sort({ createdAt: -1 }) // Sort by most recent first
            .skip(skip)
            .limit(limit);
        
        // Sync user data to ensure consistency
        posts = await syncUserDataInPosts(posts);

        // Get the total number of posts in the database
        const total = await CommunityPost.countDocuments();

        if (posts.length === 0) {
            return res.status(204).json({ success: true, message: "No posts available" });
        }

        res.status(200).json({
            success: true,
            count: posts.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: posts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching posts",
            error: error.message,
        });
    }
};

const updateComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Comment content cannot be empty" 
            });
        }

        // Find the post
        const post = await CommunityPost.findById(postId);
        if (!post) {
            return res.status(404).json({ 
                success: false, 
                message: "Post not found" 
            });
        }

        // Find the comment
        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ 
                success: false, 
                message: "Comment not found" 
            });
        }

        // Check if user owns the comment
        if (comment.user_id.toString() !== userId.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: "Not authorized to update this comment" 
            });
        }

        // Update the comment
        comment.content = content.trim();
        comment.updated_at = new Date();
        comment.is_edited = true;

        await post.save();

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment: comment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating comment",
            error: error.message
        });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user._id;

        // Find the post
        const post = await CommunityPost.findById(postId);
        if (!post) {
            return res.status(404).json({ 
                success: false, 
                message: "Post not found" 
            });
        }

        // Find the comment
        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ 
                success: false, 
                message: "Comment not found" 
            });
        }

        // Check if user owns the comment
        if (comment.user_id.toString() !== userId.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: "Not authorized to delete this comment" 
            });
        }

        // Remove the comment
        post.comments.pull(commentId);
        await post.save();

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting comment",
            error: error.message
        });
    }
};

//Get a post
// @route /api/community/posts/:id
const getPost = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid post ID format"
            });
        }

        // Find and increment view count atomically
        let post = await CommunityPost.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },  // Increment views
            { new: true }            // Return updated document
        ).lean();                    // better performance

        // check if post does not exist
        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'no such posts'
            });
        }
        const syncedPosts = await syncUserDataInPosts([post]);
        post = syncedPosts[0];
        res.status(200).json({ success: true, data: post });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Error fetching the post!",
            details: error.message
        });
    }
};

// Create new post
// @route POST /api/community/posts
const createPost = async (req, res) => {
    try {
        // Get authenticated user ID
        const userId = req.user._id; 

        // Extract data from request body
        const {content, image_url, views, hashtags, comments } = req.body;

        // Validate required fields
        if (!content) {
            return res.status(400).json({ error: "Content is required." });
        }

        // Fetch user details from the database
        const user = await User.findById(userId).select("_id username profile_image");

        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Process comments (if provided)
        let formattedComments = [];
        if (Array.isArray(comments) && comments.length > 0) {
            formattedComments = comments.map(comment => ({
                user_id: comment.user_id,
                username: comment.username,
                content: comment.content,
                created_at: new Date()
            }));
        }

        // Create the new post
        const newPost = await CommunityPost.create({
            user: {
                _id: user._id,
                username: user.username,
                profile_image: user.profile_image || '',
            },
            content,
            image_url: image_url || "",
            hashtags,
            views: views || 0,
            comments: formattedComments
        });

        res.status(201).json({ success: true, message: "Post created successfully", post: newPost });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// @route POST /api/community/posts/upload
const uploadPostImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: "community_posts", 
                use_filename: true,
                unique_filename: false,
            }
        );

        res.status(200).json({ success: true, imageUrl: result.secure_url });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error uploading image",
            error: error.message
        });
    }
};

// Like a post
const likePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;

    try {
        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({ success: false, message: "Invalid post ID" });
        }

        const post = await CommunityPost.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Prevent duplicate likes
        if (post.likedBy.includes(userId)) {
            return res.status(400).json({ success: false, message: "You have already liked this post" });
        }

        post.likes += 1;
        post.likedBy.push(userId);
        await post.save();

        res.status(200).json({
            success: true,
            message: "Post liked successfully",
            likes: post.likes,
            likedBy: post.likedBy,
            postId: post._id,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error liking post",
            error: error.message,
        });
    }
};


// unLike Post
const unlikePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;

    try {
        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({ success: false, message: "Invalid post ID" });
        }

        const post = await CommunityPost.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Check if user has liked the post before
        if (!post.likedBy.includes(userId)) {
            return res.status(400).json({ success: false, message: "You haven't liked this post yet" });
        }

        // Avoid the negative values
        post.likes = Math.max(post.likes - 1, 0); 
        post.likedBy = post.likedBy.filter(id => id.toString() !== userId.toString());
        await post.save();

        res.status(200).json({
            success: true,
            message: "Post unliked successfully",
            likes: post.likes,
            likedBy: post.likedBy,
            postId: post._id,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error unliking post",
            error: error.message,
        });
    }
};


// Add a comment to a post
const addComment = async (req, res) => {
    try {
        const { content, username, postId } = req.body;
        
        if (!username) {
        return res.status(400).json({ error: 'Username is required' });
        }

        if (!content) {
        return res.status(400).json({ error: 'content is required to add a comment' });
        }
        console.log("postId param",postId)
        const post = await CommunityPost.findById(postId);
        if (!post) {
        return res.status(404).json({ error: 'Post not found' });
        }

        const user = await User.findById(req.user._id).select("profile_image");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const comment = {
        user_id: req.user._id,
        username,
        content,
        profile_image: user.profile_image || '', 
        created_at: new Date(), 
        };

        post.comments.push(comment);
        await post.save();

        const newComment = post.comments[post.comments.length - 1].toObject();

        res.status(201).json({ message: 'Comment added:', comment: newComment  });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Get comments for a post
const getPostComments = async (req, res) => {
    try {
        const postId = req.params.id;
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit) || 10, 1);
        const skip = (page - 1) * limit;

        const post = await CommunityPost.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        // pre sort before pagination
        const sortedComments = post.comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        paginatedComments = sortedComments.slice(skip, skip + limit).map(comment => comment.toObject ? comment.toObject() : comment);
        
        // Sync user data in comments
        const syncedPost = await syncUserDataInPosts([{ ...post, comments: paginatedComments }]);
        paginatedComments = syncedPost[0].comments;
        
        
        res.status(200).json({
            success: true,
            count: paginatedComments.length,
            totalComments: post.comments.length,
            totalPages: Math.ceil(post.comments.length / limit),
            currentPage: page,
            data: paginatedComments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching comments",
            error: error.message,
        });
    }
};

// Share a post
const sharePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({ success: false, message: "Invalid post ID" });
        }

        const post = await CommunityPost.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Prevent multiple shares by the same user
        if (post.sharedBy.includes(userId)) {
            return res.status(400).json({ success: false, message: "You have already shared this post" });
        }

        post.shares += 1;
        post.sharedBy.push(userId);
        await post.save();

        res.status(200).json({
            success: true,
            message: "Post shared successfully",
            shares: post.shares,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "An error occurred while sharing the post",
            error: err.message,
        });
    }
};

// Delete a post
const deletePost = async (req, res) => {
        try {
            // Grab postId and UserId to find the post and delete it
            const postId  = req.params.id
            const userId = req.user._id
            // Find the post related to the user
            const post = await CommunityPost.findById(postId)
            if (!post) {
                return res.status(404).json({ success: false, message: "Post not found" })
            }

            // Check if the User Owns the Post 
            if (post.user._id.toString() !== userId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "Not authorized to delete this post",
                })
            }
            // Delete the post using postId
            const deleted_post = await CommunityPost.findByIdAndDelete(postId)
            console.log(deleted_post)

            res.status(200).json({ success: true, message: "Post deleted successfully" })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error deleting post",
                error: error.message,
            })
        }
    }

// Update a post
const updatePost = async (req, res) => {
    const { id: postId } = req.params;
    const userId = req.user._id;
    const { content } = req.body; 
    try {
        console.log("Authenticated user ID:", req.user._id);

        // Check if the content is empty or only contains whitespace
        if (content && content.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Content cannot be empty" });
        }

        // Find the post first to check ownership
        const post = await CommunityPost.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        console.log("Post owner ID:", post.user.toString());
        console.log("Authenticated user ID:", userId.toString());
        // Check if the user is the owner of the post before updating
        if (post.user._id.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to update this post" });
        }

        // If content is provided, use it; otherwise, retain the original content
        const updatedPost = await CommunityPost.findByIdAndUpdate(
            postId,
            { 
                content: content || post.content,
                updated_at: new Date(),  // Add timestamp
                is_edited: true          // Mark as edited
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post: updatedPost
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the post",
            error: error.message
        });
    }
};

// Export modules
module.exports = {
    getPost,
    getAllPosts,
    createPost,
    sharePost,
    uploadPostImage,
    updatePost,
    deletePost,
    addComment,
    getPostComments,
    likePost,
    unlikePost,
    updateComment,
    deleteComment
}
