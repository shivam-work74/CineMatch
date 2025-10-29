import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

const posterBaseUrl = "https://image.tmdb.org/t/p/w500";

// 'show' controls if the modal is open
// 'movie' is the { title, poster_path } object
// 'onClose' is the function to call when the user clicks "X"
function MatchModal({ show, movie, onClose }) {
  return (
    // AnimatePresence is what allows the modal to fade in and out
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* --- 1. Backdrop --- */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose} // Close modal if you click the background
          />
          
          {/* --- 2. The Modal Card --- */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 100 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg rounded-2xl border border-white/10 
                       bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
          >
            {/* --- Close Button --- */}
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* --- Modal Content --- */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-500/20 p-4">
                <Sparkles className="h-10 w-10 text-green-400" />
              </div>
              
              <h1 className="text-4xl font-bold text-white">It's a Match!</h1>
              <p className="mt-2 text-lg text-zinc-300">
                You and your friends all liked:
              </p>
              
              <h2 className="mt-4 text-3xl font-bold text-white">
                {movie?.title}
              </h2>
              
              <img
                src={`${posterBaseUrl}${movie?.poster_path}`}
                alt={movie?.title}
                className="mt-6 w-64 rounded-lg shadow-2xl"
              />
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default MatchModal;