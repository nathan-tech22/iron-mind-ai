import React from 'react';

export const LiftFigure = ({ name, active = false }: { name: string, active?: boolean }) => {
  return (
    <div className={`w-12 h-12 transition-all duration-500 ${active ? 'text-transparent scale-110' : 'text-transparent'}`}>
      {/* This component is currently empty per user request. */}
    </div>
  );
};
