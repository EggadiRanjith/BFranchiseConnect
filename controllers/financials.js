// controllers/financials.js

// Required modules and models
const Application = require('../models/applicationforbusiness');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');
const Notification = require('../models/notification');
const Business = require('../models/business');

// Function to fetch financial data
const fetchFinancialData = async (req, res) => {
  try {
    // Extract the parameters from the request query
    const { business_id, user_id } = req.query;

    // Query to fetch financial data based on the provided query parameters
    const query = `
      SELECT * 
      FROM financials 
      WHERE business_id = :business_id AND investor_id = :user_id
    `;

    // Execute the query
    const financialData = await sequelize.query(query, {
      replacements: { business_id, user_id },
      type: QueryTypes.SELECT,
    });

    // Check if financial data is found
    if (!financialData || financialData.length === 0) {
      return res.status(404).json({ error: 'Financial data not found' });
    }

    // Return the fetched financial data
    res.json(financialData);
  } catch (error) {
    // Handle errors
    console.error('Error fetching financial data:', error.message || error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to remove a franchise
const removeFranchise = async (req, res) => {
  try {
    // Extract the franchise ID from the request body
    const { franchiseId } = req.body;

    // Find the application record in the database based on the franchise ID
    const application = await Application.findOne({ where: { application_id: franchiseId } });

    // Check if the application record exists
    if (!application) {
      return res.status(404).json({ success: false, error: 'Franchise application not found' });
    }
    
    // Extract business and investor IDs
    const businessId = application.business_id;
    const investorId = application.investor_id;

    // Update application and investor verification status to 'cancelled'
    await Application.update(
      { application_status: 'cancelled' },
      { where: { application_id: franchiseId } }
    );

    await Application.update(
      { investor_verification_status: 'cancelled' },
      { where: { investor_id: investorId } }
    );

    // Fetch business details
    const business = await Business.findOne({ where: { business_id: businessId } });

    // Create a notification for franchise removal
    const notification = await Notification.create({
      sender_id: business.user_id,
      receiver_id: investorId,
      post_id: 0,
      notification_content: 'You have been removed as a franchise',
      notification_timestamp: new Date(),
      read_status: 'unread',
      type: 'franchise_removed',
    });

    // Return success response
    res.status(200).json({ success: true, message: 'Franchise removed successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error removing franchise:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Export functions
module.exports = { fetchFinancialData, removeFranchise };
