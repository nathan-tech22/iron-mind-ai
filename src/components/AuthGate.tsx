import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn } from 'lucide-react';

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />
    </div>
  );

  if (!session) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-black italic text-blue-500 mb-2">IRON-MIND</h1>
      <p className="text-zinc-500 mb-8 uppercase tracking-widest text-xs font-bold">Forge Your Legacy</p>
      <div className="space-y-4 w-full max-w-xs">
        <button 
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black italic hover:bg-zinc-200 transition-all shadow-xl shadow-blue-500/10"
        >
          <LogIn size={20} />
          SIGN IN WITH GOOGLE
        </button>
        <button 
          onClick={() => setSession({ user: { id: 'demo-user' } })}
          className="w-full py-4 rounded-2xl font-bold text-zinc-500 hover:text-white transition-colors border border-zinc-900"
        >
          CONTINUE AS GUEST
        </button>
      </div>
    </div>
  );

  return <>{children}</>;
};
