import React from 'react';

const SquatFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    {/* Entire Figure as one Path to prevent separation */}
    <path 
      d="M35 100 L42 80 L50 55 L58 80 L65 100 M50 55 L50 30" 
      stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"
    >
      {active && (
        <animate 
          attributeName="d" 
          values="M35 100 L42 80 L50 55 L58 80 L65 100 M50 55 L50 30; 
                  M35 100 L30 90 L50 85 L70 90 L65 100 M50 85 L50 60; 
                  M35 100 L42 80 L50 55 L58 80 L65 100 M50 55 L50 30" 
          dur="2s" 
          repeatCount="indefinite" 
        />
      )}
    </path>
    <circle cx="50" cy="22" r="7" fill="currentColor">
       {active && <animate attributeName="cy" values="22; 52; 22" dur="2s" repeatCount="indefinite" />}
    </circle>
    {/* Barbell */}
    <path d="M25 35 L75 35" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
       {active && <animate attributeName="d" values="M25 35 L75 35; M25 65 L75 65; M25 35 L75 35" dur="2s" repeatCount="indefinite" />}
    </path>
  </svg>
);

const BenchFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="20" y="75" width="60" height="4" fill="currentColor" opacity="0.2" />
    <circle cx="50" cy="65" r="7" fill="currentColor" />
    <path d="M30 65 L70 65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path d="M25 45 L75 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
      {active && <animate attributeName="d" values="M25 45 L75 45; M25 65 L75 65; M25 45 L75 45" dur="2.5s" repeatCount="indefinite" />}
    </path>
  </svg>
);

const DeadliftFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    {/* Body with Hinge Logic */}
    <path 
      d="M40 100 L45 80 L50 50 L55 80 L60 100 M50 50 L50 25" 
      stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"
    >
       {active && (
         <animate 
          attributeName="d" 
          values="M40 100 L45 80 L50 75 L55 80 L60 100 M50 75 L65 55; 
                  M40 100 L45 80 L50 50 L55 80 L60 100 M50 50 L50 25; 
                  M40 100 L45 80 L50 75 L55 80 L60 100 M50 75 L65 55" 
          dur="2.5s" 
          repeatCount="indefinite" 
        />
       )}
    </path>
    <circle cx="50" cy="20" r="7" fill="currentColor">
       {active && <animate attributeName="cy" values="45; 20; 45" dur="2.5s" repeatCount="indefinite" />}
    </circle>
    {/* Arms & Bar */}
    <g>
      <path d="M20 80 L80 80" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
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
    <circle cx="50" cy="45" r="7" fill="currentColor" />
    <path d="M50 53 L50 75 L42 100 M50 75 L58 100" stroke="currentColor" strokeWidth="4" fill="none" />
    <path d="M25 50 L75 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
      {active && <animate attributeName="d" values="M25 50 L75 50; M25 15 L75 15; M25 50 L75 50" dur="2s" repeatCount="indefinite" />}
    </path>
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
