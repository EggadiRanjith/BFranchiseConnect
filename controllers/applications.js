const Application = require('../models/applicationforbusiness');
const Message = require('../models/message');
const Business = require('../models/business');
const User = require('../models/user');
const Notification = require('../models/notification');
const { application } = require('express');
// Assuming you have already defined your FormSubmission model

const submitForm = async (req, res) => {
  try {
    const formData = req.body;

    // Insert the form submission into the FormSubmission table
    const newSubmission = await Application.create(formData);

    // Find the business associated with the provided business_id
    const business = await Business.findOne({ where: { business_id: formData.business_id } });
    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }

    // Access the user_id associated with the business
    const receiverId = business.user_id;

    const user = await User.findOne({ where: { user_id: formData.investor_id } });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    } 

    // Create a formatted string representation of the form data excluding investor_id and business_id
    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(([key]) => key !== 'investor_id' && key !== 'business_id')
    );

    const formattedFormData = Object.entries(filteredFormData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    // Append application_id to the formatted message
    const messageContent = `New form submission -- ${formattedFormData}\napplication_id: ${newSubmission.application_id}`;

    // Insert the form data into the Messages table
    const messageData = {
      sender_id: formData.investor_id,
      receiver_id: receiverId,
      message_content: messageContent,
      timestamp: new Date(),
    };
    await Message.create(messageData);

    // Insert the notification into the Notifications table
    const notificationData = {
      sender_id: formData.investor_id,
      receiver_id: receiverId,
      type: 'Application',
      post_id:'null',
      notification_content: `New form submission by ${user.username}`,
      notification_timestamp: new Date(),
      read_status: 'unread', // Assuming notifications are initially unread
    };
    await Notification.create(notificationData);

    res.status(201).json({
      success: true,
      submission: newSubmission,
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

  

  const getApplicationById = async (req, res) => {
    try {
      const applicationid = req.params.applicationid;
      
      // Fetch the application by its ID
      const application = await Application.findByPk(applicationid);
  
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
  
      res.json({ application });
    } catch (error) {
      console.error('Error fetching application:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  


  const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { application_status, investor_verification_status } = req.body;

        if (!application_status && !investor_verification_status) {
            return res.status(400).json({ success: false, error: 'No status provided' });
        }

        const application = await Application.findByPk(applicationId);
        if (!application) {
            return res.status(404).json({ success: false, error: 'Application not found' });
        }

        // Update the application status based on the action
        if (application_status === 'cancelled') {
            application.application_status = 'cancelled';
        } else if (application_status === 'Agreed') {
            application.application_status = 'agreed';
        }

        // Update the investor verification status if provided
        if (investor_verification_status) {
            application.investor_verification_status = investor_verification_status;

            // If investor verification status is 'Agreed', update user type to 'franchiseuser'
            if (investor_verification_status === 'agreed') {
                const investorId = application.investor_id;
                const user = await User.findByPk(investorId);
                if (!user) {
                    return res.status(404).json({ success: false, error: 'User not found' });
                }
                user.user_type = 'franchise';
                user.verification_status ='agreed';
                await user.save();
            }
        }

        await application.save();

        // Fetch the business associated with the application
        const business = await Business.findByPk(application.business_id);
        if (!business) {
            return res.status(404).json({ success: false, error: 'Business not found' });
        }

        // Create a message for the agreement if the application status is 'agreed'
        if (application_status === 'Agreed') {
            const messageContent = `Congratulations! Your application has been agreed for ${business.business_name}`;
            const messageData = {
                sender_id: business.user_id,
                receiver_id: application.investor_id,
                message_content: messageContent,
                message_timestamp: new Date().toISOString(),
                read_status: 'unread', // Assuming messages are initially unread
            };
            try {
                await Message.create(messageData);
            } catch (messageError) {
                console.error('Error creating message:', messageError);
                return res.status(500).json({ success: false, error: 'Error creating message' });
            }
        }

// Insert notification for the status update
if (application_status === 'cancelled' || application_status === 'agreed') {
  const notificationContent = application_status === 'cancelled' ?
      `Your application has been cancelled for ${business.business_name}` :
      `Your application has been agreed for ${business.business_name}`;

  const notificationData = {
      sender_id: business.user_id,
      receiver_id: application.investor_id,
      type: 'ApplicationStatusUpdate',
      post_id: applicationId,
      notification_content: notificationContent,
      notification_timestamp: new Date().toISOString(),
      read_status: 'unread', // Assuming notifications are initially unread
  };
  await Notification.create(notificationData);
}


        return res.status(200).json({ success: true, message: 'Application status updated successfully' });
    } catch (error) {
        console.error('Error updating application status:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};



module.exports = {
  submitForm,
  getApplicationById,
  updateApplicationStatus,
};
