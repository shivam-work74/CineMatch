const mongoose = require('mongoose');

// This schema defines what a 'Session' looks like
const sessionSchema = new mongoose.Schema({
  // This is the 6-digit code users will type to join (e.g., "AB12CD")
  joinCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  
  // This is the person who created the session
  host: {
    type: mongoose.Schema.Types.ObjectId, // A reference to a User ID
    ref: 'User',
    required: true,
  },

  // A list of all people who have joined the session
  // This will *always* include the host
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  
  // The list of movies that have been liked in this session
  // We'll use this to find matches
  likes: [{
    movieId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  }],
  
  // A simple list of movie IDs that are a "match"
  matches: [{
    movieId: { type: String },
    title: { type: String },
    poster_path: { type: String }
  }],

}, {
  timestamps: true, // Adds createdAt and updatedAt
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;