import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, UserPlus, Key } from 'lucide-react';

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user && session.user.id !== 'demo-user') {
        localStorage.setItem('iron-mind-auth-provider', session.user.app_metadata.provider || 'email');
      } else if (!session) {
        // If session is null (logged out), ensure guest flag is also cleared
        localStorage.removeItem('iron-mind-guest');
        localStorage.removeItem('iron-mind-auth-provider');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
          shouldCreateUser: true
        }
      });
      if (error) throw error;
      setIsSent(true);
    } catch (error: any) {
      console.error("Auth error:", error);
      alert(`Login failed: ${error.message || 'Please check your Supabase configuration.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Forging Connection...</p>
      </div>
    </div>
  );

  if (!session) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-5xl font-black italic text-blue-500 tracking-tighter mb-2">IRON-MIND</h1>
        <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-bold italic">Unbreakable Strength</p>
      </div>

      {isSent ? (
        <div className="w-full max-w-xs space-y-6 animate-in zoom-in duration-300">
          <div className="bg-zinc-900 border border-blue-500/30 rounded-[2.5rem] p-10 shadow-[0_0_40px_rgba(37,99,235,0.1)]">
            <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-900/40">
              <Key size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-black italic mb-2 tracking-tight">LINK SENT</h2>
            <p className="text-zinc-500 text-xs font-bold leading-relaxed px-2">
              We've dispatched a magic link to <span className="text-blue-400">{email}</span>. Click it to enter the vault.
            </p>
          </div>
          <button 
            onClick={() => setIsSent(false)}
            className="text-xs font-black text-zinc-600 uppercase tracking-widest hover:text-blue-500 transition-colors"
          >
            Try a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleAuth} className="space-y-4 w-full max-w-xs animate-in slide-in-from-bottom duration-500">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-xl">
            <div className="mb-6">
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Identity Verification</p>
               <input 
                type="email" 
                placeholder="EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-sm font-bold placeholder:text-zinc-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-center"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black italic tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/30"
            >
              <Key size={20} />
              SEND MAGIC LINK
            </button>
          </div>

          <div className="pt-4">
            <button 
              type="button"
              onClick={() => {
                localStorage.setItem('iron-mind-guest', 'true');
                setSession({ user: { id: 'demo-user', email: 'guest@iron-mind.ai' } });
              }}
              className="w-full py-4 rounded-2xl font-black text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-[0.2em] transition-colors"
            >
              CONTINUE AS GUEST
            </button>
          </div>
        </form>
      )}
    </div>
  );

  return <>{children}</>;
};
