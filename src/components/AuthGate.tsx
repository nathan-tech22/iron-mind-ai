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
      if (session?.user && session.user.id !== 'demo-user') {
        localStorage.setItem('iron-mind-auth-provider', session.user.app_metadata.provider || 'email');
      }
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

  const signInWithEmail = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) alert(error.message);
    else alert('Link sent! Check your inbox.');
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />
    </div>
  );

  if (!session) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-12">
        <h1 className="text-5xl font-black italic text-blue-500 tracking-tighter mb-2">IRON-MIND</h1>
        <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-bold">Forge Your Legacy</p>
      </div>

      <div className="space-y-4 w-full max-w-xs">
        {/* Magic Link Login */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-2">
          <input 
            type="email" 
            placeholder="Enter your email"
            onKeyDown={(e) => e.key === 'Enter' && signInWithEmail(e.currentTarget.value)}
            className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-sm mb-4 outline-none focus:border-blue-500 transition-colors"
          />
          <button 
            onClick={() => {
              const email = (document.querySelector('input[type="email"]') as HTMLInputElement)?.value;
              if (email) signInWithEmail(email);
            }}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-black italic tracking-widest hover:bg-blue-500 transition-all"
          >
            GET MAGIC LINK
          </button>
        </div>

        <div className="flex items-center gap-4 py-2">
          <div className="h-px bg-zinc-800 flex-1" />
          <span className="text-[10px] font-black text-zinc-600 uppercase">OR</span>
          <div className="h-px bg-zinc-800 flex-1" />
        </div>

        <button 
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black italic hover:bg-zinc-200 transition-all shadow-xl shadow-blue-500/10"
        >
          <LogIn size={20} />
          SIGN IN WITH GOOGLE
        </button>

        <button 
          onClick={() => setSession({ user: { id: 'demo-user', email: 'guest@iron-mind.ai' } })}
          className="w-full py-4 rounded-2xl font-bold text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          CONTINUE AS GUEST
        </button>
      </div>
    </div>
  );

  return <>{children}</>;
};
