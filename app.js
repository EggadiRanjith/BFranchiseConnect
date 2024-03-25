// Import necessary modules and configurations
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io'); // Use Socket.IO for real-time communication
const sequelize = require('./config/database');
const { register, login, getProfile, registerBusiness, authenticateMiddleware, updateUserSettings } = require('./controllers/authController');
const { savePost, fetchPosts, toggleLikePost , saveComment, fetchPostDetailsById, deletePost, fetchUserPosts, updatePost } = require('./controllers/post');
const { insertNotification, fetchNotifications,updateReadStatus } = require('./controllers/notificationController');
const { getUserProfile, getAllProfiles, searchProfiles ,fetchBusinessData,updateBusinessProfile,fetchBusinessProfile,fetchBusiness} = require('./controllers/profiles');
const { getMessages, createMessage,getChattedUserProfiles } = require('./controllers/message');
const { submitForm ,updateApplicationStatus,getApplicationById} = require('./controllers/applications');
const { fetchFinancialData,submitFinancialData  } = require('./controllers/financials');
const { fetchadmindata } =require('./controllers/admin')
const { fetchPendingApplications , updateBusinessStatus } =require('./controllers/bussiness')

const Application = require('./models/applicationforbussiness');
const Financial = require('./models/financial');
// Initialize the Express app and create an HTTP server
const app = express();
const server = http.createServer(app);

// Set up middleware
app.use(cors());
app.use(bodyParser.json());

// Set your secret key for authentication
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

// Sync the models with the database
sequelize.sync()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

// Integrate Socket.IO with the server
const io = socketIo(server);

