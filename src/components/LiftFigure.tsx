import React from 'react';

const SquatFigure = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="20" r="8" fill="currentColor" />
    <path d="M50 28 L50 50 L35 80 M50 50 L65 80" stroke="currentColor" strokeWidth="4" fill="none" />
    <path d="M30 35 L70 35" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M35 35 L35 45 M65 35 L65 45" stroke="currentColor" strokeWidth="2" />
    <animateTransform 
      attributeName="transform" 
      type="translate" 
      from="0 0" 
      to="0 20" 
      dur="2s" 
      repeatCount="indefinite" 
    />
  </svg>
);

const BenchFigure = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="20" y="60" width="60" height="5" fill="currentColor" opacity="0.3" />
    <circle cx="50" cy="52" r="8" fill="currentColor" />
    <path d="M30 52 L70 52" stroke="currentColor" strokeWidth="4" />
    <path d="M30 40 L70 40" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
      <animate attributeName="d" values="M30 40 L70 40; M30 55 L70 55; M30 40 L70 40" dur="2.5s" repeatCount="indefinite" />
    </path>
  </svg>
);

const DeadliftFigure = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="30" r="8" fill="currentColor">
       <animate attributeName="cy" values="30; 20; 30" dur="3s" repeatCount="indefinite" />
    </circle>
    <path d="M50 38 L50 60 L35 90 M50 60 L65 90" stroke="currentColor" strokeWidth="4" fill="none">
       <animate attributeName="d" values="M50 38 L50 60 L35 90 M50 60 L65 90; M50 28 L50 50 L45 90 M50 50 L55 90; M50 38 L50 60 L35 90 M50 60 L65 90" dur="3s" repeatCount="indefinite" />
    </path>
    <path d="M20 60 L80 60" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
       <animate attributeName="transform" type="translate" values="0 0; 0 -20; 0 0" dur="3s" repeatCount="indefinite" />
    </path>
  </svg>
);

const PressFigure = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="40" r="8" fill="currentColor" />
    <path d="M50 48 L50 75 L40 95 M50 75 L60 95" stroke="currentColor" strokeWidth="4" fill="none" />
    <path d="M25 45 L75 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
       <animate attributeName="transform" type="translate" values="0 0; 0 -25; 0 0" dur="2s" repeatCount="indefinite" />
    </path>
  </svg>
);

export const LiftFigure = ({ name }: { name: string }) => {
  const normalized = name.toUpperCase();
  return (
    <div className="w-12 h-12 text-blue-500/40">
      {normalized === 'SQUAT' && <SquatFigure />}
      {normalized === 'BENCH' && <BenchFigure />}
      {normalized === 'DEADLIFT' && <DeadliftFigure />}
      {normalized === 'PRESS' && <PressFigure />}
    </div>
  );
};
