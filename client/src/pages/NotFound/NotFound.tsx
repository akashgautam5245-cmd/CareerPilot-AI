import React from 'react';
import { Sparkles, Home } from 'lucide-react';

interface NotFoundProps {
  onGoHome: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-950 text-blue-500 flex items-center justify-center text-3xl font-black">
        404
      </div>
      <h2 className="text-2xl font-black text-gray-900 dark:text-white">Page Not Found</h2>
      <p className="text-xs text-gray-500 max-w-sm">The page or module you are looking for does not exist or has been moved.</p>
      <button
        onClick={onGoHome}
        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg glow-blue flex items-center gap-2"
      >
        <Home className="w-4 h-4" /> Return to Dashboard
      </button>
    </div>
  );
};
