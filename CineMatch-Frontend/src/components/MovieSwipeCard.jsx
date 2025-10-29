import React from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

const posterBaseUrl = "https://image.tmdb.org/t/p/w500"; 

function MovieSwipeCard({ movie, onSwipeRight, onSwipeLeft, controls }) {
  
  // No console logs needed now
  // console.log("MovieSwipeCard rendering movie:", movie); 
  
  const handleDragEnd = (event, info) => {
    const dragX = info.offset.x;
    if (dragX > 100) { onSwipeRight(movie); } 
    else if (dragX < -100) { onSwipeLeft(); }
    // Reset position after drag only if swipe wasn't triggered
    else {
       controls?.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } });
    }
  };

  const imageUrl = movie?.poster_path 
                 ? `${posterBaseUrl}${movie.poster_path}` 
                 : null; 

  // console.log("Applying background image URL:", imageUrl);

  return (
    // Outermost Frame: Handles Drag, Animation Controls, Base Styling
    <motion.div
      className="absolute inset-0 h-full w-full cursor-grab 
                 rounded-2xl shadow-2xl overflow-hidden 
                 bg-zinc-800" // Fallback background color
      animate={controls} // Apply controls passed from SessionPage
      drag="x" 
      dragConstraints={{ left: -300, right: 300, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      // Drag elastic effect
      dragElastic={0.5} 
      // Initial animation handled by AnimatePresence in SessionPage
      // Exit animation also handled by AnimatePresence
    >
      {/* Layer 1: The Image (If it exists) */}
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={movie?.title || 'Movie Poster'}
          className="absolute inset-0 w-full h-full object-cover z-0" 
          onError={(e) => { 
            e.target.style.display = 'none'; 
            console.error("Image failed to load:", imageUrl); 
          }}
          // Prevent image dragging interfering with motion drag
          draggable="false" 
        />
      ) : (
         <div className="absolute inset-0 flex items-center justify-center text-zinc-400">No Image Available</div>
      )}

      {/* Layer 2: Gradient Overlay (Only if image exists) */}
      {imageUrl && (
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
      )}
        
      {/* Layer 3: Card Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20 pointer-events-none"> 
        <h2 className="text-3xl font-bold line-clamp-2" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
          {movie?.title || "No Title"}
        </h2>
        <p className="mt-2 text-sm line-clamp-3" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
           {movie?.overview || "No overview available."}
        </p>
      </div>
        
      {/* Layer 4: Swipe Indicators (Animated based on drag position) */}
       <motion.div 
         className="absolute top-8 left-8 text-green-400 z-30 pointer-events-none"
         style={{ rotate: -30, opacity: 0 }} // Start invisible
         // Animate opacity based on x offset (requires reading motion value)
         // For simplicity, let's keep it simple for now or use drag state if needed
       >
         <ThumbsUp className="h-24 w-24" strokeWidth={3} />
       </motion.div>
       <motion.div 
         className="absolute top-8 right-8 text-red-400 z-30 pointer-events-none"
         style={{ rotate: 30, opacity: 0 }} // Start invisible
         // Animate opacity based on x offset
       >
         <ThumbsDown className="h-24 w-24" strokeWidth={3} />
       </motion.div>
      
    </motion.div> // End motion.div
  ); // End return
} // End component

export default MovieSwipeCard;