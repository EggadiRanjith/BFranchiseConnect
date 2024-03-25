
const Message = require('../models/message');
const User = require('../models/user');
const { Op, sequelize } = require('sequelize');

const getMessages = async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;

    // Fetch messages from the database and include associated users
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          {
            sender_id: userId,
            receiver_id: otherUserId,
          },
          {
            sender_id: otherUserId,
            receiver_id: userId,
          },
        ],
      },
      order: [['timestamp', 'ASC']], // Order by timestamp in ascending order
      include: [
        { model: User, as: 'sender', attributes: ['username', 'profile_picture'] },
        { model: User, as: 'receiver', attributes: ['username', 'profile_picture'] },
      ],
    });

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const createMessage = async (req, res) => {
  try {
    const { sender_id, receiver_id, message_content, timestamp } = req.body;

    // Insert the new message into the database
    const newMessage = await Message.create({
      sender_id,
      receiver_id,
      message_content,
      timestamp,
    });

    res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};
const getChattedUserProfiles = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all messages where the current user is either the sender or receiver
    const chattedMessages = await Message.findAll({
      where: {
        [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
      },
      order: [['createdAt', 'DESC']], // Order messages by creation time in descending order
      attributes: ['sender_id', 'receiver_id', 'message_content', 'createdAt'], // Include message content and creation time
    });

    // Extract unique user IDs from sender and receiver IDs excluding the current user ID
    const allUserIds = chattedMessages.reduce((ids, message) => {
      if (message.sender_id !== userId) {
        ids.add(message.sender_id);
      }
      if (message.receiver_id !== userId) {
        ids.add(message.receiver_id);
      }
      return ids;
    }, new Set());

    // Convert Set of user IDs to an array and exclude the current user's ID
    const uniqueUserIds = Array.from(allUserIds).filter(id => id !== parseInt(userId));

    // Fetch user profiles based on the unique user IDs
    let chattedUserProfiles = await User.findAll({
      where: {
        user_id: uniqueUserIds,
      },
      attributes: ['user_id', 'username', 'profile_picture'], // Customize attributes as needed
    });

    // Filter out the current user's profile from the list of chatted user profiles
    chattedUserProfiles = chattedUserProfiles.filter(profile => profile.user_id !== parseInt(userId));

    // Map chatted user profiles with their last message
    let chattedUsersWithLastMessage = chattedUserProfiles.map(user => {
      const lastMessage = chattedMessages.find(message => 
        message.sender_id === user.user_id || message.receiver_id === user.user_id
      );
      return {
        ...user.toJSON(),
        last_message: lastMessage ? lastMessage.message_content : null,
        last_message_time: lastMessage ? lastMessage.createdAt : null,
      };
    });

    // Sort chatted users by the last message time in descending order
    chattedUsersWithLastMessage.sort((a, b) => (a.last_message_time > b.last_message_time) ? -1 : 1);

    res.json({ chattedUserProfiles: chattedUsersWithLastMessage });
    console.log(chattedUsersWithLastMessage);
  } catch (error) {
    console.error('Error fetching chatted user profiles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  getMessages,
  createMessage,
  getChattedUserProfiles,
};
