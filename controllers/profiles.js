const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const User = require('../models/user'); // Import your Sequelize User model
const Business = require('../models/business'); // Import the Business model
const Application = require('../models/applicationforbusiness');

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Fetching user profile for userId:', userId);

    const user = await User.findByPk(userId, {
      attributes: ['username', 'user_type', 'email', 'address', 'profile_picture', 'contact_info', 'user_id'],
      include: {
        model: Business,
        attributes: [
          'business_id',
          'user_id',
          'description',
          'industry_type',
          'registration_number',
          'registered_address',
          'contact_info',
          'admin_approval_status',
          'registration_date',
          'minimum_investment',
          'investment_details',
          'partnership_details',
          'franchise_opportunities',
          'financial_performance',
          'growth_potential',
          'business_plan',
          'exit_strategy',
          'terms_and_conditions',
        ],
      },
    });

    if (!user) {
      console.log('User not found for userId:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User profile fetched successfully:', user);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllProfiles = async (req, res) => {
  try {
    const profiles = await User.findAll({
      attributes: ['user_id', 'username', 'profile_picture'],
    });

    res.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const searchProfiles = async (req, res) => {
  const { query } = req.query;

  try {
    const profiles = await User.findAll({
      attributes: ['user_id', 'username', 'profile_picture'],
      where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('username')), {
        [Sequelize.Op.like]: `%${query.toLowerCase()}%`,
      }),
    });

    console.log('Received GET request at /api/search with query:', query);
    res.json(profiles);
  } catch (error) {
    console.error('Error searching profiles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const fetchBusinessData = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    const business = await Business.findOne({ where: { user_id: userId } });

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json(business);
  } catch (error) {
    console.error('Error fetching business data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateBusinessProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('xfh',userId);
    const updatedData = req.body;

    const business = await Business.findOne({ where: { user_id: userId} });

    if (!business) {
      return res.status(404).json({ error: 'Business profile not found' });
    }

    await Business.update(updatedData, { where: { user_id: userId } });

    const updatedBusiness = await Business.findOne({ where: { user_id: userId } });
    res.json(updatedBusiness);
  } catch (error) {
    console.error('Error updating business profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const fetchBusinessProfile = async (req, res) => {
  try {
    console.log("Fetching business profiles...");
    
    const bussiness_id = req.params.bussiness_id;
    console.log(bussiness_id);
    // Fetch all applications that meet the specified criteria, including the business ID check
    const applications = await Application.findAll({ 
      where: { 
        business_id: bussiness_id,
        application_status: 'agreed', 
        investor_verification_status: 'agreed' 
      },
      include: [
        { 
          model: User,
          as: 'investor',
          attributes: ['username', 'email','contact_info','user_id'] // Specify the correct alias for the association
        },
        {
          model : Business ,
          as : "business",
          attributes: ['business_id'],
        }
      ]
    });
    
    console.log('Business profiles fetched successfully:', applications);
    res.json(applications);
  } catch (error) {
    console.error('Error fetching business profiles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const fetchBusiness = async (req, res) => {
  try {
    console.log("Fetching business profiles...");
    
    const user_id = req.params.user_id;
    console.log(user_id);
    // Fetch all applications that meet the specified criteria, including the business ID check
    const applications = await Application.findAll({ 
      where: { 
        investor_id : user_id,
        application_status: 'agreed', 
        investor_verification_status: 'agreed' 
      },
      include: [
        { 
          model: User,
          as: 'investor',
          attributes: ['username', 'email','contact_info','user_id'] // Specify the correct alias for the association
        },
        {
          model : Business ,
          as : "business",
          attributes: ['business_id','business_name'],
          include: [
            {
              model: User,
              attributes: ['username', 'email','contact_info','user_id']
            }
          ]
        }
      ]
    });
    
    console.log('Business profiles fetched successfully:', applications);
    res.json(applications);
  } catch (error) {
    console.error('Error fetching business profiles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  getUserProfile,
  getAllProfiles,
  searchProfiles,
  fetchBusinessData,
  updateBusinessProfile,
  fetchBusinessProfile, 
  fetchBusiness,// Add the new function here
};

