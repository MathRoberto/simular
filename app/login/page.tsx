"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Erro: " + error.message);
    else router.push('/');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#0a0a0c] border border-purple-900/20 p-12 rounded-[3rem] shadow-2xl">
        <h1 className="text-2xl font-black text-white italic text-center mb-8 uppercase tracking-widest">Acesso Restrito</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-purple-500 text-white" />
          <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-purple-500 text-white" />
          <button disabled={loading} className="w-full bg-purple-600 p-5 rounded-2xl font-black text-white uppercase tracking-widest hover:bg-purple-500 transition-all">
            {loading ? 'Validando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}