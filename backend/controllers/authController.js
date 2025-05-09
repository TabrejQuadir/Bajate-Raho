const User = require('../models/UserSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { email, username, password, confirmPassword } = req.body;
  
    // Check if all fields are provided
    if (!email || !username || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
  
    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
  
    try {
      // Check if the email or username already exists
      const userExists = await User.findOne({ $or: [{ email }, { username }] });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create a new user
      const user = new User({ email, username, password });
  
      // Save the user to the database
      await user.save();
  
      // Generate a JWT token with id and username in the payload
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      // Send a response with the token
      res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  const loginUser = async (req, res) => {
    const { email, username, password } = req.body;
  
    // Check if email/username and password are provided
    if (!email && !username) {
      return res.status(400).json({ message: 'Please provide an email or username' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Please provide a password' });
    }
  
    try {
      // Find the user by email or username
      const user = await User.findOne({ $or: [{ email }, { username }] });
      if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
      }
  
      // Compare the password with the hashed password stored in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate a JWT token with id and username in the payload
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      // Send a response with the token
      res.status(200).json({ message: 'User logged in successfully', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Get user data
  const getUser = async (req, res) => {
    try {
      // req.user is set by the protect middleware
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  module.exports = { registerUser, loginUser, getUser };