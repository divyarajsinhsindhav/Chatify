require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { createAccessToken } = require('../services/authantication.services');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });
    if (user) return res.status(400).json({ message: 'User already exists.' });

    let hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      username,
      email: normalizedEmail,
      password: hashPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully.',
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal Server Error during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = createAccessToken(user._id);

    res.status(200).json({
      message: 'Login successful.',
      id: user._id,
      token,
    });
  } catch (e) {
    console.error('Error during login:', e);
    res.status(500).json({ message: 'Internal Server Error during login.' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (e) {
    console.error('Error fetching user:', e);
    res.status(500).json({ message: 'Internal Server Error fetching user.' });
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;

    const userId = req.userId; 
    if (!userId) return res.status(400).json({ message: 'User ID not found in request.' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (email.toLowerCase().trim() !== user.email.toLowerCase()) {
      let checkEmail = await User.findOne({ email: email.toLowerCase().trim() });
      if (checkEmail) return res.status(400).json({ message: 'Account with this email ID already exists.' });
    }
    
    if (username !== user.username) {
      let checkUsername = await User.findOne({ username });
      if (checkUsername) return res.status(400).json({ message: 'Username already taken.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId }, 
      { username, email: email.toLowerCase().trim() }, 
      { new: true }
    ).select('-password');


    res.status(200).json(updatedUser);

  } catch (e) { 
    console.error('Error updating user:', e);
    res.status(500).json({ message: 'Internal Server Error updating user.' });
  }
}

exports.changePassword = async (req, res) => {
  try {

  } catch (e) {
    
  }
}

// [TODO]: Implement deleteUser
exports.deleteUser = async (req, res) => {
  try {

  } catch (e) { 

  }
}

exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: 'Logout successful.' });
  } catch (e) {
    console.error('Error during logout:', e);
    res.status(500).json({ message: 'Internal Server Error during logout.' });
  }
}
