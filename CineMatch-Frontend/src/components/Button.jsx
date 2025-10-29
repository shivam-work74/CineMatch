import React from 'react';
import { Loader2 } from 'lucide-react';

function Button({ children, isLoading = false, className = '', ...props }) {
  return (
    <button
      className={`
        w-full px-4 py-3 
        font-bold text-white 
        bg-blue-600 
        rounded-lg 
        hover:bg-blue-700 
        focus:outline-none focus:ring-4 focus:ring-blue-600/30
        transition-all duration-200
        flex items-center justify-center
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}

export default Button;