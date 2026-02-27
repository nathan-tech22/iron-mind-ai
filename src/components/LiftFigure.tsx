import React from 'react';

const SquatKineticFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <g>
      {/* Bar path (subtle background line) */}
      <path d="M50 30 V70" stroke="currentColor" strokeWidth="2" opacity="0.1" fill="none" />

      {/* Barbell */}
      <rect x="25" y="25" width="50" height="10" rx="3" fill="currentColor">
        {active && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 40; 0 0"
            dur="1.8s"
            repeatCount="indefinite"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
          />
        )}
      </rect>

      {/* Energy lines/guides */}
      <path d="M40 30 C 30 40, 30 60, 40 70" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.4">
        {active && (
          <animate
            attributeName="stroke-dasharray"
            values="0, 100; 100, 0"
            dur="1.8s"
            repeatCount="indefinite"
          />
        )}
      </path>
      <path d="M60 30 C 70 40, 70 60, 60 70" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.4">
        {active && (
          <animate
            attributeName="stroke-dasharray"
            values="0, 100; 100, 0"
            dur="1.8s"
            repeatCount="indefinite"
          />
        )}
      </path>

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
      {normalized === 'SQUAT' && <SquatKineticFigure active={active} />}
      {normalized === 'BENCH' && <BenchFigure active={active} />}
      {normalized === 'DEADLIFT' && <DeadliftFigure active={active} />}
      {normalized === 'PRESS' && <PressFigure active={active} />}
    </div>
  );
};
