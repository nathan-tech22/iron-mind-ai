import React from 'react';

interface PlateProps {
  weight: number;
}

const Plate: React.FC<PlateProps & { index: number }> = ({ weight, index }) => {
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
      className={`${config.color} ${config.height} ${config.width} mx-0.5 rounded-sm border border-black/20 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300`}
      style={{ animationDelay: `${index * 50}ms` }}
      title={`${weight} lbs`}
    />
  );
};

export const VisualBarbell: React.FC<{ weight: number, pr?: number }> = ({ weight, pr = 0 }) => {
  // Trigger haptic feedback on weight change
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  }, [weight]);

  const saturation = pr > 0 ? Math.min((weight / pr) * 100, 100) : 0;
  const isHighIntensity = saturation >= 90;

  const calculatePlates = (target: number) => {
    // 45lb Barbell standard
    let sideWeight = (target - 45) / 2;
    const plates = [];
    
    // Sort denominations to ensure largest plates are used first
    const denominations = [45, 25, 10, 5, 2.5]; // Standard commercial set

    // Handle 15lb plates only if specific math allows it (e.g. bumper sets)
    // For now stick to strict 45/25/10 logic for "Industrial" feel
    
    for (const d of denominations) {
      // Use a small epsilon to handle floating point math with 2.5lb plates
      while (sideWeight >= d - 0.01) {
        plates.push(d);
        sideWeight -= d;
      }
    }
    return plates;
  };

  const plates = calculatePlates(weight);

  return (
    <div className="w-full bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-inner relative overflow-hidden">
      {/* High-Voltage Pulse Effect */}
      {isHighIntensity && (
        <div className="absolute inset-0 bg-blue-600/5 animate-pulse pointer-events-none" />
      )}
      
      <div className="flex flex-col items-center relative z-10">
        <div className="relative w-full h-24 flex items-center justify-center">
          {/* The Bar */}
          <div className={`absolute w-4/5 h-2 rounded-full transition-colors duration-500 ${
            isHighIntensity ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-zinc-700'
          }`} />
          
          <div className="flex w-full justify-between px-12 z-10">
            {/* Left Plates */}
            <div className="flex flex-row-reverse items-center h-20">
              {plates.map((p, i) => <Plate key={`l-${i}-${weight}`} weight={p} index={i} />)}
            </div>
            
            {/* Right Plates */}
            <div className="flex flex-row items-center h-20">
              {plates.map((p, i) => <Plate key={`r-${i}-${weight}`} weight={p} index={i} />)}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center w-full">
          <div className="flex justify-between items-end mb-1 px-2">
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Saturation</span>
            <span className={`text-[10px] font-black italic ${isHighIntensity ? 'text-blue-500' : 'text-zinc-600'}`}>
              {Math.round(saturation)}% OF MAX
            </span>
          </div>
          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden mb-4">
            <div 
              className={`h-full transition-all duration-1000 ${isHighIntensity ? 'bg-blue-500' : 'bg-zinc-700'}`}
              style={{ width: `${saturation}%` }}
            />
          </div>
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Current Load</span>
          <div className="text-4xl font-black italic text-white">{weight} <span className="text-lg not-italic text-zinc-500">LBS</span></div>
        </div>
      </div>
    </div>
  );
};
