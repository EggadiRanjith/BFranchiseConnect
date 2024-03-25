// backend/functions/fetchPendingApplications.js

const Business = require('../models/bussiness'); // Assuming you have a Business model defined

async function fetchPendingApplications() {
    try {
      // Find all documents ordered by createdAt in descending order
      const pendingApplications = await Business.findAll({
        order: [['createdAt', 'DESC']]
      });
      return pendingApplications;
    } catch (error) {
      console.error('Error fetching pending applications:', error.message);
      throw new Error('Failed to fetch pending applications');
    }
  }
  

  async function updateBusinessStatus(businessId, newStatus) {
    try {
      // Find the business by ID
      const business = await Business.findByPk(businessId);
      if (!business) {
        throw new Error('Business not found');
      }
  
      // Update the business status
      business.admin_approval_status = newStatus;
      await business.save();
  
      // Check if the status is "agreed" or "cancelled"
      if (newStatus === 'agreed' || newStatus === 'cancelled') {
        const senderId =  0;
        const receiverId = business.user_id;
        const notificationContent = `Business ${business.username} status has been updated to ${newStatus}`;
  
        // Create the notification
        await Notification.create({
          sender_id: senderId,
          receiver_id: receiverId,
          post_id: 0,
          notification_content: notificationContent,
          type: 'business_status_update',
        });
      }
  
      return business;
    } catch (error) {
      console.error('Error updating business status:', error.message);
      throw new Error('Failed to update business status');
    }
  }
  

module.exports = { fetchPendingApplications ,updateBusinessStatus };
