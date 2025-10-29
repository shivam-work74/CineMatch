// --- Authentication Logic ---
// This file handles /api/auth/register and /api/auth/login

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // We import our User model

const router = express.Router();

// --- 1. Registration Route ---
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // --- Validation ---
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // --- Create New User ---
    // Mongoose uses the 'create' method, which triggers our 'pre-save' hook
    // to automatically hash the password.
    const user = await User.create({
      name,
      email,
      password, // We send the plain password; Mongoose hashes it
    });

    // We don't send the password back, even the hashed one.
    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    // Check for Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});


// --- 2. Login Route ---
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Validation ---
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      // We send a generic message for security
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // --- Check Password ---
    // We use the 'comparePassword' method we defined in our User.js model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // --- Create JWT Token ---
    // If password is correct, create a token
    const tokenPayload = {
      id: user._id,
      name: user.name,
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET, // From our .env file
      { expiresIn: '7d' } // Token is good for 7 days
    );

    // --- Send Response ---
    // Send the token and user info (excluding password)
    res.status(200).json({
      message: 'Login successful!',
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});


// 3. Export the router
module.exports = router;

