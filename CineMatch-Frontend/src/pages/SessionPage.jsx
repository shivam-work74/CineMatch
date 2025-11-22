import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { Users, LogOut, Loader2, Check, X as XIcon, Heart, Film } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

import useAuthStore from '../store/authStore';
import api, { setAuthToken } from '../lib/api';
import { initializeSocket, disconnectSocket, socket } from '../lib/socket';
import MovieSwipeCard from '../components/MovieSwipeCard';
import MatchModal from '../components/MatchModal';
import MovieDetailsModal from '../components/MovieDetailsModal';
import AnimatedBackground from '../components/AnimatedBackground';
import Logo from '../components/Logo';

// --- Header Component for Session Page ---
const SessionHeader = ({ onLeaveSession }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-white/5 p-3 px-6 shadow-2xl backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-6 w-6 text-white" />
          <span className="text-xl font-bold text-white">CineMatch</span>
        </Link>
        <button
          onClick={onLeaveSession}
          className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-white/20"
        >
          <LogOut className="h-4 w-4" />
          Leave Session
        </button>
      </div>
    </header>
  );
};

// --- Sidebar Component Definition (Includes Matches Section) ---
const SessionSidebar = ({ participants = [], joinCode, matches = [] }) => {
  const safeParticipants = Array.isArray(participants) ? participants : [];
  const safeMatches = Array.isArray(matches) ? matches : [];
  const smallPosterBaseUrl = "https://image.tmdb.org/t/p/w92";
  const placeholderSidebarUrl = "https://placehold.co/92x140/333/555?text=?";

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 right-0 h-screen w-full max-w-xs p-4 z-30"
    >
      <div className="h-full w-full rounded-2xl border border-white/10
                      bg-white/5 p-6 shadow-2xl backdrop-blur-xl
                      flex flex-col overflow-hidden"
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
        <div className="space-y-3 overflow-y-auto mb-6 flex-shrink-0" style={{ maxHeight: '30vh' }}>
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

        {/* Match List Section */}
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 border-t border-white/10 pt-4">
          <Check className="h-5 w-5 text-green-400" />
          Matches ({safeMatches.length})
        </h3>
        <div className="space-y-3 overflow-y-auto flex-grow">
          {safeMatches.length > 0 ? (
            safeMatches.map((match) => {
              const movieId = match.movieId || match._id || 'unknown';
              const title = match.title || 'Unknown Title';
              const posterPath = match.poster_path || null;
              const matchImageUrl = posterPath
                ? `${smallPosterBaseUrl}${posterPath}`
                : placeholderSidebarUrl;
              return (
                <div key={movieId} className="flex items-center gap-3 rounded-lg bg-white/10 p-2">
                  <img
                    src={matchImageUrl}
                    alt={title}
                    className="w-10 h-14 object-cover rounded flex-shrink-0 bg-zinc-700"
                    onError={(e) => {
                      if (e.target.src !== placeholderSidebarUrl) {
                        e.target.src = placeholderSidebarUrl;
                      }
                    }}
                  />
                  <span className="text-white text-sm font-medium flex-grow truncate">
                    {title}
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
};

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
  const [matches, setMatches] = useState([]);

  // --- Details Modal State ---
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const controls = useAnimationControls();

  const handleLeaveSession = () => {
    navigate('/dashboard');
  };

  const handleInfoClick = (movie) => {
    setSelectedMovieId(movie.id);
    setShowDetailsModal(true);
  };

  // --- Audio Helper ---
  const playAudio = (url) => {
    try {
      const audio = new Audio(url);
      audio.volume = 0.5;
      audio.play().catch(e => console.warn("Audio playback failed:", e.message));
    } catch (err) {
      console.warn("Audio initialization failed:", err.message);
    }
  };

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
        setMatches(currentSession.matches || []);

        const moviesRes = await api.get('/movies/popular', {
          params: { genreId: currentSession.genreId }
        });

        const popularMovies = moviesRes.data || [];
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

    socket.on('session_updated', ({ participants: updatedParticipants, matches: currentMatches }) => {
      setParticipants(updatedParticipants || []);
      setMatches(currentMatches || []);
      toast('A user updated the session!');
    });

    socket.on('match_update', ({ matches: updatedMatches }) => {
      console.log("Match list updated:", updatedMatches);
      setMatches(updatedMatches || []);

      if (updatedMatches && updatedMatches.length > 0) {
        const latestMatch = updatedMatches[updatedMatches.length - 1];
        const previousMatchId = matchedMovie?.movieId;
        if (latestMatch.movieId !== previousMatchId || !showMatchModal) {
          setMatchedMovie(latestMatch);
          setShowMatchModal(true);

          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FF4500', '#00FF00', '#00BFFF']
          });

          playAudio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
        }
      }
    });

    socket.off('match_found');

    return () => {
      disconnectSocket();
      socket.off('session_updated');
      socket.off('match_update');
    };
  }, [joinCode, token, navigate]);

  const handleSwipe = (direction, movie) => {
    if (!movie || !movie.id) return;
    setMovies((prevMovies) => {
      if (!Array.isArray(prevMovies)) return [];
      const index = prevMovies.findIndex(m => m.id === movie.id);
      if (index === -1) return prevMovies;
      return [...prevMovies.slice(0, index), ...prevMovies.slice(index + 1)];
    });

    if (direction === 'right') {
      const posterPathToSend = movie.poster_path || null;
      socket.emit('send_swipe', {
        joinCode,
        movieId: movie.id.toString(),
        movieTitle: movie.title,
        posterPath: posterPathToSend,
      });

      playAudio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
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
      <AnimatedBackground className="flex h-screen w-full flex-col items-center justify-center overflow-hidden p-4 pt-28">
        <Loader2 className="h-16 w-16 animate-spin text-white z-10" />
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground className="flex h-screen w-full flex-col items-center justify-center overflow-hidden p-4 pt-28">
      <SessionHeader onLeaveSession={handleLeaveSession} />

      <div className="z-50">
        <MatchModal show={showMatchModal} movie={matchedMovie} onClose={() => setShowMatchModal(false)} />
        <MovieDetailsModal
          show={showDetailsModal}
          movieId={selectedMovieId}
          onClose={() => setShowDetailsModal(false)}
        />
      </div>

      <div className="z-30">
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
                onInfoClick={handleInfoClick}
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
        <button onClick={() => triggerSwipe('right')} disabled={movies.length === 0} className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-green-500/50 bg-white/5 text-green-400 shadow-xl backdrop-blur-lg transition-all duration-200 hover:scale-110 hover:bg-green-500/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100" aria-label="Swipe Right (Like)"> <Heart className="h-10 w-10" fill="currentColor" strokeWidth={1} /> </button>
      </motion.div>
    </AnimatedBackground>
  );
}

export default SessionPage;