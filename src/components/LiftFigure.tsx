import React from 'react';

const SquatFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <g>
      {/* Head */}
      <circle cx="50" cy="25" r="8" fill="currentColor" />
      {/* Torso */}
      <path d="M50 33 L50 55" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Hips to Knees (Upper Leg) */}
      <path d="M50 55 L42 85 M50 55 L58 85" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Knees to Feet (Lower Leg) - Stays on ground */}
      <path d="M42 85 L35 100 M58 85 L65 100" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Barbell */}
      <path d="M25 40 L75 40" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      {active && <animateTransform attributeName="transform" type="translate" values="0 0; 0 20; 0 0" dur="1.8s" repeatCount="indefinite" />}
    </g>
  </svg>
);

const BenchFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="20" y="75" width="60" height="4" fill="currentColor" opacity="0.2" />
    <circle cx="50" cy="65" r="7" fill="currentColor" />
    <path d="M30 65 L70 65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <g>
      <path d="M25 45 L75 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      {active && <animateTransform attributeName="transform" type="translate" values="0 0; 0 20; 0 0" dur="2s" repeatCount="indefinite" />}
    </g>
  </svg>
);

const DeadliftFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <g>
      {/* Head */}
      <circle cx="50" cy="35" r="8" fill="currentColor" />
      {/* Torso */}
      <path d="M50 43 L50 65" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Hips to Knees (Upper Leg) */}
      <path d="M50 65 L45 85 M50 65 L55 85" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Knees to Feet (Lower Leg) - Stays on ground */}
      <path d="M45 85 L40 100 M55 85 L60 100" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Arms reaching for the bar */}
      <path d="M50 45 L35 75 M50 45 L65 75" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Barbell */}
      <path d="M20 75 L80 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      
      {active && (
        <animateTransform 
          attributeName="transform" 
          type="translate" 
          values="0 0; 0 -20; 0 0" 
          dur="2.5s" 
          repeatCount="indefinite" 
        />
      )}
    </g>
  </svg>
);

const PressFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path d="M42 100 L50 80 L58 100" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
    <g>
      <circle cx="50" cy="50" r="7" fill="currentColor" />
      <path d="M50 58 L50 80" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M25 55 L75 55" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      {active && <animateTransform attributeName="transform" type="translate" values="0 0; 0 -35; 0 0" dur="2s" repeatCount="indefinite" />}
    </g>
  </svg>
);

export const LiftFigure = ({ name, active = false }: { name: string, active?: boolean }) => {
  const normalized = name.toUpperCase();
  return (
    <div className={`w-12 h-12 transition-all duration-500 ${active ? 'text-blue-500 scale-110' : 'text-blue-500/20'}`}>
      {normalized === 'SQUAT' && <SquatFigure active={active} />}
      {normalized === 'BENCH' && <BenchFigure active={active} />}
      {normalized === 'DEADLIFT' && <DeadliftFigure active={active} />}
      {normalized === 'PRESS' && <PressFigure active={active} />}
    </div>
  );
};
