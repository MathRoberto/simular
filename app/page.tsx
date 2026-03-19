"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { calcularTemposJF } from '@/lib/api-rotas';
import TabCadastro from '@/components/TabCadastro';
import TabListaComparacao from '@/components/TabListaComparacao';

export default function SimularDashboard() {
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState<'lista' | 'cadastro'>('lista');
  const [imoveisSalvos, setImoveisSalvos] = useState<any[]>([]);
  const [salario, setSalario] = useState(0);
  const [totalGastosFixos, setTotalGastosFixos] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [mostrarSobra, setMostrarSobra] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');
      await carregarDados();
      setCarregando(false);
    };
    init();
  }, []);

  const carregarDados = async () => {
    const { data: imov } = await supabase.from('imoveis').select('*').order('created_at', { ascending: false });
    setImoveisSalvos(imov || []);
    const { data: cfg } = await supabase.from('configuracoes').select('salario').single();
    setSalario(cfg?.salario || 0);
    const { data: gst } = await supabase.from('gastos_fixos').select('valor');
    setTotalGastosFixos(gst?.reduce((acc, c) => acc + Number(c.valor), 0) || 0);
  };

  const handleSalvar = async (dados: any) => {
    setCarregando(true);
    const t = await calcularTemposJF(dados.endereco);
    const payload = { 
      ...dados, 
      tempo_trabalho_carro: t?.tempoTrabCarro, 
      tempo_trabalho_ape: t?.tempoTrabApe,
      tempo_casa_carro: t?.tempoPaiCarro,
      tempo_casa_ape: t?.tempoPaiApe 
    };
    await supabase.from('imoveis').insert([payload]);
    await carregarDados();
    setAbaAtiva('lista');
    setCarregando(false);
  };

  if (carregando) return <div className="min-h-screen bg-[#0d0d12] flex items-center justify-center text-purple-500 font-black italic animate-pulse">🌌 SINCRONIZANDO COCKPIT...</div>;

  return (
    <div className="min-h-screen bg-[#0d0d12] relative text-neutral-200 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[5%] right-[-5%] w-[40%] h-[60%] bg-fuchsia-900/5 blur-[100px] rounded-full" />
      </div>

      <header className="p-6 border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest italic">Sobra Estimada</span>
          <div className="flex items-center gap-3">
            <span className={`font-mono font-bold text-emerald-400 ${!mostrarSobra && 'blur-sm select-none'}`}>
              R$ {(salario - totalGastosFixos).toFixed(2)}
            </span>
            <button onClick={() => setMostrarSobra(!mostrarSobra)} className="text-xs">{mostrarSobra ? '🔓' : '🔒'}</button>
          </div>
        </div>
        <button onClick={() => setAbaAtiva('cadastro')} className="bg-purple-600 px-6 py-2 rounded-full font-black text-[10px] uppercase italic tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 transition-all">＋ Novo Apê</button>
      </header>

      <main className="max-w-7xl mx-auto p-8 relative z-10">
        {abaAtiva === 'lista' ? (
          <TabListaComparacao imoveisSalvos={imoveisSalvos} salario={salario} totalGastosFixos={totalGastosFixos} onExcluir={async (id: any) => { if(confirm("Deletar?")) { await supabase.from('imoveis').delete().eq('id', id); carregarDados(); } }} />
        ) : (
          <TabCadastro onSalvar={handleSalvar} onLimparEdicao={() => setAbaAtiva('lista')} />
        )}
      </main>
    </div>
  );
}