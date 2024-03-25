// Import the necessary models
const { Post } = require('../models/post');
const Comment = require('../models/comments');
const User = require('../models/user');
const Notification = require('../models/notification');

// Callback to be invoked after successfully saving, liking, or deleting a post
const refreshPostsCallback = async () => {
  try {
    console.log('Fetching posts from the database...');
    const posts = await Post.findAll({
      include: [User, Comment], // Include associations if necessary
    });

    console.log('Fetched posts successfully:', posts);
    // You can update the state, re-render, or perform any action with the refreshed posts
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Handle the error appropriately
  }
};

// Function to save a post to the database
const savePost = async (postData) => {
  try {
    // Insert post data into the 'posts' table (adjust table/column names as needed)
    const result = await Post.create(postData);
    await refreshPostsCallback();

    // Return a success message or any other relevant data
    return { success: true, message: 'Post saved successfully', post: result };
  } catch (error) {
    console.error('Error saving post:', error);
    throw error; // Propagate the error to be caught in the calling function
  }
};

const fetchPosts = async () => {
  try {
    console.log('Fetching posts from the database...');
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['user_id', 'username', 'profile_picture'], // Add the user attributes you want to include
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['user_id', 'username'], // Add the user attributes for comments
            },
          ],
        },
        {
          model: Notification,
        },
      ],
      order: [['createdAt', 'DESC']], // Order by createdAt field in descending order
    });
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    throw error;
  }
};





const toggleLikePost = async (postId, isLikeRequest) => {
  try {
    // Assuming you have a 'likes' column in your 'posts' table
    const post = await Post.findByPk(postId);

    // If post is not found, throw an error
    if (!post) {
      throw new Error('Post not found');
    }

    // Determine the action based on the request type
    let likesCount = post.likes;
    if (isLikeRequest) {
      likesCount++; // Increment likes count for POST request
    } else {
      likesCount = Math.max(0, likesCount - 1); // Decrement likes count for DELETE request, ensuring it never goes below 0
    }

    // Update the likes count in the database
    await Post.update({ likes: likesCount }, { where: { post_id: postId } });

    // Refresh posts or update state to reflect changes
    await refreshPostsCallback();

    // Return a success message or any other relevant data
    return { success: true, message: `Post ${isLikeRequest ? 'liked' : 'unliked'} successfully` };
  } catch (error) {
    console.error('Error toggling like for post:', error);
    throw error; // Propagate the error to be caught in the calling function
  }
};



// Function to save a comment to the database
const saveComment = async (commentData) => {
  try {
    // Insert comment data into the 'comments' table (adjust table/column names as needed)
    const result = await Comment.create(commentData);
    await refreshPostsCallback(); // Assuming you want to refresh posts after saving a comment

    // Return a success message or any other relevant data
    return { success: true, message: 'Comment saved successfully', comment: result };
  } catch (error) {
    console.error('Error saving comment:', error);
    throw error; // Propagate the error to be caught in the calling function
  }
};

// Function to delete a post from the database
const deletePost = async (postId) => {
  try {
    // Assuming you have a 'posts' table with a primary key 'post_id'
    const result = await Post.destroy({ where: { post_id: postId } });

    // Check if any rows were affected
    if (result === 0) {
      throw new Error('Post not found'); // Throw an error if the post is not found
    }
    await refreshPostsCallback();
    // Return a success message or any other relevant data
    return { success: true, message: 'Post deleted successfully' };
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error; // Propagate the error to be caught in the calling function
  }
};

// Function to update a post in the database
const updatePost = async (postId, updatedContent) => {
  try {
    // Assuming you have a 'posts' table with a primary key 'post_id'
    const result = await Post.update(
      { content: updatedContent },
      { where: { post_id: postId } }
    );

    // Check if any rows were affected
    if (result[0] === 0) {
      throw new Error('Post not found'); // Throw an error if the post is not found
    }
    await refreshPostsCallback();
    // Return a success message or any other relevant data
    return { success: true, message: 'Post updated successfully' };
  } catch (error) {
    console.error('Error updating post:', error);
    throw error; // Propagate the error to be caught in the calling function
  }
};

// Function to fetch individual details of a post based on its ID
const fetchPostDetailsById = async (postId) => {
  try {
    console.log(`Fetching details for post with ID ${postId} from the database...`);
    const post = await Post.findOne({
      where: { post_id: postId },
      include: [
        {
          model: User,
          attributes: ['user_id', 'username', 'profile_picture'], // Add the user attributes
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['user_id', 'username','profile_picture'], // Add the user attributes for comments
            },
          ],
        },
      ],
    });

    if (!post) {
      throw new Error('Post not found');
    }

    console.log('Fetched post details successfully:', post);
    return post;
  } catch (error) {
    console.error(`Error fetching details for post with ID ${postId}:`, error);
    throw error;
  }
};

// Function to fetch user posts from the database
const fetchUserPosts = async (userId) => {
  try {
    console.log('Fetching user posts for userId:', userId);

    const posts = await Post.findAll({
      where: {
        author_id: userId,
      },
      include: [
        {
          model: User,
          attributes: ['user_id', 'username', 'profile_picture'],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['user_id', 'username'], // Add the user attributes for comments
            },
          ],
        },
      ],
    });

    console.log('User posts fetched successfully:', posts);
    return posts;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

module.exports = {
  savePost,
  fetchPosts,
  toggleLikePost ,
  saveComment,
  deletePost,
  updatePost, // Add the new function to the exports
  fetchPostDetailsById,
  fetchUserPosts,
};
