// --- User Model (Blueprint) ---
// This file defines the 'User' schema for our MongoDB database.
// It also includes the logic to hash passwords.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. This is the blueprint for a User
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // No two users can have the same email
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  // We will add sessions and likes here later
  // sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
  // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }],
}, {
  // Adds 'createdAt' and 'updatedAt' timestamps automatically
  timestamps: true,
});


// 2. CRITICAL SECURITY: Password Hashing
// This code runs *before* a new user is saved to the database
userSchema.pre('save', async function(next) {
  // 'this' refers to the user document that is about to be saved

  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a 'salt' and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


// 3. Helper method to compare passwords
// This adds a new function 'comparePassword' to every user document
userSchema.methods.comparePassword = function(candidatePassword) {
  // 'this.password' is the hashed password from the database
  return bcrypt.compare(candidatePassword, this.password);
};


// 4. Create the 'User' model from the schema
const User = mongoose.model('User', userSchema);

// 5. Export the model
module.exports = User;
