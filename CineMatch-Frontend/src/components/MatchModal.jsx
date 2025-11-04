import React, { useState, useEffect } from 'react'; // Import useState, useEffect
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

const posterBaseUrl = "https://image.tmdb.org/t/p/w500";
const placeholderUrl = (text = "?") => `https://placehold.co/500x750/333/555?text=${encodeURIComponent(text)}`;

function MatchModal({ show, movie, onClose }) {
  // --- 1. Internal State for Display Data ---
  // We'll store the movie data to display inside the modal itself.
  const [displayMovie, setDisplayMovie] = useState(null);

  // --- 2. useEffect to Update Internal State ---
  // This effect runs ONLY when 'show' becomes true OR when 'movie' prop changes WHILE 'show' is true.
  useEffect(() => {
    // Only update if the modal is supposed to be visible
    if (show) {
      console.log("[MatchModal] useEffect triggered. Received movie prop:", movie); // Debug log

      // --- 3. Validate the incoming 'movie' prop ---
      if (movie && typeof movie === 'object') {
        // Handle different possible data structures
        const movieData = {
          movieId: movie.movieId || movie._id || Date.now(),
          title: movie.title || 'Unknown Title',
          poster_path: movie.poster_path || null
        };
        
        // Log the processed data for debugging
        console.log("[MatchModal] Processed movie data:", movieData);
        
        // If valid, update the internal state
        setDisplayMovie(movieData);
        console.log("[MatchModal] Setting internal displayMovie state:", movieData); // Debug log
      } else {
        // If invalid, set internal state to a default "Unknown" structure
        console.warn("[MatchModal] Received invalid movie prop, using fallback:", movie); // Debug log
        setDisplayMovie({
          movieId: Date.now(), // Use a timestamp as fallback key
          title: 'Unknown Title',
          poster_path: null // Ensure poster is null
        });
      }
    } else {
      // Optional: Clear internal state when modal is hidden (helps if props change while hidden)
      // setDisplayMovie(null);
    }
    // Dependency array: Re-run ONLY if 'show' or the actual 'movie' object reference changes.
  }, [show, movie]);


  // --- 4. Render based on Internal State ---
  // Construct URL and title using the 'displayMovie' state variable.
  const displayTitle = displayMovie?.title || 'Loading...'; // Fallback if state is somehow null initially
  const imageUrl = displayMovie?.poster_path
                 ? `${posterBaseUrl}${displayMovie.poster_path}`
                 : placeholderUrl(displayTitle);

  return (
    <AnimatePresence>
      {/* Only render the modal if 'show' is true AND we have valid 'displayMovie' state */}
      {show && displayMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Modal Card */}
          <motion.div
            key={displayMovie.movieId} // Add key to force re-render on movie change if needed
            initial={{ scale: 0.7, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, duration: 0.4 }}
            className="relative w-full max-w-lg rounded-2xl border border-white/10
                       bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white"> <X/> </button>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-500/20 p-4">
                <Sparkles className="h-10 w-10 text-green-400" />
              </div>
              <h1 className="text-4xl font-bold text-white">It's a Match!</h1>
              <p className="mt-2 text-lg text-zinc-300"> You and your friends all liked: </p>
              {/* --- Use displayTitle from internal state --- */}
              <h2 className="mt-4 text-3xl font-bold text-white"> {displayTitle} </h2>
              <img
                // --- Use imageUrl constructed from internal state --- 
                src={imageUrl}
                alt={displayTitle}
                className="mt-6 w-64 rounded-lg shadow-2xl bg-zinc-700"
                onError={(e) => {
                   const fallback = placeholderUrl(displayTitle);
                   if (e.target.src !== fallback) e.target.src = fallback;
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
export default MatchModal;