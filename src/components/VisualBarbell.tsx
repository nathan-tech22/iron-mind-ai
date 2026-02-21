import React from 'react';

interface PlateProps {
  weight: number;
}

const Plate: React.FC<PlateProps> = ({ weight }) => {
  const configs: Record<number, { color: string; height: string; width: string }> = {
    45: { color: 'bg-blue-600', height: 'h-20', width: 'w-4' },
    25: { color: 'bg-green-600', height: 'h-16', width: 'w-3' },
    15: { color: 'bg-yellow-500', height: 'h-14', width: 'w-2.5' },
    10: { color: 'bg-white', height: 'h-12', width: 'w-2' },
    5: { color: 'bg-red-600', height: 'h-10', width: 'w-1.5' },
    2.5: { color: 'bg-zinc-400', height: 'h-8', width: 'w-1' },
  };

  const config = configs[weight] || configs[2.5];

  return (
    <div 
      className={`${config.color} ${config.height} ${config.width} mx-0.5 rounded-sm border border-black/20 shadow-sm`}
      title={`${weight} lbs`}
    />
  );
};

export const VisualBarbell: React.FC<{ weight: number }> = ({ weight }) => {
  const calculatePlates = (target: number) => {
    let sideWeight = (target - 45) / 2;
    const plates = [];
    const denominations = [45, 25, 15, 10, 5, 2.5];

    for (const d of denominations) {
      while (sideWeight >= d) {
        plates.push(d);
        sideWeight -= d;
      }
    }
    return plates;
  };

  const plates = calculatePlates(weight);

  return (
    <div className="w-full bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-inner">
      <div className="flex flex-col items-center">
        <div className="relative w-full h-24 flex items-center justify-center">
          {/* The Bar */}
          <div className="absolute w-4/5 h-2 bg-zinc-700 rounded-full" />
          
          <div className="flex w-full justify-between px-12 z-10">
            {/* Left Plates */}
            <div className="flex flex-row-reverse items-center h-20">
              {plates.map((p, i) => <Plate key={`l-${i}`} weight={p} />)}
            </div>
            
            {/* Right Plates */}
            <div className="flex flex-row items-center h-20">
              {plates.map((p, i) => <Plate key={`r-${i}`} weight={p} />)}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Current Load</span>
          <div className="text-4xl font-black italic text-white">{weight} <span className="text-lg not-italic text-zinc-500">LBS</span></div>
        </div>
      </div>
    </div>
  );
};
