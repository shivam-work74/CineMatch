const mongoose = require('mongoose');

// This schema defines what a 'Session' looks like
const sessionSchema = new mongoose.Schema({
  // The unique 6-character code to join the session
  joinCode: {
    type: String,
    required: true,
    unique: true,
  },

  // The user who created the session
  host: {
    type: mongoose.Schema.Types.ObjectId,
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

  // Optional: Store the selected genre for this session
  genreId: {
    type: String,
    required: false,
  },

}, {
  timestamps: true, // Adds createdAt and updatedAt
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;