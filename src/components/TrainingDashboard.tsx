import React, { useState, useEffect } from 'react';
import { VisualBarbell } from './VisualBarbell';
import { Dumbbell, History, TrendingUp, Settings as SettingsIcon, CheckCircle2, Circle, ChevronLeft, ChevronRight, Sparkles, AlertCircle, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { calculateWorkout } from '@/lib/workout-logic';
import { analyzeProgress } from '@/lib/coach-logic';
import { estimate1RM } from '@/lib/iron-logic';
import { PRTracker } from './PRTracker';
import { HistoryScreen } from './HistoryScreen';
import { SettingsScreen } from './SettingsScreen';
import { LiftFigure } from './LiftFigure';
import { SetRow } from './SetRow';

import { ironVault } from '@/lib/vault-logic';

import { Lift, WorkoutLog, DailyReadiness, Achievement } from '@/lib/types'; // Corrected import to include DailyReadiness and Achievement
import { AchievementsScreen, initialAchievements } from './AchievementsScreen';

const initialLiftsData: Lift[] = [
  { id: '1', name: 'SQUAT', tm: 315 },
  { id: '2', name: 'BENCH', tm: 225 },
  { id: '3', name: 'DEADLIFT', tm: 405 },
  { id: '4', name: 'PRESS', tm: 135 },
];

interface TrainingViewProps {
  lifts: Lift[];
  history: WorkoutLog[];
  dailyReadiness: DailyReadiness | null; // New prop
  week: number;
  cycleWeek: (dir: number) => void;
  selectedLift: Lift;
  setSelectedLift: (l: Lift) => void;
  completedSets: number[];
  toggleSet: (i: number) => void;
  logWorkout: () => void;
  showSuccess: boolean;
  showPR: boolean;
  onResetTM: (name: string, tm: number) => void;
  restTimer: number | null;
  rpeValues: (number | null)[];
  onRPEChange: (index: number, rpe: number) => void;
}

const TrainingView = ({
  lifts,
  history,
  week,
  cycleWeek,
  selectedLift,
  setSelectedLift,
  completedSets,
  toggleSet,
  logWorkout,
  showSuccess,
  showPR,
  onResetTM,
  restTimer,
  rpeValues,
  onRPEChange,
  dailyReadiness // New prop
}: TrainingViewProps) => {
  const [tmSetting, setTmSetting] = useState(90); // Default 90%
  const workoutSets = calculateWorkout(selectedLift.tm, week, tmSetting);
  const activeWeight = completedSets.length > 0
    ? workoutSets[Math.min(completedSets.length, workoutSets.length - 1)].weight
    : workoutSets[0].weight;

  // Multi-cycle trend engine visualization
  const getCycleTrend = (liftName: string) => {
    const logs = history.filter(h => h.lift?.toUpperCase() === liftName.toUpperCase());
    if (logs.length < 5) return null;

    const currentVol = parseFloat(String(logs[0].volume).replace(/,/g, ''));
    const currentSets = parseInt(String(logs[0].sets)) || 1;
    const prevVol = parseFloat(String(logs[4].volume).replace(/,/g, ''));
    const prevSets = parseInt(String(logs[4].sets)) || 1;

    const current = estimate1RM.epley(currentVol / currentSets, 5);
    const prev = estimate1RM.epley(prevVol / prevSets, 5);
    const diff = current - prev;
    return { pct: ((diff / prev) * 100).toFixed(1), up: diff >= 0 };
  };

  const insights = analyzeProgress(history, lifts, dailyReadiness); // Pass dailyReadiness
  const activeInsight = insights.find((i: any) => i.lift === selectedLift.name || i.lift === 'GENERAL'); // Include 'GENERAL' insights

  // Get current PR for the selected lift
  const currentPR = history
    .filter((h: any) => h.lift?.toUpperCase() === selectedLift.name?.toUpperCase())
    .reduce((max: number, h: any) => {
      const est = estimate1RM.epley(parseFloat(String(h.volume).replace(/,/g, '')) / (parseInt(String(h.sets)) || 1), 5);
      return est > max ? est : max;
    }, 0);

  // Recovery readiness logic
  const getReadiness = (liftName: string) => {
    const liftLogs = history.filter((h: any) => h.lift?.toUpperCase() === liftName.toUpperCase());
    if (liftLogs.length === 0) return 100;

    const lastDate = new Date(liftLogs[0].date);
    const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

    // Simple recovery model: 0-24h (20%), 24-48h (60%), 48h+ (100%)
    if (diffDays === 0) return 20;
    if (diffDays === 1) return 60;
    return 100;
  };

  const isHighIntensity = currentPR > 0 && activeWeight / currentPR >= 0.85;

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-1000 pb-32 font-sans text-center md:text-left relative overflow-hidden ${
      isHighIntensity ? 'bg-[#050505]' : 'bg-black'
    }`}>
      {isHighIntensity && (
        <div className="absolute inset-0 bg-blue-900/5 animate-pulse pointer-events-none" />
      )}
      {showSuccess && (
        <div className="fixed inset-0 z-[300] bg-blue-600 flex items-center justify-center animate-in fade-in zoom-in duration-300">
           <div className="text-center">
              {showPR ? (
                <Sparkles size={120} className="text-white mx-auto mb-4 animate-bounce" strokeWidth={3} />
              ) : (
                <CheckCircle2 size={120} className="text-white mx-auto mb-4" strokeWidth={3} />
              )}
              <h2 className="text-4xl font-black italic text-white tracking-tighter">
                {showPR ? 'NEW RECORD' : 'IRON SAVED'}
              </h2>
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
        <VisualBarbell weight={activeWeight} pr={currentPR} />

        {activeInsight && (
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-4 flex items-start gap-4 text-left animate-in slide-in-from-top duration-500 relative overflow-hidden group">
            <div className="bg-blue-600 p-2 rounded-xl mt-1">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 italic">AI Coaching Intel</div>
              <p className="text-sm font-bold text-zinc-200 leading-tight">{activeInsight.message}</p>

              {activeInsight.actionable && activeInsight.actionType === 'RESET_TM' && (
                <button
                  onClick={() => onResetTM(activeInsight.lift, activeInsight.suggestedTM)}
                  className="mt-3 bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
                >
                  Apply {activeInsight.suggestedTM}lb Reset
                </button>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {lifts.map((lift: any) => {
            const readiness = getReadiness(lift.name);
            const trend = getCycleTrend(lift.name);
            return (
              <button
                key={lift.id}
                onClick={() => setSelectedLift(lift)}
                className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden group ${
                  selectedLift.id === lift.id
                    ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                {/* Readiness Glow */}
                <div
                  className={`absolute bottom-0 left-0 h-1 transition-all duration-1000 ${
                    readiness < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${readiness}%`, opacity: selectedLift.id === lift.id ? 1 : 0.3 }}
                />

                <div className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${
                  selectedLift.id === lift.id ? 'text-blue-100' : 'text-zinc-500'
                }`}>
                  {lift.name}
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <div className="text-xl font-black italic">{lift.tm}</div>
                    {trend && (
                      <div className={`text-[8px] font-black italic ${trend.up ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {trend.up ? '+' : ''}{trend.pct}% CoC
                      </div>
                    )}
                  </div>
                  <LiftFigure name={lift.name} active={selectedLift.id === lift.id} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end px-1">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Main Sets</h2>
            <button
              onClick={() => setTmSetting(prev => prev === 90 ? 85 : 90)}
              className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors"
            >
              {tmSetting}% TM
            </button>
          </div>

          {workoutSets.map((set, i) => (
            <SetRow
              key={i}
              set={set}
              index={i}
              completedSets={completedSets}
              toggleSet={toggleSet}
              rpeValue={rpeValues[i] || null}
              onRPEChange={onRPEChange}
              percentage={(set.weight / selectedLift.tm) * 100} // Pass percentage
            />
          ))}
        </div>

        <button
          onClick={logWorkout}
          disabled={completedSets.length === 0}
          className={`w-full font-black py-5 rounded-2xl shadow-lg italic tracking-widest transition-all mt-6 ${
            completedSets.length > 0
              ? 'bg-blue-600 text-white shadow-blue-900/30 hover:bg-blue-500'
              : 'bg-zinc-900 text-zinc-700 border border-zinc-800 opacity-50'
          }`}
        >
          LOG SESSION
        </button>
      </main>
    </div>
  );
};

export const AppContent = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [activeTab, setActiveTab] = useState('train');
  const [lifts, setLifts] = useState(initialLiftsData);
  const [history, setHistory] = useState<WorkoutLog[]>([]);
  const [selectedLift, setSelectedLift] = useState(initialLiftsData[0]);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [week, setWeek] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPR, setShowPR] = useState(false);
  const [showAMRAPModal, setShowAMRAPModal] = useState(false);
  const [amrapInput, setAmrapInput] = useState('');
  const [amrapContext, setAmrapContext] = useState<{ weight: number, totalVolume: number } | null>(null);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [rpeValues, setRpeValues] = useState<(number | null)[]>([]);
  const [showReadinessModal, setShowReadinessModal] = useState(false);
  const [readinessData, setReadinessData] = useState<DailyReadiness>({
    sleep_quality: null,
    stress_level: null,
    fatigue_level: null,
    overall_score: null,
    date: new Date().toISOString().split('T')[0], // Initialize with today's date
  });

  const handleRPEChange = (index: number, rpe: number) => {
    setRpeValues(prev => {
      const newRPEs = [...prev];
      newRPEs[index] = rpe;
      return newRPEs;
    });
  };

  const handleReadinessChange = (key: 'sleep_quality' | 'stress_level' | 'fatigue_level', value: number) => {
    setReadinessData(prev => {
      const newData = { ...prev, [key]: value };
      const total = (newData.sleep_quality || 0) + (newData.stress_level || 0) + (newData.fatigue_level || 0);
      const count = (newData.sleep_quality ? 1 : 0) + (newData.stress_level ? 1 : 0) + (newData.fatigue_level ? 1 : 0);
      return { ...newData, overall_score: count > 0 ? Math.round(total / count) : null };
    });
  };

  const handleSubmitReadiness = async () => {
    const today = new Date().toLocaleDateString();
    // Save to Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id !== 'demo-user') {
        const { error } = await supabase.from('daily_readiness').insert({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
          sleep_quality: readinessData.sleep_quality,
          stress_level: readinessData.stress_level,
          fatigue_level: readinessData.fatigue_level,
          overall_score: readinessData.overall_score,
        });
        if (error) throw error;
      }
    } catch (e) {
      console.error('Supabase readiness sync failed:', e);
    }

    // Save to localStorage (always, for quick check and fallback)
    localStorage.setItem('iron-mind-last-readiness-date', today);
    localStorage.setItem('iron-mind-readiness-data', JSON.stringify(readinessData));
    
    console.log('Submitting Readiness:', readinessData);
    setShowReadinessModal(false);
  };

  const checkAndAwardAchievement = async (userId: string, achievementId: string) => {
    const achievement = initialAchievements.find(a => a.id === achievementId);
    if (!achievement) return;

    // Check if already earned
    const { data: existingAchievement, error: fetchError } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means 'no rows found'
      console.error(`Error checking achievement ${achievementId}:`, fetchError);
      return;
    }

    if (!existingAchievement) {
      // Award achievement
      const { error: insertError } = await supabase.from('user_achievements').insert({
        user_id: userId,
        achievement_id: achievementId,
        earned_date: new Date().toISOString(),
      });

      if (insertError) {
        console.error(`Error awarding achievement ${achievementId}:`, insertError);
        return;
      }

      setAchievements(prev => prev.map(ach =>
        ach.id === achievementId ? { ...ach, earned: true, earned_date: new Date().toISOString() } : ach
      ));
      console.log(`Achievement Earned: ${achievement.name}`);
      // TODO: Potentially add a toast notification for earned achievements
    }
  };

  const handleSkipReadiness = () => {
    // TODO: Implement logic for skipping readiness (e.g., store a "skipped" flag for today)
    console.log('Skipping Readiness for today.');
    setShowReadinessModal(false);
  };

  // Rest Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (restTimer !== null) {
      interval = setInterval(() => {
        setRestTimer(prev => (prev !== null && prev > 0 ? prev - 1 : null));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restTimer]);

  const ReadinessCheckModal = ({
    readinessData,
    onReadinessChange,
    onSubmit,
    onSkip
  }: {
    readinessData: DailyReadiness;
    onReadinessChange: (key: 'sleep_quality' | 'stress_level' | 'fatigue_level', value: number) => void;
    onSubmit: () => void;
    onSkip: () => void;
  }) => {
    const InputRow = ({ label, value, onChange }: {
      label: string;
      value: number | null;
      onChange: (v: number) => void;
    }) => (
      <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-xl">
        <label className="text-sm font-medium text-zinc-300">{label}</label>
        <input
          type="number"
          min="1"
          max="5"
          value={value === null ? '' : value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="w-16 bg-zinc-700 text-white text-center rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="-"
        />
      </div>
    );

    return (
      <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6">
          <div className="text-center mb-6">
            <Sparkles size={40} className="text-blue-500 mx-auto mb-3" />
            <h2 className="text-2xl font-black italic tracking-tight text-white">Daily Readiness</h2>
            <p className="text-zinc-500 text-sm mt-1">How are you feeling today?</p>
          </div>

          <InputRow
            label="Sleep Quality (1-5)"
            value={readinessData.sleep_quality}
            onChange={(v) => onReadinessChange('sleep_quality', v)}
          />
          <InputRow
            label="Stress Level (1-5)"
            value={readinessData.stress_level}
            onChange={(v) => onReadinessChange('stress_level', v)}
          />
          <InputRow
            label="Fatigue Level (1-5)"
            value={readinessData.fatigue_level}
            onChange={(v) => onReadinessChange('fatigue_level', v)}
          />

          <div className="pt-4 text-center">
            <div className="text-zinc-400 text-sm font-medium mb-2">Overall Readiness Score:</div>
            <div className="text-5xl font-black italic text-blue-500">
              {readinessData.overall_score === null ? '-' : readinessData.overall_score}
            </div>
          </div>

          <button
            onClick={onSubmit}
            disabled={readinessData.overall_score === null}
            className={`w-full py-4 rounded-xl font-black italic tracking-widest transition-colors ${
              readinessData.overall_score !== null ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
            }`}
          >
            SUBMIT READINESS
          </button>
          <button
            onClick={onSkip}
            className="w-full py-2 text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400"
          >
            SKIP FOR NOW
          </button>
        </div>
      </div>
    );
  };

  // Load History and Lifts
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user && user.id !== 'demo-user') {
          // 1. Fetch Lifts
          const { data: liftData, error: liftError } = await supabase
            .from('lifts')
            .select('*')
            .eq('user_id', user.id);

          if (liftError) throw liftError;

          if (liftData && liftData.length > 0) {
            const mappedLifts = liftData.map(l => ({
              id: l.id,
              name: l.name.toUpperCase(),
              tm: Math.round(l.training_max)
            }));
            setLifts(mappedLifts);
            setSelectedLift(mappedLifts[0]);
          }

          // 2. Fetch History
          const { data: historyData, error: historyError } = await supabase
            .from('workouts')
            .select('*, lifts(name)')
            .eq('user_id', user.id)
            .order('workout_date', { ascending: false });

          if (historyError) throw historyError;

          if (historyData && historyData.length > 0) {
            const mappedHistory = historyData.map(w => ({
              date: new Date(w.workout_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              lift: w.lifts.name.toUpperCase(),
              sets: 1, // Database stores individual sets usually, UI currently groups
              volume: (w.weight_used * w.reps_completed).toLocaleString(),
              // rpe is not currently in the history fetch, need to add if exists
            }));
            setHistory(mappedHistory);

            // Check 'First Iron Forged' and 'Consistent Crusher' on load for logged-in users
            if (user) {
              if (mappedHistory.length >= 1) {
                checkAndAwardAchievement(user.id, 'first_workout');
              }
              if (mappedHistory.length >= 5) {
                checkAndAwardAchievement(user.id, 'five_workouts');
              }
            }
          }

          // 3. Fetch Daily Readiness for logged-in user

              // 4. Fetch User Achievements
              const { data: userAchievementsData, error: achievementsError } = await supabase
                .from('user_achievements')
                .select('*')
                .eq('user_id', user.id);

              if (achievementsError) throw achievementsError;

              if (userAchievementsData && userAchievementsData.length > 0) {
                const earnedAchievementIds = new Set(userAchievementsData.map(ua => ua.achievement_id));
                setAchievements(prev => prev.map(ach => ({
                  ...ach,
                  earned: earnedAchievementIds.has(ach.id),
                  earned_date: userAchievementsData.find(ua => ua.achievement_id === ach.id)?.earned_date || ach.earned_date
                })));
              }
          const todayDateString = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
          const { data: readinessEntry, error: readinessError } = await supabase
            .from('daily_readiness')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', todayDateString)
            .single();
          
          if (readinessError && readinessError.code !== 'PGRST116') throw readinessError; // PGRST116 is 'no rows found'

          if (readinessEntry) {
            setReadinessData({
              sleep_quality: readinessEntry.sleep_quality,
              stress_level: readinessEntry.stress_level,
              fatigue_level: readinessEntry.fatigue_level,
              overall_score: readinessEntry.overall_score,
              date: readinessEntry.date,
            });
            setShowReadinessModal(false);
          } else {
            // If no Supabase entry for today, check local storage as a fallback to trigger modal
            const lastReadinessDate = localStorage.getItem('iron-mind-last-readiness-date');
            if (lastReadinessDate !== new Date().toLocaleDateString()) {
              setShowReadinessModal(true);
            }
            const localReadinessData = localStorage.getItem('iron-mind-readiness-data');
            if (localReadinessData) {
              const parsedLocal = JSON.parse(localReadinessData);
              setReadinessData(prev => ({
                ...prev,
                sleep_quality: parsedLocal.sleepQuality, // map camelCase from old local storage to snake_case
                stress_level: parsedLocal.stressLevel,
                fatigue_level: parsedLocal.fatigueLevel,
                overall_score: parsedLocal.overallScore,
              }));
            }
          }
        } else {
          // Local Fallback (for non-logged-in users)
          const savedLifts = localStorage.getItem('iron-mind-lifts');
          if (savedLifts) {
            const parsedLifts = JSON.parse(savedLifts);
            setLifts(parsedLifts);
            setSelectedLift(parsedLifts[0]);
          }
          const savedHistory = localStorage.getItem('iron-mind-history');
          if (savedHistory) setHistory(JSON.parse(savedHistory));

          // Check local storage for readiness for local fallback users
          const today = new Date().toLocaleDateString();
          const lastReadinessDate = localStorage.getItem('iron-mind-last-readiness-date');
          if (lastReadinessDate !== today) {
            setShowReadinessModal(true);
            const localReadinessData = localStorage.getItem('iron-mind-readiness-data');
            if (localReadinessData) {
              const parsedLocal = JSON.parse(localReadinessData);
              setReadinessData(prev => ({
                ...prev,
                sleep_quality: parsedLocal.sleepQuality, // map camelCase from old local storage to snake_case
                stress_level: parsedLocal.stressLevel,
                fatigue_level: parsedLocal.fatigueLevel,
                overall_score: parsedLocal.overallScore,
              }));
            }
          }
        }
      } catch (err) {
        console.error('Data initialization failed:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();

    // Trigger background vault sync
    ironVault.sync();
  }, []);

  // Auto-advance logic
  useEffect(() => {
    const advanceCycle = async () => {
      if (showSuccess && week === 4) {
        const shouldAdvance = window.confirm("Cycle Complete! Advance Training Maxes?");
        if (shouldAdvance) {
          const nextLifts = lifts.map(l => ({
            ...l,
            tm: l.tm + (l.name === 'SQUAT' || l.name === 'DEADLIFT' ? 10 : 5)
          }));

          setLifts(nextLifts);
          localStorage.setItem('iron-mind-lifts', JSON.stringify(nextLifts));

          // Supabase Update
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && user.id !== 'demo-user') {
              // Update all lifts in a single push to avoid race conditions
              const updates = nextLifts.map(lift => ({
                id: lift.id,
                user_id: user.id,
                name: lift.name.toLowerCase(),
                true_1rm: lift.tm / 0.9,
                training_max_pct: 0.9
              }));

              const { error } = await supabase
                .from('lifts')
                .upsert(updates, { onConflict: 'id' });

              if (error) throw error;
            }
          } catch (e) {
            console.error('Supabase TM Update Failed:', e);
          }

          setWeek(1);
          alert("Training Maxes increased. Time to eat.");
        }
      }
    };

    advanceCycle();
  }, [showSuccess, week, lifts]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setShowPR(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const updateLifts = (newLifts: Lift[]) => {
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
    // Scroll to top on week change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSet = (index: number) => {
    setCompletedSets(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleResetTM = async (liftName: string, newTM: number) => {
    if (!window.confirm(`Apply adaptive reset to ${liftName} (${newTM} lbs)?`)) return;

    const nextLifts = lifts.map((l: any) =>
      l.name.toUpperCase() === liftName.toUpperCase() ? { ...l, tm: newTM } : l
    );

    setLifts(nextLifts);
    localStorage.setItem('iron-mind-lifts', JSON.stringify(nextLifts));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id !== 'demo-user') {
        const liftToUpdate = nextLifts.find((l: any) => l.name.toUpperCase() === liftName.toUpperCase());
        await supabase.from('lifts').update({ true_1rm: newTM / 0.9 }).eq('id', liftToUpdate.id);
      }
      alert('Training Max adjusted. The engine has adapted.');
    } catch (e) {
      console.error('Failed to sync adaptive reset');
    }
  };

  const logWorkout = async () => {
    if (completedSets.length === 0) return;

    const workoutSets = calculateWorkout(selectedLift.tm, week);
    const totalVolume = completedSets.reduce((acc, idx) => acc + workoutSets[idx].weight, 0);

    const lastSetIdx = completedSets[completedSets.length - 1];
    const targetRepsStr = workoutSets[lastSetIdx].reps;
    const weightUsed = workoutSets[lastSetIdx].weight;

    if (targetRepsStr.includes('+')) {
      setAmrapContext({ weight: weightUsed, totalVolume });
      setAmrapInput(targetRepsStr.replace('+', ''));
      setShowAMRAPModal(true);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    submitWorkout(parseInt(targetRepsStr), weightUsed, totalVolume, user);
  };

  const submitWorkout = async (actualReps: number, weightUsed: number, totalVolume: number, user: User | null) => {
    const lastSetRPE = rpeValues[completedSets[completedSets.length - 1]];

    const newLog: WorkoutLog = {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lift: selectedLift.name,
      sets: completedSets.length,
      volume: totalVolume.toLocaleString(),
      rpe: lastSetRPE,
    };

    // Live Supabase Sync
    try {
      if (user && user.id !== 'demo-user') {
        const { error } = await supabase.from('workouts').insert({
          user_id: user.id,
          lift_id: selectedLift.id,
          weight_used: weightUsed,
          reps_completed: actualReps,
          workout_date: new Date().toISOString(),
          rpe: lastSetRPE,
        });

        if (error) {
          ironVault.queueWorkout({
            lift_id: selectedLift.id,
            weight_used: weightUsed,
            reps_completed: actualReps
          });
        } else {
          ironVault.sync();

          // Achievement Checks (only if Supabase sync is successful for logged-in users)
          checkAndAwardAchievement(user.id, 'first_workout');

          const { count: workoutCount, error: countError } = await supabase
            .from('workouts')
            .select('id', { count: 'exact' })
            .eq('user_id', user.id);
          
          if (!countError && workoutCount && workoutCount >= 5) {
            checkAndAwardAchievement(user.id, 'five_workouts');
          }
        }
      }
    } catch (e) {
      console.error('Supabase Sync Failed:', e);
      ironVault.queueWorkout({
        lift_id: selectedLift.id,
        weight_used: weightUsed,
        reps_completed: actualReps
      });
    }

    // Local UI and state updates (always execute regardless of Supabase sync success)
    const updatedHistory = [newLog, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('iron-mind-history', JSON.stringify(updatedHistory));
    setCompletedSets([]);
    setShowSuccess(true);
    setShowAMRAPModal(false);

    // PR Celebration Logic (always execute after local state update)
    const previousBest = history
      .filter((h: any) => h.lift?.toUpperCase() === selectedLift.name?.toUpperCase())
      .reduce((max: number, h: any) => {
        const vol = parseFloat(String(h.volume).replace(/,/g, ''));
        const sets = parseInt(String(h.sets)) || 1;
        const est = estimate1RM.epley(vol / sets, 5);
        return est > max ? est : max;
      }, 0);

    const currentEst = estimate1RM.epley(weightUsed, actualReps);

    if (currentEst > previousBest && history.length > 0) {
      setShowPR(true);
      if (user) {
        checkAndAwardAchievement(user.id, 'new_pr');
      }
      setTimeout(() => {
        try {
          const confetti = require('canvas-confetti').default;
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#2563eb', '#ffffff', '#60a5fa']
          });
        } catch (e) {
          console.warn('Confetti failed');
        }
      }, 300);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Synchronizing Iron...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {activeTab === 'train' && (
        <TrainingView
          lifts={lifts}
          history={history}
          dailyReadiness={readinessData} // Pass readinessData
          week={week}
          cycleWeek={cycleWeek}
          selectedLift={selectedLift}
          setSelectedLift={setSelectedLift}
          completedSets={completedSets}
          toggleSet={toggleSet}
          logWorkout={logWorkout}
          showSuccess={showSuccess}
          showPR={showPR}
          onResetTM={handleResetTM}
          restTimer={restTimer}
          rpeValues={rpeValues}
          onRPEChange={handleRPEChange}
        />
      )}
      {activeTab === 'stats' && <PRTracker />}
      {activeTab === 'history' && <HistoryScreen logs={history} />}
      {activeTab === 'settings' && <SettingsScreen lifts={lifts} onUpdateLifts={updateLifts} history={history} />}
      {activeTab === 'achievements' && <AchievementsScreen achievements={achievements} />}

      {showReadinessModal && (
        <ReadinessCheckModal
          readinessData={readinessData}
          onReadinessChange={handleReadinessChange}
          onSubmit={handleSubmitReadiness}
          onSkip={handleSkipReadiness}
        />
      )}

      {/* High-Fidelity AMRAP Modal */}
      {showAMRAPModal && (
        <div className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-xs bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl">
            <div className="mb-8 text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-900/40">
                <Dumbbell size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-black italic tracking-tight mb-2">AMRAP SET</h2>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed px-4">
                Enter your total completed reps for the top set
              </p>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <input
                  type="number"
                  value={amrapInput}
                  onChange={(e) => setAmrapInput(e.target.value)}
                  autoFocus
                  className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-5xl font-black italic text-center text-blue-500 outline-none focus:border-blue-500 transition-all tabular-nums"
                  placeholder="0"
                />
              </div>

              <button
                onClick={async () => {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (amrapContext) {
                    submitWorkout(parseInt(amrapInput || '0'), amrapContext.weight, amrapContext.totalVolume, user);
                  }
                }}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black italic tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/30"
              >
                SAVE PERFORMANCE
              </button>

              <button
                onClick={() => setShowAMRAPModal(false)}
                className="w-full py-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-zinc-400"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 w-full bg-black/80 backdrop-blur-2xl border-t border-zinc-800/50 px-8 py-6 pb-10 flex justify-between items-center z-50">
        <button onClick={() => setActiveTab('train')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'train' ? 'text-blue-500' : 'text-zinc-600'}`}>
          <Dumbbell size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest text-inherit">Train</span>
        </button>
        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'history' ? 'text-blue-500' : 'text-zinc-600'}`}>
          <History size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest text-inherit">History</span>
        </button>
        <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'stats' ? 'text-blue-500' : 'text-zinc-600'}`}>
          <TrendingUp size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest text-inherit">Progress</span>
        </button>
        <button onClick={() => setActiveTab('achievements')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'achievements' ? 'text-blue-500' : 'text-zinc-600'}`}>
          <Award size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest text-inherit">Achievements</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'settings' ? 'text-blue-500' : 'text-zinc-600'}`}>
          <SettingsIcon size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest text-inherit">Settings</span>
        </button>
      </nav>
    </div>
  );
};
