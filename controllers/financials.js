// Import the financial model
const FinancialData = require('../models/financial');
const Application = require('../models/applicationforbussiness');

// Function to fetch financial data
const fetchFinancialData = async (req, res) => {
  try {
    console.log('hi')
    // Extract the parameters from the request query
    const { application_id, business_id, user_id } = req.query;

    // Find financial data based on the provided query parameters
    const financialData = await FinancialData.findAll({
      where: {
        application_id: application_id,
        business_id: business_id,
        investor_id: user_id
      }
    });

    // Check if financial data is found
    if (!financialData) {
      return res.status(404).json({ error: 'Financial data not found' });
    }

    // Return the fetched financial data
    res.json(financialData);
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to submit financial data
const submitFinancialData = async (req, res) => {
  try {
    // Extract the data from the request body
    const { user_id, business_id, selectedDate, incomeDescription, investment, income } = req.body;

    // Find application using user_id, business_id, and with agreed status
    const application = await Application.findOne({ 
      user_id, 
      business_id, 
      application_status: 'agreed', 
      investor_verification_status: 'agreed' 
    });

    if (!application) {
      return res.status(404).json({ success: false, error: 'Agreed application not found' });
    }

    // Create or update financial data in the database
    const createdFinancialData = await FinancialData.create({
      application_id: application.application_id, // Assuming _id is the primary key of Application model
      business_id,
      investor_id: user_id,
      investment_date: selectedDate,
      description: incomeDescription,
      investment_amount:investment,
      income_amount:income
      // Add other fields as needed
    });

    // Return success response
    res.status(200).json({ success: true, message: 'Financial data submitted successfully', data: createdFinancialData });
  } catch (error) {
    console.error('Error submitting financial data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


// Export the submitFinancialData function
module.exports = { fetchFinancialData, submitFinancialData };

