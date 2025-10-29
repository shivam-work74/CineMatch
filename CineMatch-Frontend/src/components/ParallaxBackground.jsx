import React, { useState, useEffect } from 'react';

const posterBaseUrl = "https://image.tmdb.org/t/p/w1280"; // Use larger images for background

function ParallaxBackground({ movies }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!movies || movies.length === 0) return;

    // Cycle through movies every 10 seconds
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [movies]);

  if (!movies || movies.length === 0) {
    return <div className="parallax-bg"></div>; // Render empty if no movies
  }

  return (
    <div className="parallax-bg">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`parallax-layer ${index === currentIndex ? 'active' : ''}`}
          style={{
            backgroundImage: movie.poster_path ? `url(${posterBaseUrl}${movie.poster_path})` : 'none',
          }}
        />
      ))}
      {/* Add a blur overlay */}
      <div className="absolute inset-0 backdrop-blur-lg bg-black/30"></div>
    </div>
  );
}

export default ParallaxBackground;