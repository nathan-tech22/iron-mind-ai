import React, { useState, useEffect } from 'react';
import { Settings, User, Bell, Shield, LogOut, ChevronRight, Weight, X, Camera, Palette, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const SettingsScreen = ({ lifts, onUpdateLifts, history = [] }: { lifts: any[], onUpdateLifts: (l: any[]) => void, history?: any[] }) => {
  const [editingTM, setEditingTM] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [tempLifts, setTempLifts] = useState(lifts);
  const [authProvider, setAuthProvider] = useState<string | null>(null);
  
  // Profile state
  const [profile, setProfile] = useState({
    name: 'NATHAN KENNEDY',
    handle: '@NATHAN',
    theme: 'FOUNDER BLACK',
    units: 'LBS (IMPERIAL)'
  });

  useEffect(() => {
    setAuthProvider(localStorage.getItem('iron-mind-auth-provider'));
    const savedProfile = localStorage.getItem('iron-mind-profile');
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, []);
  
  const sections = [
    { icon: User, label: 'Profile Detail', value: profile.handle, action: () => setEditingProfile(true) },
    { icon: Weight, label: 'Edit Training Maxes', value: 'ACTIVE', action: () => setEditingTM(true) },
    { icon: Palette, label: 'Visual Theme', value: profile.theme },
    { icon: Globe, label: 'Unit System', value: profile.units },
    { icon: Bell, label: 'Notifications', value: 'Enabled' },
    { icon: Shield, label: 'Privacy & Data', value: '' },
  ];

  const handleLogOut = async () => {
    localStorage.clear(); // Clear ALL local storage
    await supabase.auth.signOut();
    window.document.location.replace('/'); // Force hard redirect
  };

  const saveProfile = (newProfile: any) => {
    setProfile(newProfile);
    localStorage.setItem('iron-mind-profile', JSON.stringify(newProfile));
    setEditingProfile(false);
  };

  const MuscleSkeleton = ({ history }: { history: any[] }) => {
    // Basic volume aggregation by category
    const getMuscleSaturation = (category: string) => {
      const mappings: Record<string, string[]> = {
        'LEGS': ['SQUAT', 'DEADLIFT'],
        'CHEST': ['BENCH'],
        'BACK': ['DEADLIFT'],
        'SHOULDERS': ['PRESS']
      };
      
      const relatedLifts = mappings[category] || [];
      const logs = history.filter(h => relatedLifts.includes(h.lift?.toUpperCase()));
      return Math.min(logs.length * 15, 100); // 15% saturation per session
    };

    const categories = [
      { name: 'LEGS', sat: getMuscleSaturation('LEGS') },
      { name: 'CHEST', sat: getMuscleSaturation('CHEST') },
      { name: 'BACK', sat: getMuscleSaturation('BACK') },
      { name: 'SHOULDERS', sat: getMuscleSaturation('SHOULDERS') },
    ];

    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Iron Skeleton • Saturation</h3>
           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          {categories.map(c => (
            <div key={c.name} className="space-y-2">
              <div className="flex justify-between items-end px-1">
                <span className="text-[9px] font-black text-zinc-600 tracking-widest">{c.name}</span>
                <span className="text-[10px] font-black italic text-blue-500">{c.sat}%</span>
              </div>
              <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-1000" 
                  style={{ width: `${c.sat}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white p-6 pb-32">
      <header className="mb-10 pt-6 text-left">
        <h1 className="text-3xl font-black tracking-tighter italic text-blue-500 flex items-center gap-3">
          <Settings size={32} />
          SYSTEM <span className="text-white">PREFS</span>
        </h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2 px-1">Configure Your Experience</p>
      </header>

      {/* Profile Summary Card */}
      <button 
        onClick={() => setEditingProfile(true)}
        className="w-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 mb-8 shadow-xl shadow-blue-900/20 text-left relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
           <Camera size={80} />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm shadow-inner">
            <User size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black italic tracking-tight">{profile.name}</h2>
            <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">Founder Status • {profile.handle}</p>
          </div>
        </div>
      </button>

      <MuscleSkeleton history={history} />

      <div className="space-y-3">
        {sections.map((item, i) => (
          <button 
            key={i} 
            onClick={item.action ? item.action : () => alert(`${item.label} modification coming soon`)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between hover:bg-zinc-800 transition-all group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="bg-zinc-800 p-2 rounded-xl group-hover:bg-zinc-700 transition-colors">
                <item.icon size={20} className="text-zinc-400" />
              </div>
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              {item.value && <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{item.value}</span>}
              <ChevronRight size={18} className="text-zinc-700" />
            </div>
          </button>
        ))}
      </div>

      {/* Profile Editor Modal */}
      {editingProfile && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl p-6 flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-center mb-10 pt-4">
            <h2 className="text-2xl font-black italic italic-black tracking-tight">IDENTITY VAULT</h2>
            <button onClick={() => setEditingProfile(false)} className="p-2 bg-zinc-900 rounded-full text-zinc-400">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 space-y-8 overflow-y-auto px-1">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Display Name</label>
              <input 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value.toUpperCase()})}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-xl font-black italic outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Founder Handle</label>
              <input 
                value={profile.handle}
                onChange={(e) => setProfile({...profile, handle: e.target.value.toUpperCase()})}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-xl font-black italic outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Units</label>
                <select 
                  value={profile.units}
                  onChange={(e) => setProfile({...profile, units: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-sm font-black italic outline-none"
                >
                  <option>LBS (IMPERIAL)</option>
                  <option>KG (METRIC)</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Vibe</label>
                <select 
                  value={profile.theme}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-sm font-black italic outline-none"
                >
                  <option>FOUNDER BLACK</option>
                  <option>IRON NEON</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            onClick={() => saveProfile(profile)}
            className="mt-10 w-full bg-blue-600 text-white font-black py-5 rounded-3xl shadow-lg shadow-blue-900/40 tracking-widest italic"
          >
            UPDATE IDENTITY
          </button>
        </div>
      )}

      {editingTM && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black italic italic-black">EDIT MAXES</h2>
            <button onClick={() => setEditingTM(false)} className="p-2 bg-zinc-900 rounded-full">
              <X size={24} />
            </button>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto">
            {tempLifts.map((lift, i) => (
              <div key={lift.name} className="space-y-2 text-left">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{lift.name}</label>
                <input 
                  type="number" 
                  value={lift.tm}
                  onChange={(e) => {
                    const next = [...tempLifts];
                    next[i].tm = parseInt(e.target.value) || 0;
                    setTempLifts(next);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-2xl font-black italic outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            ))}
          </div>
          <button 
            onClick={() => {
              onUpdateLifts(tempLifts);
              setEditingTM(false);
            }}
            className="mt-6 w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-900/40"
          >
            SAVE CHANGES
          </button>
        </div>
      )}

      <button onClick={handleLogOut} className="mt-12 w-full bg-zinc-900/50 border border-red-900/20 rounded-2xl p-5 flex items-center justify-center gap-3 text-red-500 font-black italic hover:bg-red-500/10 transition-all">
        <LogOut size={20} />
        LOG OUT
      </button>

      <div className="mt-8 text-center pb-12">
        <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em]">Iron-Mind AI v1.5.5</p>
      </div>
    </div>
  );
};
