import React from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

const posterBaseUrl = "https://image.tmdb.org/t/p/w500";

function MovieSwipeCard({ movie, onSwipeRight, onSwipeLeft, controls, index, totalCards }) {

  const handleDragEnd = (event, info) => {
    const dragX = info.offset.x;
    if (dragX > 100) { onSwipeRight(movie); }
    else if (dragX < -100) { onSwipeLeft(); }
    else {
      controls?.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } });
    }
  };

  const imageUrl = movie?.poster_path ? `${posterBaseUrl}${movie.poster_path}` : null;

  const scale = 1 - (totalCards - 1 - index) * 0.05;
  const translateY = (totalCards - 1 - index) * 10;
  // Make only the top card draggable
  const isTopCard = index === totalCards - 1;

  return (
    <motion.div
      className="absolute inset-0 h-full w-full cursor-grab
                 rounded-2xl shadow-2xl overflow-hidden
                 bg-zinc-800"
      style={{
        zIndex: index,
        // Apply stacking transforms directly for non-top cards
        // For the top card, Framer Motion controls will handle transforms
        scale: isTopCard ? 1 : scale,
        y: isTopCard ? 0 : translateY,
      }}
      // Animate prop receives controls ONLY if it's the top card
      animate={isTopCard ? controls : { scale: scale, y: translateY, opacity: 1 }}
      initial={{ scale: scale * 0.95, opacity: 0, y: translateY - 20 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } }}
      drag={isTopCard ? "x" : false} // Only top card is draggable
      dragConstraints={{ left: -300, right: 300, top: 0, bottom: 0 }}
      onDragEnd={isTopCard ? handleDragEnd : undefined}
      dragElastic={0.5}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={movie?.title || 'Movie Poster'}
          className="absolute inset-0 w-full h-full object-cover z-0"
          onError={(e) => { e.target.style.display = 'none'; console.error("Image failed:", imageUrl); }}
          draggable="false"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-400">No Image</div>
      )}
      {imageUrl && (
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
      )}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20 pointer-events-none">
        <h2 className="text-3xl font-bold line-clamp-2" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
          {movie?.title || "No Title"}
        </h2>
        <p className="mt-2 text-sm line-clamp-3" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
          {movie?.overview || "No overview available."}
        </p>
      </div>
      <motion.div
        className="absolute top-8 left-8 text-green-400 z-30 pointer-events-none"
        style={{ rotate: -30, opacity: 0 }}
        animate={{ opacity: controls?.state?.x?.getVelocity() > 50 ? 1 : 0 }}
      >
        <ThumbsUp className="h-24 w-24" strokeWidth={3} />
      </motion.div>
      <motion.div
        className="absolute top-8 right-8 text-red-400 z-30 pointer-events-none"
        style={{ rotate: 30, opacity: 0 }}
        animate={{ opacity: controls?.state?.x?.getVelocity() < -50 ? 1 : 0 }}
      >
        <ThumbsDown className="h-24 w-24" strokeWidth={3} />
      </motion.div>
    </motion.div>
  );
}

export default MovieSwipeCard;