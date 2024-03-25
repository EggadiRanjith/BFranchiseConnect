const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User  = require('../models/user');
const bussiness  = require('../models/bussiness');
const Application = require('../models/applicationforbussiness');

// Registration route handler
async function register(req, res) {
  try {
    const { username, email, password, contactInfo, address ,profilePicture,user_type } = req.body;

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await User.create({
      username,
      email,
      user_type: user_type,
      password: hashedPassword,
      contact_info: contactInfo,
      profile_picture:profilePicture,
      address,
    });
    
    res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError' && error.errors.length > 0 && error.errors[0].path === 'email') {
        // Handle unique constraint error for email
        console.error('Email already exists:', error.errors[0].message);
        res.status(400).json({ message: 'Email already exists' });
      } else {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }    
}

const registerBusiness = async (req, res) => {
  const {
    business_name,
    user_id,
    description,
    industry_type,
    registration_number,
    registered_address,
    contact_info,
    minimum_investment,
    investment_details,
    partnership_details,
    franchise_opportunities,
    financial_performance,
    growth_potential,
    business_plan,
    exit_strategy,
    terms_and_conditions,
    /* Add other fields as needed */
  } = req.body;

  try {
    // Create a new business associated with the user
    const newBusiness = await bussiness.create({
      business_name: business_name,
      user_id,
      description,
      industry_type,
      registration_number,
      registered_address,
      contact_info,
      minimum_investment,
      investment_details,
      partnership_details,
      franchise_opportunities,
      financial_performance,
      growth_potential,
      business_plan,
      exit_strategy,
      terms_and_conditions,
      /* Add other fields as needed */
    });

    // Update user table with verification status "agreed"
    await User.update({ verification_status: 'agreed' }, { where: { user_id: user_id } });

    // Return success response
    return res.status(200).json({ message: 'Business registered successfully', newBusiness });
  } catch (error) {
    console.error('Error registering business:', error);
    // Handle the error response appropriately
    return res.status(500).json({ error: 'Error registering business' });
  }
};



async function login(req, res, secretKey) {
  try {
    const { email, password } = req.body;

    // Find the user by email in the database
    const user = await User.findOne({ where: { email } });

    if (!user) {

      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', user.toJSON());

    // Check if the provided password matches the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Include the "userId" and "username" in the token payload
    const token = jwt.sign({ userId: user.user_id, username: user.username }, secretKey, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, userId: user.user_id, username: user.username,user_type:user.user_type });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



async function getProfile(req, res) {
  // Assuming authenticated user (userId) is available in req
  const userId = req.userId;

  try {
    // Fetch user data from the database including fields from the Business and Application models
    const user = await User.findByPk(userId, {
      attributes: ['user_id', 'user_type', 'username', 'profile_picture', 'email', 'contact_info', 'address', 'createdAt', 'updatedAt', 'verification_status'],
      include: [
        {
          model: bussiness,
          attributes: ['business_id', 'admin_approval_status',], // Add fields from the Business model
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user data as the profile
    res.json({ message: 'Profile retrieved successfully', user });
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}




function authenticateMiddleware(req, res, next) {
  // Your authentication logic here (e.g., verify JWT)
  const token = req.headers.authorization;

  if (!token) {
    console.error('Token not provided. Returning 401.');  // Log that token is not provided
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Debug log: Attempting to verify the token
    const decodedToken = jwt.verify(token.replace('Bearer ', ''), 'your_secret_key');


    // Set userId in the request for further processing
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    // Debug log: Log the error details
    console.error('Authentication error:', error);

    // Send unauthorized response
    res.status(401).json({ message: 'Unauthorized' });
  }
}

// Controller function to update user settings
// Controller function to update user settings
const updateUserSettings = async (req, res) => {
  try {
    const storedUserId = req.params.storedUserId;
    const { name, location, contact_info, two_factor_auth, password, profile_picture } = req.body;

    // Assuming you have a User model
    const user = await User.findOne({ where: { user_id:storedUserId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user settings
    user.username = name;
    user.address = location;
    user.contact_info = contact_info;
    user.two_factor_auth = two_factor_auth;

    // Update password if provided
    if (password) {
      // Assuming you have a password hashing function named hashPassword
      user.password = await bcrypt.hash(password, 10);
    }

    // Update profile picture URL if provided
    if (profile_picture) {
      user.profile_picture = profile_picture;
    }

    // Save the updated user data
    await user.save();

    // Fetch and return the updated user data
    const updatedUser = await User.findOne({ where: { user_id:storedUserId } });
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  register,
  registerBusiness,
  login,
  updateUserSettings,
  getProfile,
  authenticateMiddleware,
};
