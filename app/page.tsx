"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImovelSalvo } from '@/types';
import TabCadastro from '@/components/TabCadastro';
import TabListaComparacao from '@/components/TabListaComparacao';
import TabMapa from '@/components/TabMapa';
import ModalConfiguracoes from '@/components/ModalConfiguracoes';
import { supabase } from '@/lib/supabase';
import { calcularTemposJF } from '@/lib/api-rotas';

export default function SimularDashboard() {
  const router = useRouter();

  const [abaAtiva, setAbaAtiva] = useState<'lista' | 'cadastro' | 'mapa'>('lista');
  const [imoveisSalvos, setImoveisSalvos] = useState<ImovelSalvo[]>([]);
  const [imovelSendoEditado, setImovelSendoEditado] = useState<ImovelSalvo | null>(null);
  const [salario, setSalario] = useState<number>(0);
  const [totalGastosFixos, setTotalGastosFixos] = useState<number>(0);
  
  const [carregando, setCarregando] = useState(true);
  const [mostrarSobra, setMostrarSobra] = useState(false);
  const [mostrarSalario, setMostrarSalario] = useState(false);
  const [modalAberto, setModalAberto] = useState<'gastos' | 'salario' | null>(null);

  useEffect(() => {
    const verificarAcesso = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        await carregarDadosIniciais();
        setCarregando(false);
      }
    };
    verificarAcesso();
  }, [router]);

  const carregarDadosIniciais = async () => {
    const { data: imov } = await supabase.from('imoveis').select('*').order('created_at', { ascending: false });
    if (imov) setImoveisSalvos(imov as ImovelSalvo[]);

    const { data: cfg } = await supabase.from('configuracoes').select('salario').eq('id', 1).single();
    setSalario(Number(cfg?.salario || 0));

    const { data: gst } = await supabase.from('gastos_fixos').select('valor');
    const soma = gst ? gst.reduce((acc: number, curr: any) => acc + Number(curr.valor || 0), 0) : 0;
    setTotalGastosFixos(soma);
  };

  const handleSalvarImovel = async (n: any) => {
    setCarregando(true);
    try {
      const tempos = await calcularTemposJF(n.endereco);
      const dadosParaSalvar = {
        ...n,
        tempoTrabalhoCarro: tempos?.tempoTrab || 0,
        tempoCasaCarro: tempos?.tempoPai || 0,
        tempoTrabalhoApe: tempos?.tempoApe || 0,
      };

      if (imovelSendoEditado) {
        await supabase.from('imoveis').update(dadosParaSalvar).eq('id', imovelSendoEditado.id);
        setImovelSendoEditado(null);
      } else {
        await supabase.from('imoveis').insert([dadosParaSalvar]);
      }

      await carregarDadosIniciais();
      setAbaAtiva('lista');
    } catch (err) { console.error(err); } 
    finally { setCarregando(false); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (carregando) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-purple-500 font-black uppercase tracking-widest animate-pulse">
      Sincronizando Sistema...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0f] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-[#0d0d0f] to-[#0a0a0c] text-neutral-200 selection:bg-purple-500/30 overflow-x-hidden relative">
      
      <header className="p-5 border-b border-purple-900/10 bg-[#0a0a0c]/40 backdrop-blur-xl sticky top-0 z-[50]">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          
          <div className="flex flex-col">
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1 italic">Sobra Mensal</span>
            <div className="flex items-center gap-3 bg-zinc-900/30 px-4 py-2 rounded-2xl border border-white/5">
              <span className={`font-mono font-bold text-sm ${mostrarSobra ? 'text-emerald-400' : 'text-zinc-800 bg-zinc-800 select-none rounded blur-sm px-2'}`}>
                R$ {(salario - totalGastosFixos).toFixed(2)}
              </span>
              <button onClick={() => setMostrarSobra(!mostrarSobra)} className="text-lg opacity-60 hover:opacity-100">{mostrarSobra ? '🔓' : '🔒'}</button>
              <button onClick={() => setModalAberto('gastos')} className="text-lg hover:rotate-90 transition-all">⚙️</button>
            </div>
          </div>

          <button onClick={handleLogout} className="text-[8px] font-black text-zinc-700 hover:text-red-500 transition-colors uppercase italic tracking-widest">Sair</button>

          <div className="flex flex-col items-end">
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-purple-400/50 mb-1 italic">Renda Mensal</span>
            <div className="flex items-center gap-3 bg-purple-900/5 px-4 py-2 rounded-2xl border border-purple-500/10">
               <button onClick={() => setModalAberto('salario')} className="text-lg hover:rotate-90 transition-all">⚙️</button>
               <button onClick={() => setMostrarSalario(!mostrarSalario)} className="text-lg opacity-60 hover:opacity-100">{mostrarSalario ? '🔓' : '🔒'}</button>
              <span className={`font-mono font-black text-sm ${mostrarSalario ? 'text-purple-400' : 'text-zinc-800 bg-zinc-800 select-none rounded blur-sm px-2'}`}>
                R$ {salario.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-12 pb-40">
        {abaAtiva === 'lista' && (
          <TabListaComparacao 
            imoveisSalvos={imoveisSalvos} 
            onExcluir={async (id: string) => { await supabase.from('imoveis').delete().eq('id', id); carregarDadosIniciais(); }} 
            salario={salario} 
            totalGastosFixos={totalGastosFixos} 
            onIniciarEdicao={(i: any) => { setImovelSendoEditado(i); setAbaAtiva('cadastro'); }} 
          />
        )}
        {abaAtiva === 'cadastro' && (
          <TabCadastro onSalvar={handleSalvarImovel} imovelParaEditar={imovelSendoEditado} onLimparEdicao={() => setImovelSendoEditado(null)} />
        )}
        {abaAtiva === 'mapa' && <TabMapa imoveisSalvos={imoveisSalvos} />}
      </main>

      {/* DOCK NAVEGAÇÃO */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-[100] px-6 pointer-events-none">
        <nav className="flex items-center justify-around w-full max-w-md bg-[#0f0f12]/80 backdrop-blur-2xl border border-white/10 rounded-full p-2 shadow-2xl pointer-events-auto">
          <button onClick={() => setAbaAtiva('lista')} className={`flex-1 flex flex-col items-center py-3 rounded-full ${abaAtiva === 'lista' ? 'text-purple-400 bg-white/5' : 'text-zinc-600'}`}>
            <span className="text-xl mb-1">📋</span>
            <span className="text-[8px] font-black uppercase">Lista</span>
          </button>
          <div className="px-3">
            <button onClick={() => { setImovelSendoEditado(null); setAbaAtiva('cadastro'); }} className={`p-6 rounded-full -mt-12 border-4 border-[#0d0d0f] shadow-2xl transition-all ${abaAtiva === 'cadastro' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
              <span className="text-2xl block font-bold">＋</span>
            </button>
          </div>
          <button onClick={() => setAbaAtiva('mapa')} className={`flex-1 flex flex-col items-center py-3 rounded-full ${abaAtiva === 'mapa' ? 'text-purple-400 bg-white/5' : 'text-zinc-600'}`}>
            <span className="text-xl mb-1">🗺️</span>
            <span className="text-[8px] font-black uppercase">Mapa</span>
          </button>
        </nav>
      </div>

      {modalAberto && (
        <ModalConfiguracoes focoInicial={modalAberto} mostrarSalario={mostrarSalario} onClose={() => { setModalAberto(null); carregarDadosIniciais(); }} />
      )}
    </div>
  );
}