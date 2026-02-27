import React from 'react';

const SquatIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <g stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      {/* Bar */}
      <line x1="20" y1="30" x2="80" y2="30" />
      {/* Body / Path */}
      <path d="M50 30 V70" opacity="0.2" />
      {active && (
        <path d="M50 30 V70" fill="none" >
          <animate attributeName="stroke-dasharray" values="0, 100; 100, 0" dur="1.5s" repeatCount="indefinite" />
        </path>
      )}
      {/* Knees / Hips cue */}
      <circle cx="50" cy="60" r="5" fill="currentColor" opacity="0.5">
        {active && <animate attributeName="r" values="5; 7; 5" dur="1.5s" repeatCount="indefinite" />}
      </circle>
    </g>
  </svg>
);

const BenchIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <g stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      {/* Bar */}
      <line x1="20" y1="50" x2="80" y2="50" />
      {/* Chest cue */}
      <rect x="40" y="60" width="20" height="10" rx="3" fill="currentColor" opacity="0.3" />
      {active && (
        <line x1="50" y1="50" x2="50" y2="60">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -10; 0 0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </line>
      )}
    </g>
  </svg>
);

const DeadliftIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <g stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      {/* Bar on floor */}
      <line x1="20" y1="80" x2="80" y2="80" />
      {/* Hip Hinge cue */}
      <path d="M50 20 L40 60 L60 60 L50 20" fill="currentColor" opacity="0.3" />
      {active && (
        <line x1="50" y1="80" x2="50" y2="40">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -30; 0 0"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </line>
      )}
    </g>
  </svg>
);

const PressIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <g stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      {/* Bar */}
      <line x1="20" y1="70" x2="80" y2="70" />
      {/* Overhead path */}
      <path d="M50 70 V30" opacity="0.2" />
      {active && (
        <path d="M50 70 V30" fill="none">
          <animate attributeName="stroke-dasharray" values="0, 100; 100, 0" dur="1.5s" repeatCount="indefinite" />
        </path>
      )}
      {/* Lockout cue */}
      <circle cx="50" cy="30" r="5" fill="currentColor" opacity="0.5">
        {active && <animate attributeName="r" values="5; 7; 5" dur="1.5s" repeatCount="indefinite" />}
      </circle>
    </g>
  </svg>
);

export const LiftFigure = ({ name, active = false }: { name: string, active?: boolean }) => {
  const normalized = name.toUpperCase();
  return (
    <div className={`w-12 h-12 transition-all duration-500 ${active ? 'text-blue-500 scale-110' : 'text-zinc-700/50'}`}>
      {normalized === 'SQUAT' && <SquatIcon active={active} />}
      {normalized === 'BENCH' && <BenchIcon active={active} />}
      {normalized === 'DEADLIFT' && <DeadliftIcon active={active} />}
      {normalized === 'PRESS' && <PressIcon active={active} />}
    </div>
  );
};
