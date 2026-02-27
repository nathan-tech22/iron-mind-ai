import React from 'react';

const SquatFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <g>
      {/* Head */}
      <circle cx="50" cy="22" r="7" fill="currentColor" />
      {/* Torso */}
      <path d="M50 29 L50 52" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Hips */}
      <circle cx="50" cy="52" r="4" fill="currentColor" />
      {/* Upper Legs */}
      <path d="M50 52 L40 75 M50 52 L60 75" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Lower Legs */}
      <path d="M40 75 L40 90 M60 75 L60 90" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Feet */}
      <path d="M38 90 L42 90 M58 90 L62 90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Barbell on shoulders */}
      <path d="M25 35 L75 35" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      {/* Arms (holding barbell) */}
      <path d="M50 33 L38 38 M50 33 L62 38" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
      {active && <animateTransform attributeName="transform" type="translate" values="0 0; 0 15; 0 0" dur="1.8s" repeatCount="indefinite" />}
    </g>
  </svg>
);

const BenchFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    {/* Bench */}
    <rect x="15" y="80" width="70" height="5" fill="currentColor" opacity="0.2" />
    {/* Head */}
    <circle cx="50" cy="55" r="7" fill="currentColor" />
    {/* Torso */}
    <path d="M50 62 L50 78" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
    {/* Arms holding barbell */}
    <path d="M50 62 L30 65 M50 62 L70 65" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
    {/* Barbell */}
    <path d="M25 60 L75 60" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    {active && <animateTransform attributeName="transform" type="translate" values="0 0; 0 -15; 0 0" dur="2s" repeatCount="indefinite" />}
  </svg>
);

const DeadliftFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <g>
      {/* Head */}
      <circle cx="50" cy="20" r="7" fill="currentColor" />
      {/* Torso (angled for bent-over posture) */}
      <path d="M50 27 L55 55" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Hips */}
      <circle cx="55" cy="55" r="4" fill="currentColor" />
      {/* Upper Legs (slightly bent) */}
      <path d="M55 55 L45 75 M55 55 L65 75" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Lower Legs */}
      <path d="M45 75 L45 90 M65 75 L65 90" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Feet */}
      <path d="M43 90 L47 90 M63 90 L67 90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Arms (extended to bar) */}
      <path d="M50 30 L30 70 M50 30 L70 70" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Barbell on floor */}
      <path d="M20 75 L80 75" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      
      {active && (
        <animateTransform 
          attributeName="transform" 
          type="translate" 
          values="0 0; 0 -15; 0 0" 
          dur="2.5s" 
          repeatCount="indefinite" 
        />
      )}
    </g>
  </svg>
);

const PressFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <g>
      {/* Head */}
      <circle cx="50" cy="20" r="7" fill="currentColor" />
      {/* Torso */}
      <path d="M50 27 L50 60" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Hips */}
      <circle cx="50" cy="60" r="4" fill="currentColor" />
      {/* Legs */}
      <path d="M50 60 L40 90 M50 60 L60 90" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Feet */}
      <path d="M38 90 L42 90 M58 90 L62 90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Arms (overhead) */}
      <path d="M50 30 L35 15 M50 30 L65 15" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Barbell (overhead) */}
      <path d="M25 15 L75 15" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      {active && <animateTransform attributeName="transform" type="translate" values="0 0; 0 15; 0 0" dur="2s" repeatCount="indefinite" />}
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
