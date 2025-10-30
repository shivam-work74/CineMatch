// --- WebSocket (Socket.io) Handler (MERGED + POSTER_PATH FIX) ---
// Manages real-time events, ensures poster_path is handled correctly

const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Session = require('./models/Session');

module.exports = function(io) {

  // --- 1. Socket Authentication Middleware ---
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided.'));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('id name');
      if (!user) {
        return next(new Error('Authentication error: User not found.'));
      }
      socket.user = user;
      next();
    } catch (error) {
      // Improved error logging for token issues
      console.error('Socket Auth Error:', error.message);
      next(new Error('Authentication error: Invalid token.'));
    }
  });

  // --- 2. Main Connection Logic ---
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} (User: ${socket.user.name})`);

    // --- Event Handler: "join_session" ---
    socket.on('join_session', async ({ joinCode }) => {
      try {
        if (!joinCode) {
            console.log(`Join attempt failed: No joinCode provided by ${socket.user.name}.`);
            return; // Exit if no code provided
        }
        const session = await Session.findOne({
          joinCode: joinCode.toUpperCase()
        }).populate('participants', 'id name');

        if (!session) {
            console.log(`Join attempt failed: Session ${joinCode} not found.`);
            return;
        }

        if (!session.participants.some(p => p.id === socket.user.id)) {
          console.log(`Join attempt failed: User ${socket.user.name} not in session ${joinCode}.`);
          return;
        }

        socket.join(joinCode);
        console.log(`User ${socket.user.name} joined room: ${joinCode}`);

        io.to(joinCode).emit('session_updated', {
          participants: session.participants,
          matches: session.matches || [] // Ensure matches is an array
        });

      } catch (error) {
        console.error(`Error in join_session for ${joinCode}:`, error);
      }
    });

    // --- Event Handler: "send_swipe" ---
    socket.on('send_swipe', async ({ joinCode, movieId, movieTitle, posterPath }) => { // Receives posterPath
      try {
        const userId = socket.user.id;

        if (!joinCode || !movieId) {
             console.log(`Swipe failed: Missing joinCode or movieId from ${userId}.`);
             return; // Essential data missing
        }

        const session = await Session.findOne({ joinCode: joinCode.toUpperCase() });
        if (!session) {
            console.log(`Swipe failed: Session ${joinCode} not found.`);
            return;
        }
        if (!session.participants.some(p => p.toString() === userId)) {
             console.log(`Swipe failed: User ${userId} not in session ${joinCode}.`);
             return;
         }

        const alreadyLiked = session.likes.some(like => like.userId.toString() === userId && like.movieId === movieId);
        if (alreadyLiked) {
          console.log(`User ${userId} already liked movie ${movieId}.`);
          return;
        }

        session.likes.push({ movieId, userId });

        const participantIds = session.participants.map(p => p.toString());
        // Ensure participantIds is not empty before proceeding
        if (participantIds.length === 0) {
             console.log(`Swipe processed for ${movieId}, but no participants in session ${joinCode} to check for match.`);
             await session.save(); // Save the like even if no one else is there
             return;
        }

        const movieLikes = session.likes.filter(like => like.movieId === movieId);
        const likingUserIds = movieLikes.map(like => like.userId.toString());
        const isMatch = participantIds.every(id => likingUserIds.includes(id));

        let matchAdded = false;
        if (isMatch) {
          const alreadyMatched = session.matches.some(m => m.movieId === movieId);
          if (!alreadyMatched) {
            console.log(`--- MATCH FOUND in ${joinCode}: ${movieTitle} ---`);
            // --- MERGED FIX: Save posterPath correctly (use null if undefined/falsy) ---
            session.matches.push({
                movieId,
                title: movieTitle || 'Unknown Title',
                poster_path: posterPath || null // Store null if posterPath is missing/undefined
            });
            matchAdded = true;
          } else {
             console.log(`Movie ${movieId} already matched in ${joinCode}.`);
          }
        }

        await session.save();
        console.log(`Session ${joinCode} saved. Match added: ${matchAdded}`);

        // If a new match was added, broadcast the updated list
        if (matchAdded) {
          io.to(joinCode).emit('match_update', {
             matches: session.matches
          });
           console.log(`Emitted match_update for ${joinCode} with ${session.matches.length} matches.`);
        }

      } catch (error) {
        console.error(`Error in send_swipe for ${joinCode}, movie ${movieId}:`, error);
      }
    });

    // --- Event Handler: "disconnect" ---
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id} (User: ${socket.user.name})`);
      // Optional: Add logic here to find sessions user was in,
      // remove them from participants, save session, and emit 'session_updated'
      // to remaining users in those rooms.
    });
  });
};