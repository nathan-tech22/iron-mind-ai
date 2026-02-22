import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, UserPlus, Key } from 'lucide-react';

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

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
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      if (error) throw error;
      alert('Magic Link sent! Please check your inbox and click the link to sign in.');
    } catch (error: any) {
      console.error("Auth error:", error);
      alert(`Login failed: ${error.message || 'Please check your Supabase rate limits.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />
    </div>
  );

  if (!session) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-10">
        <h1 className="text-5xl font-black italic text-blue-500 tracking-tighter mb-2">IRON-MIND</h1>
        <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-bold italic">Unbreakable Strength</p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4 w-full max-w-xs">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <input 
            type="email" 
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-sm mb-4 outline-none focus:border-blue-500 transition-colors"
            required
          />
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-black italic tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-3"
          >
            <Key size={18} />
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
            className="w-full py-4 rounded-2xl font-bold text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            CONTINUE AS GUEST
          </button>
        </div>
      </form>
    </div>
  );

  return <>{children}</>;
};
