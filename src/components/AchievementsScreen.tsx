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
      case 'Dumbbell': return <Dumbbell size={24} className="text-[var(--color-text)]" />;
      case 'Activity': return <Activity size={24} className="text-[var(--color-text)]" />;
      case 'TrendingUp': return <TrendingUp size={24} className="text-[var(--color-text)]" />;
      case 'Repeat': return <Repeat size={24} className="text-[var(--color-text)]" />;
      case 'BrainCircuit': return <BrainCircuit size={24} className="text-[var(--color-text)]" />;
      default: return <Sparkles size={24} className="text-[var(--color-text)]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] p-6 pb-32">
      <header className="pt-12 mb-8">
        <h1 className="text-2xl font-black tracking-tighter italic text-[var(--color-primary)]">Achievements</h1>
        <p className="text-[var(--color-text-muted)] text-sm mt-1">Milestones forged through iron and will.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((ach) => (
          <div 
            key={ach.id} 
            className={`p-5 rounded-2xl border transition-all relative overflow-hidden 
              ${ach.earned ? 'bg-[var(--color-primary)]/20 border-[var(--color-secondary)]/50' : 'bg-[var(--color-card-bg)] border-[var(--color-border)]'}
            `}
          >
            <div className="flex items-center gap-4 mb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center 
                ${ach.earned ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-card-bg)]'}
              `}>
                {ach.earned ? getIconComponent(ach.icon) : <Lock size={20} className="text-[var(--color-text-muted)]" />}
              </div>
              <div>
                <h2 className={`font-black italic text-lg ${ach.earned ? 'text-[var(--color-text)]' : 'text-[var(--color-text)]'}`}>{ach.name}</h2>
                <p className={`text-xs ${ach.earned ? 'text-[var(--color-secondary)]' : 'text-[var(--color-text-muted)]'}`}>{ach.description}</p>
              </div>
            </div>
            <div className="text-right text-xs font-bold uppercase ">
              {ach.earned ? (
                <span className="text-[var(--color-secondary)]">Earned: {new Date(ach.earned_date || '').toLocaleDateString()}</span>
              ) : (
                <span className="text-[var(--color-text-muted)]">Criteria: {ach.criteria}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
