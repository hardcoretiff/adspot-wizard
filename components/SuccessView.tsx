
import React from 'react';
import { CheckCircle, LayoutDashboard, ArrowRight } from 'lucide-react';

interface SuccessViewProps {
  onGoToDashboard: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ onGoToDashboard }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-green-900/20">
        <CheckCircle size={48} className="text-green-500" />
      </div>
      
      <h2 className="text-4xl font-bold text-white mb-4">You're All Set!</h2>
      <p className="text-xl text-gray-400 max-w-xl mb-8">
        Your AdSpot 2.0 workspace has been created, your pixel is active, and your campaign data is synced.
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full mb-8 text-left">
        <h3 className="text-white font-bold mb-4 border-b border-neutral-800 pb-2">Next Steps</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-red-900/30 flex items-center justify-center shrink-0 text-xs font-bold text-red-500">1</div>
            <span className="text-gray-300 text-sm">Check your email for your login credentials.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-red-900/30 flex items-center justify-center shrink-0 text-xs font-bold text-red-500">2</div>
            <span className="text-gray-300 text-sm">Install the tracking pixel if you haven't already.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-red-900/30 flex items-center justify-center shrink-0 text-xs font-bold text-red-500">3</div>
            <span className="text-gray-300 text-sm">Launch your first automated campaign.</span>
          </li>
        </ul>
      </div>

      <button 
        onClick={onGoToDashboard}
        className="flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-red-900/30"
      >
        <LayoutDashboard size={20} />
        Go to Dashboard
        <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default SuccessView;
