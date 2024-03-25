const Notification = require('../models/notification'); // Assuming you have a Notification model
const User  = require('../models/user');

// Insert notification function
const insertNotification = async (senderId, receiverId, content, type, post_id) => {
  try {
    console.log(post_id)
    // Insert notification into the 'notifications' table (adjust table/column names as needed)
    const notification = await Notification.create({
      sender_id: senderId,
      receiver_id: receiverId,
      post_id:post_id,
      notification_content: content,
      notification_timestamp: new Date(),
      read_status: 'unread', // Default status is 'unread'
      type: type,
    });

    return notification;
  } catch (error) {
    console.error('Error inserting notification:', error);
    throw error;
  }
};

const fetchNotifications = async (userId) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        receiver_id: userId,
      },
      include: [
        {
          model: User, // Assuming you have a User model
          as: 'sender', // Set the alias for the association
          attributes: ['username', 'email', 'profile_picture'], // Include specific attributes
        },
      ],
    });

    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};
const updateReadStatus = async (req, res) => {
  const notificationId = req.params.notificationId;
  const status = req.body.read_status; // Assuming read_status is sent in the request body

  try {
    // Find the notification by its primary key
    const notification = await Notification.findByPk(notificationId);
    if (notification) {
      // Update the read status
      notification.read_status = status;
      await notification.save();
      console.log(`Notification ${notificationId} marked as ${status}`);
      res.status(200).send(`Notification ${notificationId} marked as ${status}`);
    } else {
      console.error(`Notification ${notificationId} not found`);
      res.status(404).send(`Notification ${notificationId} not found`);
    }
  } catch (error) {
    console.error('Error updating notification status:', error);
    res.status(500).send('Internal server error');
  }
};



module.exports = { insertNotification, fetchNotifications ,updateReadStatus};
