const express = require('express');
const axios = require('axios');
const Session = require('./models/Session');
const { protect } = require('./middleware');

const router = express.Router();

// --- Helper Function to generate a 6-digit code ---
function generateJoinCode() {
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ---
// 1. GET /api/movies/popular (Supports ?genreId=...)
// ---
router.get('/movies/popular', protect, async (req, res) => {
  try {
    const tmdbApiKey = process.env.TMDB_API_KEY;
    const { genreId } = req.query; // Get genreId from query params

    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=1`;

    // If a genre is specified, use the 'discover' endpoint instead
    if (genreId) {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreId}`;
    }

    const response = await axios.get(url);

    const movies = response.data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      overview: movie.overview,
      release_date: movie.release_date,
      genre_ids: movie.genre_ids,
    }));

    res.status(200).json(movies);

  } catch (error) {
    console.error('TMDB API Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch movies from TMDB' });
  }
});

// ---
// 2. POST /api/sessions/create
// ---
router.post('/sessions/create', protect, async (req, res) => {
  try {
    const hostId = req.user.id;
    const { genreId } = req.body; // Get genreId from body

    let joinCode;
    let isUnique = false;
    while (!isUnique) {
      joinCode = generateJoinCode();
      const existingSession = await Session.findOne({ joinCode });
      if (!existingSession) {
        isUnique = true;
      }
    }

    const newSession = await Session.create({
      joinCode: joinCode,
      host: hostId,
      participants: [hostId],
      likes: [],
      matches: [],
      genreId: genreId || null, // Save the selected genre
    });

    res.status(201).json({
      message: 'Session created successfully!',
      session: newSession
    });

  } catch (error) {
    console.error('Session Create Error:', error);
    res.status(500).json({ message: 'Server error creating session' });
  }
});


// ---
// 3. POST /api/sessions/join
// ---
router.post('/sessions/join', protect, async (req, res) => {
  try {
    const { joinCode } = req.body;
    const userId = req.user.id;

    if (!joinCode) {
      return res.status(400).json({ message: 'Join code is required' });
    }

    const session = await Session.findOne({ joinCode: joinCode.toUpperCase() });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (!session.participants.includes(userId)) {
      session.participants.push(userId);
      await session.save();
    }

    // We want to return the full user objects, not just their IDs
    // .populate() "populates" the 'participants' array with the full User documents
    await session.populate('participants', 'id name'); // Only get 'id' and 'name'

    res.status(200).json({
      message: 'Joined session successfully!',
      session: session
    });

  } catch (error) {
    console.error('Session Join Error:', error);
    res.status(500).json({ message: 'Server error joining session' });
  }
});

// ---
// 4. GET /api/sessions/:joinCode
// ---
router.get('/sessions/:joinCode', protect, async (req, res) => {
  try {
    const { joinCode } = req.params;
    const userId = req.user.id;

    const session = await Session.findOne({
      joinCode: joinCode.toUpperCase()
    }).populate('participants', 'id name'); // Get participant details

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Security check: Make sure the user is actually a participant
    if (!session.participants.some(p => p.id === userId)) {
      return res.status(403).json({ message: 'Not authorized to view this session' });
    }

    res.status(200).json({ session });

  } catch (error) {
    console.error('Get Session Error:', error);
    res.status(500).json({ message: 'Server error getting session' });
  }
});


module.exports = router;