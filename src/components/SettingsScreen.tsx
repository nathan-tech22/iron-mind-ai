import React, { useState, useEffect } from 'react';
import { Settings, User, Bell, Shield, LogOut, ChevronRight, Weight, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const SettingsScreen = ({ lifts, onUpdateLifts }: { lifts: any[], onUpdateLifts: (l: any[]) => void }) => {
  const [editingTM, setEditingTM] = useState(false);
  const [tempLifts, setTempLifts] = useState(lifts);
  const [authProvider, setAuthProvider] = useState<string | null>(null);

  useEffect(() => {
    setAuthProvider(localStorage.getItem('iron-mind-auth-provider'));
  }, []);
  
  const sections = [
    { icon: User, label: 'Account Type', value: authProvider ? authProvider.toUpperCase() : 'GUEST' },
    { icon: Weight, label: 'Edit Training Maxes', value: 'ACTIVE', action: () => setEditingTM(true) },
    { icon: Bell, label: 'Notifications', value: 'Enabled' },
    { icon: Shield, label: 'Privacy & Data', value: '' },
  ];

  const handleLogOut = async () => {
    localStorage.removeItem('iron-mind-guest');
    localStorage.removeItem('iron-mind-auth-provider');
    await supabase.auth.signOut();
    // Use standard window.location instead of router to force hard refresh
    window.location.href = '/';
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
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 mb-8 shadow-xl shadow-blue-900/20 text-left">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
            <User size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black italic">NATHAN KENNEDY</h2>
            <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">Founder Status</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((item, i) => (
          <button 
            key={i} 
            onClick={item.action ? item.action : () => alert(`${item.label} coming soon in Phase 2`)}
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
        <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em]">Iron-Mind AI v1.2.7</p>
      </div>
    </div>
  );
};
