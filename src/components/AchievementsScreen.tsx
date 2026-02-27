import React from 'react';
import { Trophy, CheckCircle, Lock, Sparkles, Dumbbell, Activity, TrendingUp, Repeat, BrainCircuit } from 'lucide-react';
import { Achievement } from '@/lib/types';

export const initialAchievements: Achievement[] = [
  {
    id: 'first_workout',
    name: 'First Iron Forged',
    description: 'Complete your very first workout session.',
    icon: 'Dumbbell',
    criteria: '1 workout logged',
    earned: false,
  },
  {
    id: 'five_workouts',
    name: 'Consistent Crusher',
    description: 'Log 5 workout sessions.',
    icon: 'Activity',
    criteria: '5 workouts logged',
    earned: false,
  },
  {
    id: 'new_pr',
    name: 'Peak Performance',
    description: 'Hit a new Personal Record (PR) in any lift.',
    icon: 'TrendingUp',
    criteria: '1 new PR achieved',
    earned: false,
  },
  {
    id: 'complete_cycle',
    name: 'Cycle Conqueror',
    description: 'Complete a full 4-week training cycle.',
    icon: 'Repeat',
    criteria: '1 training cycle completed',
    earned: false,
  },
  {
    id: 'daily_readiness_pro',
    name: 'Mindful Mover',
    description: 'Log your daily readiness for 7 consecutive days.',
    icon: 'BrainCircuit',
    criteria: '7-day readiness streak',
    earned: false,
  },
];

interface AchievementsScreenProps {
  achievements: Achievement[];
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ achievements }) => {

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Dumbbell': return <Dumbbell size={24} className="text-white" />;
      case 'Activity': return <Activity size={24} className="text-white" />;
      case 'TrendingUp': return <TrendingUp size={24} className="text-white" />;
      case 'Repeat': return <Repeat size={24} className="text-white" />;
      case 'BrainCircuit': return <BrainCircuit size={24} className="text-white" />;
      default: return <Sparkles size={24} className="text-white" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32">
      <header className="pt-12 mb-8">
        <h1 className="text-2xl font-black tracking-tighter italic text-blue-500">Achievements</h1>
        <p className="text-zinc-500 text-sm mt-1">Milestones forged through iron and will.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((ach) => (
          <div 
            key={ach.id} 
            className={`p-5 rounded-2xl border transition-all relative overflow-hidden 
              ${ach.earned ? 'bg-blue-600/20 border-blue-500/50' : 'bg-zinc-900 border-zinc-800'}
            `}
          >
            <div className="flex items-center gap-4 mb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center 
                ${ach.earned ? 'bg-blue-600' : 'bg-zinc-700'}
              `}>
                {ach.earned ? getIconComponent(ach.icon) : <Lock size={20} className="text-zinc-400" />}
              </div>
              <div>
                <h2 className={`font-black italic text-lg ${ach.earned ? 'text-white' : 'text-zinc-300'}`}>{ach.name}</h2>
                <p className={`text-xs ${ach.earned ? 'text-blue-200' : 'text-zinc-500'}`}>{ach.description}</p>
              </div>
            </div>
            <div className="text-right text-xs font-bold uppercase ">
              {ach.earned ? (
                <span className="text-blue-300">Earned: {new Date(ach.earned_date || '').toLocaleDateString()}</span>
              ) : (
                <span className="text-zinc-600">Criteria: {ach.criteria}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
