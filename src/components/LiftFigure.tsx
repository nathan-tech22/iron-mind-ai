import React from 'react';

const BarbellIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="15" y="45" width="70" height="10" rx="3" fill="currentColor" /> {/* Bar */}
    <rect x="10" y="35" width="5" height="30" rx="2" fill="currentColor" /> {/* Left Plate */}
    <rect x="85" y="35" width="5" height="30" rx="2" fill="currentColor" /> {/* Right Plate */}
    {active && (
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 -5; 0 0"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1; 0.7; 1"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </g>
    )}
  </svg>
);

export const LiftFigure = ({ name, active = false }: { name: string, active?: boolean }) => {
  return (
    <div className={`w-12 h-12 transition-all duration-500 ${active ? 'text-blue-500 scale-110' : 'text-zinc-700/50'}`}>
      <BarbellIcon active={active} />
    </div>
  );
};