// In the server-side code
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('message', (data) => {
    console.log('Message received:', data);
    // Emit the message to all clients, including the sender
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Registration route
app.post('/api/register', register);

// Business registration route
app.post('/api/register-business', registerBusiness);

// Login route
app.post('/api/login', (req, res) => login(req, res, secretKey));

// Protected route for retrieving user profile
app.get('/api/profile', authenticateMiddleware, getProfile);

// Update user settings route
app.put('/api/update-settings/:storedUserId', updateUserSettings);

// Route for retrieving user profile without authentication middleware
app.get('/api/user/profile/:userId', getUserProfile);

app.get('/api/user/profiles', getAllProfiles);

app.get('/api/user/search', searchProfiles);

// POST endpoint to handle post creation
app.post('/api/posts', async (req, res) => {
  const postData = req.body;

  try {
    // Save the post using the savePost function
    const result = await savePost(postData);

    // Send a JSON response with the saved post data
    res.status(201).json(result);
  } catch (error) {
    console.error('Error saving post on the server:', error);
    // Send an error response
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch posts
app.get('/api/posts', async (req, res) => {
  try {
    // Fetch posts using the fetchPosts function
    const posts = await fetchPosts();

    // Send a JSON response with the fetched posts
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

// Route to like a post
app.post('/api/posts/:postId/like', async (req, res) => {
  const postId = req.params.postId;

  try {
    // Call the toggleLikePost function to handle post liking, passing true to indicate like request
    const result = await toggleLikePost(postId, true);

    // Send a JSON response with the result
    res.json(result);
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Error liking post' });
  }
});

// Route to unlike a post
app.delete('/api/posts/:postId/like', async (req, res) => {
  const postId = req.params.postId;

  try {
    // Call the toggleLikePost function to handle post unliking, passing false to indicate unlike request
    const result = await toggleLikePost(postId, false);

    // Send a JSON response with the result
    res.json(result);
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ error: 'Error unliking post' });
  }
});


app.post('/api/posts/:postId/comments', async (req, res) => {
  const postId = req.params.postId;
  const commentData = req.body;

  try {
    // Call the saveComment function to handle comment saving
    const result = await saveComment({ postId, ...commentData });

    // Send a JSON response with the result
    res.status(201).json(result);
  } catch (error) {
    console.error('Error saving comment:', error);
    res.status(500).json({ error: 'Error saving comment' });
  }
});

app.post('/api/insert-notification', async (req, res) => {
  try {
    // Assuming senderId, receiverId, content, and type are sent in the request body
    const { senderId, receiverId, content, type,post_id } = req.body;

    // Call the insertNotification function from the controller
    const newNotification = await insertNotification(senderId, receiverId, content, type,post_id);

    // Send a success response with the inserted notification details
    res.status(201).json({ success: true, notification: newNotification });
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error handling notification insertion:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Route to fetch individual post details
app.get('/api/posts/:postId', async (req, res) => {
  const postId = req.params.postId;

  try {
    // Call the fetchPostDetailsById function to get individual post details
    const postDetails = await fetchPostDetailsById(postId);

    // Send a JSON response with the fetched post details
    res.json(postDetails);
  } catch (error) {
    console.error(`Error fetching details for post with ID ${postId}:`, error);
    res.status(500).json({ error: 'Error fetching post details' });
  }
});

// Route to delete a post
app.delete('/api/posts/:postId', async (req, res) => {
  const postId = req.params.postId;

  try {
    // Call the deletePost function to delete the post
    const result = await deletePost(postId);

    // Send a JSON response with the result
    res.json(result);
  } catch (error) {
    console.error(`Error deleting post with ID ${postId}:`, error);
    res.status(500).json({ error: 'Error deleting post' });
  }
});

// Route to handle fetching notifications
app.get('/api/notifications/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const notifications = await fetchNotifications(userId);
    res.json(notifications);
  } catch (error) {
    console.error('Error handling notification fetch request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/posts/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await fetchUserPosts(userId);
    res.json({ posts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update a post
app.put('/api/posts/:postId', async (req, res) => {
  const postId = req.params.postId;
  const updatedContent = req.body.content; // Assuming you send the updated content in the request body

  try {
    // Call the handleUpdatePost function to update the post
    const result = await updatePost(postId, updatedContent);

    // Send a JSON response with the result
    res.json(result);
  } catch (error) {
    console.error(`Error updating post with ID ${postId}:`, error);
    res.status(500).json({ error: 'Error updating post' });
  }
});

// Fetch messages between two users
app.get('/api/messages/:userId/:otherUserId', getMessages);

// Insert a new message into the database
app.post('/api/messages',createMessage);

app.put('/api/notifications/:notificationId',updateReadStatus);

app.get('/api/messages/:userId',getChattedUserProfiles);

app.get('/api/businesses/:userId',fetchBusinessData);

app.post('/api/submitform',submitForm);

app.put('/api/businesses/:userId',updateBusinessProfile);

// Route handler
app.put('/api/updateApplicationStatus/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application_status = req.body.application_status;
    const result = await updateApplicationStatus(req, res, applicationId, application_status);
    // Don't send response here, let updateApplicationStatus handle it
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/api/applications/:applicationid',getApplicationById);

app.get('/api/franchiseProfiles/:bussiness_id',fetchBusinessProfile);

app.get('/api/businessProfiles/:user_id',fetchBusiness);

app.get('/api/financial-data', fetchFinancialData);

app.post('/api/submitData', submitFinancialData );

// Route to fetch admin data
app.get('/api/fetchadmindata', async (req, res) => {
  try {
    const adminData = await fetchadmindata(); // Call fetchadmindata function
    res.json(adminData); // Send the admin data as JSON response
    console.log('Admin data fetched successfully:', adminData);
  } catch (error) {
    console.error('Error fetching admin data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/pendingBusinessApplications', async (req, res) => {
  try {
    const pendingApplications = await fetchPendingApplications();
    res.json(pendingApplications);
  } catch (error) {
    console.error('Error fetching pending applications:', error.message);
    res.status(500).json({ error: 'Failed to fetch pending applications' });
  }
});

// Route to update business status
app.post('/api/updateBusinessStatus', async (req, res) => {
  const { businessId, status } = req.body;

  try {
    // Call the updateBusinessStatus function
    const updatedBusiness = await updateBusinessStatus(businessId, status);
    res.status(200).json({ message: 'Business status updated successfully', business: updatedBusiness });
  } catch (error) {
    console.error('Error updating business status:', error.message);
    res.status(500).json({ error: 'Failed to update business status' });
  }
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
