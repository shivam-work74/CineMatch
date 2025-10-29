import React from 'react';

function Input({ className = '', ...props }) {
  return (
    <input
      className={`
        w-full px-4 py-3
        bg-white/5 
        border border-white/10
        rounded-lg 
        text-white 
        placeholder-zinc-400 
        focus:outline-none 
        focus:ring-2 focus:ring-white/50 focus:border-white/30
        hover:border-white/20 
        transition-all duration-200
        ${className} 
      `}
      {...props}
    />
  );
}

export default Input;