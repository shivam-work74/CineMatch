// --- WebSocket (Socket.io) Handler ---
// This file manages all real-time events like joining, swiping, and matching

const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Session = require('./models/Session');

// We will export a function that takes 'io' (our socket server)
// as an argument.
module.exports = function(io) {
  
  // --- 1. Socket Authentication Middleware ---
  // This is our "security guard" for WebSockets.
  // It runs *once* when a user first connects.
  io.use(async (socket, next) => {
    try {
      // The frontend will send the token in this 'auth' object
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided.'));
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find the user
      const user = await User.findById(decoded.id).select('id name');
      
      if (!user) {
        return next(new Error('Authentication error: User not found.'));
      }
      
      // --- SUCCESS ---
      // We attach the user to the socket object for this connection
      socket.user = user;
      next();
      
    } catch (error) {
      next(new Error('Authentication error: Invalid token.'));
    }
  });

  // --- 2. Main Connection Logic ---
  // This runs *after* the authentication middleware is successful.
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} (User: ${socket.user.name})`);

    // --- Event Handler: "join_session" ---
    // This is called when a user loads the Session Page
    socket.on('join_session', async ({ joinCode }) => {
      try {
        const session = await Session.findOne({ 
          joinCode 
        }).populate('participants', 'id name');
        
        if (!session) return;
        
        // Security check: Is this user actually in the session?
        if (!session.participants.some(p => p.id === socket.user.id)) {
          return; // Not a participant, do nothing
        }

        // --- SUCCESS ---
        // 'socket.join()' puts this user into a private "room"
        // named after the joinCode (e.g., "AB12CD")
        socket.join(joinCode);
        console.log(`User ${socket.user.name} joined room: ${joinCode}`);
        
        // Tell *everyone* in that room (including the sender)
        // the new, updated list of participants
        io.to(joinCode).emit('session_updated', { 
          participants: session.participants 
        });

      } catch (error) {
        console.error('Join Session Error:', error);
      }
    });

    // --- Event Handler: "send_swipe" ---
    // This is called when a user swipes "like" (right)
    socket.on('send_swipe', async ({ joinCode, movieId, movieTitle, posterPath }) => {
      try {
        const userId = socket.user.id;
        
        // Find the session
        const session = await Session.findOne({ joinCode });
        if (!session) return;

        // Check if user already liked this movie (prevent double-swipes)
        const existingLike = session.likes.find(
          like => like.userId.toString() === userId && like.movieId === movieId
        );
        
        if (existingLike) {
          console.log('User already liked this movie');
          return;
        }

        // --- Add the new like to the array ---
        session.likes.push({ movieId, userId });

        // --- THE "TOP-NOTCH" MATCH LOGIC ---
        // 1. Get all participant IDs in the session
        const participantIds = session.participants.map(p => p.toString());
        
        // 2. Get all likes *for this specific movie*
        const movieLikes = session.likes.filter(
          like => like.movieId === movieId
        );
        
        // 3. Get the user IDs of everyone who liked it
        const likingUserIds = movieLikes.map(like => like.userId.toString());
        
        // 4. Check if *every* participant ID is in the "likers" list
        const isMatch = participantIds.every(id => likingUserIds.includes(id));

        // --- IT'S A MATCH! ---
        if (isMatch) {
          console.log(`--- MATCH FOUND: ${movieTitle} ---`);
          
          // Add movie to the session's 'matches' array
          session.matches.push({ movieId, title: movieTitle, poster_path: posterPath });
          
          // --- BROADCAST THE MATCH! ---
          // Send a "match_found" event to *everyone* in the room
          io.to(joinCode).emit('match_found', { 
            movieId, 
            title: movieTitle, 
            poster_path: posterPath 
          });
        }
        
        // Save the new like (and potential match) to the database
        await session.save();
        
      } catch (error) {
        console.error('Send Swipe Error:', error);
      }
    });

    // --- Event Handler: "disconnect" ---
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id} (User: ${socket.user.name})`);
      // We could add logic here to update the participant list,
      // but for now, we'll just let them re-join.
    });
  });
};