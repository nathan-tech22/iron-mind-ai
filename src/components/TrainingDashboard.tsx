import React, { useState, useEffect } from 'react';
import { VisualBarbell } from './VisualBarbell';
import { Dumbbell, History, TrendingUp, Settings as SettingsIcon, CheckCircle2, Circle, ChevronLeft, ChevronRight } from 'lucide-react';
import { calculateWorkout } from '@/lib/workout-logic';
import { PRTracker } from './PRTracker';
import { HistoryScreen } from './HistoryScreen';
import { SettingsScreen } from './SettingsScreen';

const initialLiftsData = [
  { id: '1', name: 'SQUAT', tm: 315 },
  { id: '2', name: 'BENCH', tm: 225 },
  { id: '3', name: 'DEADLIFT', tm: 405 },
  { id: '4', name: 'PRESS', tm: 135 },
];

const TrainingView = ({ 
  lifts, 
  week, 
  cycleWeek, 
  selectedLift, 
  setSelectedLift, 
  completedSets, 
  toggleSet,
  logWorkout,
  showSuccess 
}: any) => {
  const workoutSets = calculateWorkout(selectedLift.tm, week);
  const activeWeight = completedSets.length > 0 
    ? workoutSets[Math.min(completedSets.length, workoutSets.length - 1)].weight 
    : workoutSets[0].weight;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white pb-32 font-sans text-center md:text-left relative overflow-hidden">
      {showSuccess && (
        <div className="fixed inset-0 z-[300] bg-blue-600 flex items-center justify-center animate-in fade-in zoom-in duration-300">
           <div className="text-center">
              <CheckCircle2 size={120} className="text-white mx-auto mb-4" strokeWidth={3} />
              <h2 className="text-4xl font-black italic text-white tracking-tighter">IRON SAVED</h2>
           </div>
        </div>
      )}
      <header className="p-6 pt-12 flex justify-between items-center max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-black tracking-tighter italic text-blue-500">
          IRON-MIND <span className="text-white">AI</span>
        </h1>
        <div className="flex items-center gap-4 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
          <button onClick={() => cycleWeek(-1)}><ChevronLeft size={20} className="text-zinc-500" /></button>
          <span className="text-[10px] font-black uppercase tracking-widest w-16 text-center">
            {week === 4 ? 'Deload' : `Week ${week}`}
          </span>
          <button onClick={() => cycleWeek(1)}><ChevronRight size={20} className="text-zinc-500" /></button>
        </div>
      </header>

      <main className="flex-1 px-4 space-y-6 max-w-2xl mx-auto w-full">
        <VisualBarbell weight={activeWeight} />

        <div className="grid grid-cols-2 gap-3">
          {lifts.map((lift: any) => (
            <button
              key={lift.id}
              onClick={() => setSelectedLift(lift)}
              className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden ${
                selectedLift.id === lift.id 
                  ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.2)]' 
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <div className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${
                selectedLift.id === lift.id ? 'text-blue-100' : 'text-zinc-500'
              }`}>
                {lift.name}
              </div>
              <div className="text-xl font-black italic">{lift.tm}</div>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end px-1">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Main Sets</h2>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">90% TM</span>
          </div>
          
          {workoutSets.map((set, i) => (
            <div 
              key={i}
              onClick={() => toggleSet(i)}
              className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                completedSets.includes(i) 
                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' 
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`text-xs font-black w-8 ${completedSets.includes(i) ? 'text-emerald-500' : 'text-zinc-600'}`}>
                  {set.percentage}%
                </div>
                <div className="text-left">
                  <div className="text-2xl font-black italic tabular-nums">
                    {set.weight} <span className="text-sm not-italic text-zinc-500 font-bold ml-1">LBS</span>
                  </div>
                  <div className={`text-xs font-bold uppercase tracking-widest ${completedSets.includes(i) ? 'text-emerald-500/70' : 'text-zinc-500'}`}>
                    Target: {set.reps} Reps
                  </div>
                </div>
              </div>
              {completedSets.includes(i) ? (
                <div className="bg-emerald-500 rounded-full p-1">
                  <CheckCircle2 className="text-black" size={24} />
                </div>
              ) : (
                <Circle className="text-zinc-700" size={28} />
              )}
            </div>
          ))}
        </div>

        <button 
          onClick={logWorkout}
          disabled={completedSets.length === 0}
          className={`w-full font-black py-5 rounded-2xl shadow-lg italic tracking-widest transition-all mt-6 ${
            completedSets.length > 0 
              ? 'bg-blue-600 text-white shadow-blue-900/20 hover:bg-blue-500' 
              : 'bg-zinc-900 text-zinc-700 border border-zinc-800'
          }`}
        >
          LOG SESSION
        </button>
      </main>
    </div>
  );
};

export const AppContent = () => {
  const [activeTab, setActiveTab] = useState('train');
  const [lifts, setLifts] = useState(initialLiftsData);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedLift, setSelectedLift] = useState(initialLiftsData[0]);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [week, setWeek] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Persistent Storage Logic
  useEffect(() => {
    const savedLifts = localStorage.getItem('iron-mind-lifts');
    if (savedLifts) {
      const parsedLifts = JSON.parse(savedLifts);
      setLifts(parsedLifts);
      setSelectedLift(parsedLifts[0]);
    }
    
    const savedHistory = localStorage.getItem('iron-mind-history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const updateLifts = (newLifts: any[]) => {
    setLifts(newLifts);
    localStorage.setItem('iron-mind-lifts', JSON.stringify(newLifts));
  };

  const cycleWeek = (dir: number) => {
    setWeek(prev => {
      const next = prev + dir;
      if (next > 4) return 1;
      if (next < 1) return 4;
      return next;
    });
    setCompletedSets([]);
  };

  const toggleSet = (index: number) => {
    setCompletedSets(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const logWorkout = async () => {
    if (completedSets.length === 0) return;
    
    const workoutSets = calculateWorkout(selectedLift.tm, week);
    const totalVolume = completedSets.reduce((acc, idx) => acc + workoutSets[idx].weight, 0);
    const newLog = {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lift: selectedLift.name,
      sets: completedSets.length,
      volume: totalVolume.toLocaleString()
    };
    
    // Cloud Sync logic
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id !== 'demo-user') {
        await supabase.from('workouts').insert({
          user_id: user.id,
          lift_id: selectedLift.id, // mapping needed for real use
          weight_lbs: totalVolume / completedSets.length, // Avg weight for now
          reps_completed: 5,
          workout_date: new Date().toISOString()
        });
      }
    } catch (e) {
      console.error('Sync failed, falling back to local storage');
    }

    const updatedHistory = [newLog, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('iron-mind-history', JSON.stringify(updatedHistory));
    setCompletedSets([]);
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {activeTab === 'train' && (
        <TrainingView 
          lifts={lifts}
          week={week}
          cycleWeek={cycleWeek}
          selectedLift={selectedLift}
          setSelectedLift={setSelectedLift}
          completedSets={completedSets}
          toggleSet={toggleSet}
          logWorkout={logWorkout}
          showSuccess={showSuccess}
        />
      )}
      {activeTab === 'stats' && <PRTracker />}
      {activeTab === 'history' && <HistoryScreen logs={history} />}
      {activeTab === 'settings' && <SettingsScreen lifts={lifts} onUpdateLifts={updateLifts} />}
      
      <nav className="fixed bottom-0 w-full bg-black/80 backdrop-blur-2xl border-t border-zinc-800/50 px-8 py-6 pb-10 flex justify-between items-center z-50">
        <button onClick={() => setActiveTab('train')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'train' ? 'text-blue-500' : 'text-zinc-600'}`}>
          <Dumbbell size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest">Train</span>
        </button>
        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'history' ? 'text-blue-500' : 'text-zinc-600'}`}>
          <History size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest">History</span>
        </button>
        <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'stats' ? 'text-blue-500' : 'text-zinc-600'}`}>
          <TrendingUp size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest">Progress</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'settings' ? 'text-blue-500' : 'text-zinc-600'}`}>
          <SettingsIcon size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest">Settings</span>
        </button>
      </nav>
    </div>
  );
};
