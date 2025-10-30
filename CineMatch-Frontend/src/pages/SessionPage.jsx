import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
// --- Ensure Check and Film icons are imported ---
import { Users, LogOut, Loader2, Check, X as XIcon, Heart, Film } from 'lucide-react';
import toast from 'react-hot-toast';

import useAuthStore from '../store/authStore';
import api, { setAuthToken } from '../lib/api';
import { initializeSocket, disconnectSocket, socket } from '../lib/socket';
import MovieSwipeCard from '../components/MovieSwipeCard';
import MatchModal from '../components/MatchModal';
import ParallaxBackground from '../components/ParallaxBackground';

// --- Sidebar Component Definition (Includes Matches Section) ---
const SessionSidebar = ({ participants = [], joinCode, matches = [] }) => { // Added matches prop
  const safeParticipants = Array.isArray(participants) ? participants : [];
  const safeMatches = Array.isArray(matches) ? matches : [];
  const smallPosterBaseUrl = "https://image.tmdb.org/t/p/w92"; // Smaller posters for list
  const placeholderSidebarUrl = "https://placehold.co/92x140/333/555?text=?"; // Placeholder base

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 right-0 h-screen w-full max-w-xs p-4 z-30"
    >
      <div className="h-full w-full rounded-2xl border border-white/10
                      bg-white/5 p-6 shadow-2xl backdrop-blur-xl
                      flex flex-col overflow-hidden" // Added overflow-hidden
      >
        {/* Session Code Section */}
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

        {/* Participants Section */}
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Participants ({safeParticipants.length})
        </h3>
        <div className="space-y-3 overflow-y-auto mb-6 flex-shrink-0" style={{ maxHeight: '30vh' }}> {/* Limit height */}
          {safeParticipants.length > 0 ? (
            safeParticipants.map((user) => (
              <div key={user?.id || user?.name} className="flex items-center gap-3 rounded-lg bg-white/10 p-3">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <span className="text-white font-medium truncate">{user?.name || 'Loading...'}</span>
              </div>
            ))
          ) : (
            <p className="text-zinc-400">Waiting for participants...</p>
          )}
        </div>

        {/* --- MERGED: Match List Section --- */}
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 border-t border-white/10 pt-4">
          <Check className="h-5 w-5 text-green-400" />
          Matches ({safeMatches.length})
        </h3>
        <div className="space-y-3 overflow-y-auto flex-grow"> {/* Takes remaining space */}
          {safeMatches.length > 0 ? (
            safeMatches.map((match) => {
              // Construct URL safely for sidebar
              const matchImageUrl = match.poster_path
                                  ? `${smallPosterBaseUrl}${match.poster_path}`
                                  : placeholderSidebarUrl;
              return (
                <div key={match.movieId} className="flex items-center gap-3 rounded-lg bg-white/10 p-2">
                  <img
                    src={matchImageUrl} // Use safe URL
                    alt={match.title || 'Match'}
                    className="w-10 h-14 object-cover rounded flex-shrink-0 bg-zinc-700" // Added fallback bg
                    // Add onError for sidebar images too
                    onError={(e) => {
                       if (e.target.src !== placeholderSidebarUrl) {
                           e.target.src = placeholderSidebarUrl;
                       }
                    }}
                  />
                  <span className="text-white text-sm font-medium flex-grow truncate">
                    {match.title || 'Unknown Title'}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-zinc-400 text-sm">No matches found yet...</p>
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
  // --- MERGED: Add matches state ---
  const [matches, setMatches] = useState([]);

  const controls = useAnimationControls();

  useEffect(() => {
    if (!token) return navigate('/login');
    setAuthToken(token);
    initializeSocket();

    const loadSessionData = async () => {
      setIsLoading(true);
      try {
        const sessionRes = await api.get(`/sessions/${joinCode}`);
        const currentSession = sessionRes.data.session;
        setSession(currentSession);
        setParticipants(currentSession.participants || []);
        // --- MERGED: Set initial matches ---
        setMatches(currentSession.matches || []);

        const moviesRes = await api.get('/movies/popular');
        const popularMovies = moviesRes.data || [];
        // Filter out movies already matched
        const matchedMovieIds = new Set((currentSession.matches || []).map(m => m.movieId.toString()));
        const availableMovies = popularMovies.filter(m => !matchedMovieIds.has(m.id.toString()));

        setMovies(availableMovies.slice(0, 10).reverse());
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

    // --- MERGED: Update session_updated listener ---
    socket.on('session_updated', ({ participants: updatedParticipants, matches: currentMatches }) => {
       setParticipants(updatedParticipants || []);
       setMatches(currentMatches || []); // Also update matches on join/leave
       toast('A user updated the session!'); // More generic message
     });

    // --- MERGED: Change to match_update listener ---
    socket.on('match_update', ({ matches: updatedMatches }) => {
      console.log("Match list updated:", updatedMatches);
      setMatches(updatedMatches || []); // Update state with the full list

      // Optionally, still trigger the modal for the NEWEST match
      if (updatedMatches && updatedMatches.length > 0) {
          const latestMatch = updatedMatches[updatedMatches.length - 1];
          // Check if this match is different from the currently showing modal movie
          const previousMatchId = matchedMovie?.movieId; // Store previous before updating
           if (latestMatch.movieId !== previousMatchId || !showMatchModal) {
              setMatchedMovie(latestMatch);
              setShowMatchModal(true);
              // playMatchSound(); // Optional sound
          }
      }
    });
    // Remove old match_found listener if it exists
    socket.off('match_found');

    // --- MERGED: Update cleanup ---
    return () => {
      disconnectSocket();
      socket.off('session_updated');
      socket.off('match_update'); // Use the new event name
    };
  // Ensure dependencies are correct, avoid infinite loops if state vars are added
  }, [joinCode, token, navigate]);

  const handleSwipe = (direction, movie) => {
     if (!movie || !movie.id) return;
     setMovies((prevMovies) => {
        if (!Array.isArray(prevMovies)) return [];
        const index = prevMovies.findIndex(m => m.id === movie.id);
        if (index === -1) return prevMovies;
        return [...prevMovies.slice(0, index), ...prevMovies.slice(index + 1)];
    });
    // Play sound if added
    // if (direction === 'right') playSwipeRightSound(); else playSwipeLeftSound();
    if (direction === 'right') {
       // Ensure posterPath is null if undefined/missing
       const posterPathToSend = movie.poster_path || null;
      socket.emit('send_swipe', {
        joinCode,
        movieId: movie.id.toString(),
        movieTitle: movie.title,
        posterPath: posterPathToSend, // Send corrected path
      });
    }
  };

  const triggerSwipe = async (direction) => {
     const currentMovies = movies;
     if (!Array.isArray(currentMovies) || currentMovies.length === 0) return;
     const topCardMovie = currentMovies[currentMovies.length - 1];
    const exitX = direction === 'right' ? 300 : -300;
    try {
      await controls.start({
        x: exitX, opacity: 0, scale: 0.8,
        transition: { duration: 0.3, ease: "easeIn" }
      });
      handleSwipe(direction, topCardMovie);
       controls.start({ x: 0, opacity: 1, scale: 1, transition: { duration: 0 } });
       controls.set({ y: 0, scale: 1 });
    } catch (error) { handleSwipe(direction, topCardMovie); }
  };

  if (isLoading) {
     return (
       <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden p-4 pt-8">
          <ParallaxBackground movies={backgroundMovies} />
          <Loader2 className="h-16 w-16 animate-spin text-white z-10" />
       </div>
     );
   }

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden p-4 pt-8">
      <ParallaxBackground movies={backgroundMovies} />
      <div className="z-50">
        <MatchModal show={showMatchModal} movie={matchedMovie} onClose={() => setShowMatchModal(false)} />
      </div>
      <div className="z-30">
        {/* --- MERGED: Pass matches state to sidebar --- */}
        <SessionSidebar participants={participants} joinCode={joinCode || ''} matches={matches} />
      </div>
      <div className="relative h-[600px] w-full max-w-sm flex-grow flex items-center justify-center z-10">
        <AnimatePresence>
          {movies && movies.length > 0 ? (
            movies.map((movie, index) => (
              <MovieSwipeCard
                key={movie.id}
                movie={movie}
                onSwipeRight={() => handleSwipe('right', movie)}
                onSwipeLeft={() => handleSwipe('left', movie)}
                controls={index === movies.length - 1 ? controls : undefined}
                index={index}
                totalCards={movies.length}
              />
            ))
          ) : (
             <motion.div
               key="all-done-card"
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.8 }}
               className="absolute inset-0 h-full w-full rounded-2xl border border-white/10
                          bg-white/5 p-8 shadow-2xl backdrop-blur-xl
                          flex flex-col items-center justify-center text-center"
             >
               <Check className="h-24 w-24 text-green-400 mb-6" />
               <h2 className="text-3xl font-bold text-white mb-3">All Swiped!</h2>
               <p className="text-zinc-300">Check the sidebar for matches!</p>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.div
          className="mt-8 flex gap-6 z-40"
          initial={{ opacity: 0, y: 50 }}
          animate={movies.length > 0 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
        <button onClick={() => triggerSwipe('left')} disabled={movies.length === 0} className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-500/50 bg-white/5 text-red-400 shadow-xl backdrop-blur-lg transition-all duration-200 hover:scale-110 hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100" aria-label="Swipe Left (Nope)"> <XIcon className="h-10 w-10" strokeWidth={3} /> </button>
        <button onClick={() => triggerSwipe('right')} disabled={movies.length === 0} className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-green-500/50 bg-white/5 text-green-400 shadow-xl backdrop-blur-lg transition-all duration-200 hover:scale-110 hover:bg-green-500/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100" aria-label="Swipe Right (Like)"> <Heart className="h-10 w-10" fill="currentColor" strokeWidth={1}/> </button>
      </motion.div>
    </div>
  );
}

export default SessionPage;