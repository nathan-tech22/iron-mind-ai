import { CheckCircle2, Circle } from 'lucide-react';
import React from 'react';

interface SetRowProps {
  set: {
    weight: number;
    reps: string;
  };
  index: number;
  completedSets: number[];
  toggleSet: (index: number) => void;
  rpeValue: number | null;
  onRPEChange: (index: number, rpe: number) => void;
}

export const SetRow = ({ set, index, completedSets, toggleSet, rpeValue, onRPEChange }: SetRowProps) => {
  const isCompleted = completedSets.includes(index);

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
      isCompleted ? 'bg-blue-600/20 border-blue-500/50' : 'bg-zinc-900/40 border-zinc-800/40'
    }`}>
      <div className="flex items-center gap-4">
        <button onClick={() => toggleSet(index)} className="text-zinc-500">
          {isCompleted ? <CheckCircle2 size={20} className="text-blue-500" /> : <Circle size={20} />}
        </button>
        <div>
          <span className="text-lg font-bold text-white">{set.weight}</span>
          <span className="text-sm text-zinc-400"> lbs</span>
          <span className="text-xs text-zinc-600 mx-2">•</span>
          <span className="text-sm text-zinc-400">{set.reps} reps</span>
        </div>
      </div>
      {isCompleted && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-zinc-500">RPE</span>
          <input
            type="number"
            min="1"
            max="10"
            value={rpeValue === null ? '' : rpeValue}
            onChange={(e) => onRPEChange(index, parseInt(e.target.value) || 0)}
            className="w-12 bg-zinc-800 text-white text-center rounded-lg p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="-"
          />
        </div>
      )}
    </div>
  );
};
