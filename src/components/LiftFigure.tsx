import React from 'react';

const SquatFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <g>
      <circle cx="50" cy="20" r="8" fill="currentColor" />
      <path d="M50 28 L50 50 L35 80 M50 50 L65 80" stroke="currentColor" strokeWidth="4" fill="none" />
      <path d="M30 35 L70 35" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      {active && (
        <animateTransform 
          attributeName="transform" 
          type="translate" 
          values="0 0; 0 25; 0 0" 
          dur="1.8s" 
          repeatCount="indefinite" 
        />
      )}
    </g>
  </svg>
);

const BenchFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="20" y="70" width="60" height="4" fill="currentColor" opacity="0.2" />
    <g transform="translate(0, 5)">
      <circle cx="50" cy="55" r="8" fill="currentColor" />
      <path d="M30 55 L70 55" stroke="currentColor" strokeWidth="4" />
      <g>
        <path d="M30 40 L70 40" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        {active && (
          <animateTransform 
            attributeName="transform" 
            type="translate" 
            values="0 0; 0 15; 0 0" 
            dur="2s" 
            repeatCount="indefinite" 
          />
        )}
      </g>
    </g>
  </svg>
);

const DeadliftFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <g>
      <circle cx="50" cy="30" r="8" fill="currentColor" />
      <path d="M50 38 L50 55" stroke="currentColor" strokeWidth="4" fill="none" />
      <path d="M50 55 L40 90 M50 55 L60 90" stroke="currentColor" strokeWidth="4" fill="none" />
      <path d="M50 40 L35 75 M50 40 L65 75" stroke="currentColor" strokeWidth="3" fill="none" />
      {active && (
        <animateTransform 
          attributeName="transform" 
          type="translate" 
          values="0 0; 0 -25; 0 0" 
          dur="2.5s" 
          repeatCount="indefinite" 
        />
      )}
    </g>
    <g>
      <path d="M20 75 L80 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      {active && (
        <animateTransform 
          attributeName="transform" 
          type="translate" 
          values="0 0; 0 -25; 0 0" 
          dur="2.5s" 
          repeatCount="indefinite" 
        />
      )}
    </g>
  </svg>
);

const PressFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="40" r="8" fill="currentColor" />
    <path d="M50 48 L50 75 L40 95 M50 75 L60 95" stroke="currentColor" strokeWidth="4" fill="none" />
    <g>
      <path d="M25 45 L75 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      {active && (
        <animateTransform 
          attributeName="transform" 
          type="translate" 
          values="0 0; 0 -35; 0 0" 
          dur="2.2s" 
          repeatCount="indefinite" 
        />
      )}
    </g>
  </svg>
);

export const LiftFigure = ({ name, active = false }: { name: string, active?: boolean }) => {
  const normalized = name.toUpperCase();
  return (
    <div className={`w-12 h-12 transition-all duration-500 ${active ? 'text-blue-500 scale-110' : 'text-blue-500/30'}`}>
      {normalized === 'SQUAT' && <SquatFigure active={active} />}
      {normalized === 'BENCH' && <BenchFigure active={active} />}
      {normalized === 'DEADLIFT' && <DeadliftFigure active={active} />}
      {normalized === 'PRESS' && <PressFigure active={active} />}
    </div>
  );
};
