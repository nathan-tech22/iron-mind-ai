import React from 'react';

const SquatFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    {/* Feet / Lower Leg (Fixed) */}
    <path d="M35 100 L42 85 M65 100 L58 85" stroke="currentColor" strokeWidth="4" fill="none" />
    {/* Moving Upper Body + Bar */}
    <g>
      <circle cx="50" cy="25" r="8" fill="currentColor" />
      <path d="M50 33 L50 55 L42 85 M50 55 L58 85" stroke="currentColor" strokeWidth="4" fill="none" />
      <path d="M25 40 L75 40" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      {active && <animateTransform attributeName="transform" type="translate" values="0 0; 0 20; 0 0" dur="2s" repeatCount="indefinite" />}
    </g>
  </svg>
);

const BenchFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="20" y="75" width="60" height="4" fill="currentColor" opacity="0.2" />
    <circle cx="50" cy="65" r="8" fill="currentColor" />
    <path d="M30 65 L70 65" stroke="currentColor" strokeWidth="4" />
    <g>
      <path d="M25 45 L75 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      {active && <animateTransform attributeName="transform" type="translate" values="0 0; 0 15; 0 0" dur="2s" repeatCount="indefinite" />}
    </g>
  </svg>
);

const DeadliftFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    {/* Feet (Fixed) */}
    <path d="M40 100 L45 85 M60 100 L55 85" stroke="currentColor" strokeWidth="4" fill="none" />
    <g>
      <circle cx="50" cy="35" r="8" fill="currentColor" />
      <path d="M50 43 L50 65 L45 85 M50 65 L55 85" stroke="currentColor" strokeWidth="4" fill="none" />
      <path d="M50 45 L30 75 M50 45 L70 75" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M20 75 L80 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      {active && <animateTransform attributeName="transform" type="translate" values="0 0; 0 -25; 0 0" dur="2.5s" repeatCount="indefinite" />}
    </g>
  </svg>
);

const PressFigure = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="50" r="8" fill="currentColor" />
    <path d="M50 58 L50 80 L40 100 M50 80 L60 100" stroke="currentColor" strokeWidth="4" fill="none" />
    <g>
      <path d="M25 55 L75 55" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      {active && <animateTransform attributeName="transform" type="translate" values="0 0; 0 -40; 0 0" dur="2s" repeatCount="indefinite" />}
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
