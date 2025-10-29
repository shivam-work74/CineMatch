import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { Users, LogOut, Loader2, Check, X as XIcon, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

import useAuthStore from '../store/authStore';
import api, { setAuthToken } from '../lib/api';
import { initializeSocket, disconnectSocket, socket } from '../lib/socket';
import MovieSwipeCard from '../components/MovieSwipeCard'; // Uses the <img> tag version
import MatchModal from '../components/MatchModal';
import ParallaxBackground from '../components/ParallaxBackground'; // Import the new background

// --- Sidebar Component Definition (Included Here) ---
const SessionSidebar = ({ participants = [], joinCode }) => {
  // Ensure participants is always an array
  const safeParticipants = Array.isArray(participants) ? participants : [];

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 right-0 h-screen w-full max-w-xs p-4 z-30" // Ensure z-index
    >
      <div className="h-full w-full rounded-2xl border border-white/10
                      bg-white/5 p-6 shadow-2xl backdrop-blur-xl
                      flex flex-col"
      >
        <h2 className="text-2xl font-bold text-white mb-1">Session Code</h2>
        <div
          onClick={() => {
            try {
              navigator.clipboard.writeText(joinCode);
              toast.success("Copied to clipboard!");
            } catch (err) { toast.error("Failed to copy code."); console.error(err); }
          }}
          className="text-4xl font-bold text-blue-400 tracking-widest mb-6 cursor-pointer
                     hover:text-blue-300 transition-colors"
        >
          {joinCode || '...'}
        </div>

        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Participants ({safeParticipants.length})
        </h3>
        <div className="space-y-3 overflow-y-auto">
          {safeParticipants.length > 0 ? (
            safeParticipants.map((user) => (
              <div key={user?.id || user?.name} className="flex items-center gap-3 rounded-lg bg-white/10 p-3">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <span className="text-white font-medium">{user?.name || 'Loading...'}</span>
              </div>
            ))
          ) : (
            <p className="text-zinc-400">Waiting for participants...</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}; // End SessionSidebar


// --- Main Session Page Component ---
function SessionPage() {
  const { joinCode } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  const [session, setSession] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [matchedMovie, setMatchedMovie] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [backgroundMovies, setBackgroundMovies] = useState([]);

  const controls = useAnimationControls();

  // --- Core Logic: Load Session & Movies, Connect Socket ---
  useEffect(() => {
    if (!token) return navigate('/login');
    setAuthToken(token);
    initializeSocket();

    const loadSessionData = async () => {
      setIsLoading(true);
      try {
        const sessionRes = await api.get(`/sessions/${joinCode}`);
        setSession(sessionRes.data.session);
        setParticipants(sessionRes.data.session.participants || []); // Ensure array

        const moviesRes = await api.get('/movies/popular');
        const popularMovies = moviesRes.data || [];
        // Set movies for swiping (reverse for stack)
        setMovies(popularMovies.slice(0, 10).reverse());
        // Set DIFFERENT movies for the background parallax
        setBackgroundMovies(popularMovies.slice(10, 20));

        socket.emit('join_session', { joinCode });

      } catch (error) {
        console.error('Failed to load session:', error);
        toast.error(error.response?.data?.message || 'Failed to load session');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();

    // --- Socket Listeners ---
    socket.on('session_updated', ({ participants: updatedParticipants }) => {
       setParticipants(updatedParticipants || []); // Ensure array
       toast('A new user joined the session!');
     });
    socket.on('match_found', (movie) => {
      console.log("Match received from socket:", movie); // Debug log
      setMatchedMovie(movie);
      setShowMatchModal(true);
    });

    // --- Cleanup ---
    return () => {
      console.log('Disconnecting socket on unmount');
      disconnectSocket();
      socket.off('session_updated');
      socket.off('match_found');
    };
  }, [joinCode, token, navigate]);

  // --- Swipe Handlers ---
  const handleSwipe = (direction, movie) => {
     // Check if movie object is valid before proceeding
     if (!movie || !movie.id) {
       console.error("handleSwipe called with invalid movie object:", movie);
       return;
     }
     console.log(`Handling swipe ${direction} for movie ID: ${movie.id}`); // Debug log

     // Optimistically remove the card using functional update
     setMovies((prevMovies) => {
        // Ensure prevMovies is an array
        if (!Array.isArray(prevMovies)) return [];
        const index = prevMovies.findIndex(m => m.id === movie.id);
        if (index === -1) {
            console.log(`Movie ID ${movie.id} not found in state, possibly already removed.`); // Debug log
            return prevMovies; // Already removed or not found
        }
        console.log(`Removing movie ID ${movie.id} at index ${index}`); // Debug log
        // Create a new array without the swiped movie
        return [...prevMovies.slice(0, index), ...prevMovies.slice(index + 1)];
    });


    if (direction === 'right') {
      socket.emit('send_swipe', {
        joinCode,
        movieId: movie.id.toString(),
        movieTitle: movie.title,
        posterPath: movie.poster_path,
      });
    }
  };

  // --- Trigger Swipe via Buttons ---
  const triggerSwipe = async (direction) => {
     // Read state directly within the function
     const currentMovies = movies;
     if (!Array.isArray(currentMovies) || currentMovies.length === 0) {
        console.log("triggerSwipe called but no movies left."); // Debug log
        return; // No cards left
     }
     const topCardMovie = currentMovies[currentMovies.length - 1];
     console.log(`Triggering swipe ${direction} for top card:`, topCardMovie?.title); // Debug log


    const exitX = direction === 'right' ? 300 : -300;

    try {
      // Animate the top card out
      await controls.start({
        x: exitX,
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.3, ease: "easeIn" }
      });

      // Call the original swipe handler AFTER animation completes
      handleSwipe(direction, topCardMovie);

      // IMPORTANT: Reset controls for the *next* card that appears
      controls.start({ x: 0, opacity: 1, scale: 1, transition: { duration: 0 } });

    } catch (error) {
       console.error("Error during triggerSwipe animation:", error);
       // Still try to handle the swipe if animation fails
       handleSwipe(direction, topCardMovie);
    }
  };


  // --- Render Loading State ---
  if (isLoading) {
    return (
      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden p-4 pt-8">
         <ParallaxBackground movies={backgroundMovies} />
         <Loader2 className="h-16 w-16 animate-spin text-white z-10" />
      </div>
    );
  }

  // --- Render Main Page ---
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden p-4 pt-8">

      {/* --- Background --- */}
      <ParallaxBackground movies={backgroundMovies} />

      {/* --- Match Modal --- */}
      <div className="z-50">
        <MatchModal
          show={showMatchModal}
          movie={matchedMovie}
          onClose={() => setShowMatchModal(false)}
        />
      </div>

      {/* --- Sidebar --- */}
      <SessionSidebar participants={participants} joinCode={joinCode || ''} />

      {/* --- Card Stack Container --- */}
      <div className="relative h-[600px] w-full max-w-sm flex-grow flex items-center justify-center z-20">
        <AnimatePresence>
          {movies && movies.length > 0 ? (
            movies.map((movie, index) => (
              <MovieSwipeCard
                key={movie.id}
                movie={movie}
                onSwipeRight={() => handleSwipe('right', movie)}
                onSwipeLeft={() => handleSwipe('left', movie)}
                // Apply controls ONLY to the top card
                controls={index === movies.length - 1 ? controls : undefined}
              />
            ))
          ) : (
             <motion.div
               key="all-done-card"
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.8 }} // Added exit for consistency
               className="absolute inset-0 h-full w-full rounded-2xl border border-white/10
                          bg-white/5 p-8 shadow-2xl backdrop-blur-xl
                          flex flex-col items-center justify-center text-center"
             >
               <Check className="h-24 w-24 text-green-400 mb-6" />
               <h2 className="text-3xl font-bold text-white mb-3">All Swiped!</h2>
               <p className="text-zinc-300">Waiting for others...</p>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Swipe Buttons --- */}
       <motion.div
          className="mt-8 flex gap-6 z-40" // High z-index
          initial={{ opacity: 0, y: 50 }}
          animate={movies.length > 0 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
        {/* Nope Button */}
        <button
          onClick={() => triggerSwipe('left')}
          disabled={movies.length === 0}
          className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-500/50
                     bg-white/5 text-red-400 shadow-xl backdrop-blur-lg
                     transition-all duration-200 hover:scale-110 hover:bg-red-500/20
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Swipe Left (Nope)"
        >
          <XIcon className="h-10 w-10" strokeWidth={3} />
        </button>

        {/* Like Button */}
        <button
          onClick={() => triggerSwipe('right')}
          disabled={movies.length === 0}
          className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-green-500/50
                     bg-white/5 text-green-400 shadow-xl backdrop-blur-lg
                     transition-all duration-200 hover:scale-110 hover:bg-green-500/20
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
           aria-label="Swipe Right (Like)"
       >
          <Heart className="h-10 w-10" fill="currentColor" strokeWidth={1}/>
        </button>
      </motion.div>

    </div>
  );
}

export default SessionPage;