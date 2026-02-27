import React, { useEffect } from 'react';
import { Trophy, Star, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PRAlertProps {
  lift: string;
  weight: number;
  est1RM: number;
  onClose: () => void;
}

export const PRAlert: React.FC<PRAlertProps> = ({ lift, weight, est1RM, onClose }) => {
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#10b981', '#ffffff']
    });
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
      <div className="bg-zinc-900 border-2 border-blue-500 rounded-[3rem] p-10 w-full max-w-sm text-center relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-in zoom-in duration-300">
        <div className="absolute -top-10 -right-10 opacity-10 rotate-12">
          <Trophy size={200} className="text-blue-500" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-blue-600 p-4 rounded-3xl mb-6 shadow-lg shadow-blue-900/40">
            <Star size={40} className="text-white fill-white" />
          </div>
          
          <h2 className="text-sm font-black text-blue-400 uppercase tracking-[0.3em] mb-2">New Strength Record</h2>
          <h3 className="text-4xl font-black italic text-white mb-6">{lift}</h3>
          
          <div className="space-y-1 mb-8">
            <div className="text-5xl font-black italic text-white tracking-tighter">{est1RM}</div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Estimated 1RM (LBS)</div>
          </div>
          
          <p className="text-zinc-400 text-sm font-medium mb-10 leading-relaxed px-4">
            You just moved <span className="text-white font-bold">{weight} lbs</span>. Your calculated strength has hit a new peak.
          </p>
          
          <button 
            onClick={onClose}
            className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-zinc-200 transition-colors tracking-widest italic"
          >
            STAY HUNGRY
          </button>
        </div>
      </div>
    </div>
  );
};
