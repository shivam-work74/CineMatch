import React from 'react';

// This is the new, "Top-Notch" SVG logo for CineMatch
function Logo({ className = '', ...props }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        
        {/* 1. The new, richer, ANIMATED gradient for the play button */}
        <linearGradient
          id="logo-gradient"
          x1="0%" y1="0%"
          x2="100%" y2="100%"
          gradientTransform="rotate(0)" // Start rotation
        >
          <stop stopColor="#60A5FA" /> {/* Light Blue */}
          <stop offset="0.5" stopColor="#818CF8" /> {/* Indigo */}
          <stop offset="1" stopColor="#A78BFA" /> {/* Light Purple */}
          
          {/* This tag animates the gradient, making it shimmer */}
          <animateTransform
            attributeName="gradientTransform"
            type="rotate"
            from="0 16 16"
            to="360 16 16"
            dur="10s"
            repeatCount="indefinite"
          />
        </linearGradient>

        {/* 2. The new "glowing" fill for the sparkle */}
        <radialGradient id="sparkle-gradient" cx="50%" cy="50%" r="50%">
          <stop stopColor="white" stopOpacity="1" />
          <stop stopColor="#A78BFA" stopOpacity="0.7" offset="0.7" />
          <stop stopColor="#A78BFA" stopOpacity="0" offset="1" />
        </radialGradient>

        {/* 3. The new "soft glow" filter, replacing the hard shadow */}
        <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

      </defs>
      
      {/* 4. The Main Play Button Path */}
      {/* We apply the animated gradient AND the new soft glow */}
      <path
        d="M6 3.75C6 2.7835 7.07714 2.14857 7.90857 2.68L26.9086 14.68C27.74 15.2114 27.74 16.3571 26.9086 16.8886L7.90857 28.8886C7.07714 29.42 6 28.7835 6 27.8171V3.75Z"
        fill="url(#logo-gradient)"
        filter="url(#soft-glow)"
      />
      
      {/* 5. The Enhanced, Animated Sparkle */}
      <g>
        <path
          d="M16 11L17.1429 14.8571L21 16L17.1429 17.1429L16 21L14.8571 17.1429L11 16L14.8571 14.8571L16 11Z"
          fill="url(#sparkle-gradient)" // Use the glowing gradient
        />
        {/* This tag makes the sparkle gently pulse */}
        <animate
          attributeName="opacity"
          values="0.7; 1; 0.7" // Fades from 70% to 100% and back
          dur="2s"
          repeatCount="indefinite"
        />
      </g>
    </svg>
  );
}

export default Logo;