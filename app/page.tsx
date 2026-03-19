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
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-purple-500 font-black uppercase tracking-widest animate-pulse">
      <div className="text-center">
        <div className="text-6xl mb-4">🌌</div>
        Sincronizando Fortaleza...
      </div>
    </div>
  );

  return (
    // NOVO FUNDO: ROXO, BRILHOSO E DARK
    <div className="min-h-screen bg-[#08080a] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#08080a] to-[#050505] text-neutral-200 selection:bg-purple-500/30 overflow-x-hidden relative">
      
      {/* HEADER COM BRILHO NOS VALORES */}
      <header className="p-5 border-b border-purple-900/10 bg-[#0a0a0c]/50 backdrop-blur-xl sticky top-0 z-[50]">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          
          <div className="flex flex-col">
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1 italic">Sobra Mensal</span>
            <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-2xl border border-purple-900/20 shadow-inner">
              <span className={`font-mono font-bold text-sm drop-shadow-[0_0_8px_rgba(74,222,128,0.5)] ${mostrarSobra ? 'text-emerald-400' : 'text-zinc-800 bg-zinc-800 select-none rounded blur-sm px-2'}`}>
                R$ {(salario - totalGastosFixos).toFixed(2)}
              </span>
              <button onClick={() => setMostrarSobra(!mostrarSobra)} className="text-lg opacity-60 hover:opacity-100 transition-opacity">{mostrarSobra ? '🔓' : '🔒'}</button>
              <button onClick={() => setModalAberto('gastos')} className="text-lg hover:rotate-90 transition-all text-zinc-600 hover:text-white">⚙️</button>
            </div>
          </div>

          <button onClick={handleLogout} className="text-[8px] font-black text-zinc-700 hover:text-red-500 transition-colors uppercase italic tracking-widest">Sair do Cockpit</button>

          <div className="flex flex-col items-end">
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-purple-400/50 mb-1 italic">Renda Mensal</span>
            <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-2xl border border-purple-500/10 shadow-inner">
               <button onClick={() => setModalAberto('salario')} className="text-lg hover:rotate-90 transition-all text-zinc-600 hover:text-purple-400">⚙️</button>
               <button onClick={() => setMostrarSalario(!mostrarSalario)} className="text-lg opacity-60 hover:opacity-100 transition-opacity">{mostrarSalario ? '🔓' : '🔒'}</button>
              <span className={`font-mono font-black text-sm drop-shadow-[0_0_10px_rgba(168,85,247,0.6)] ${mostrarSalario ? 'text-purple-400' : 'text-zinc-800 bg-zinc-800 select-none rounded blur-sm px-2'}`}>
                R$ {salario.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-12 pb-40 relative z-10">
        <div className="animate-in fade-in duration-700">
          {abaAtiva === 'lista' && (
            <TabListaComparacao 
              imoveisSalvos={imoveisSalvos} 
              onExcluir={async (id: string) => { if(confirm("Apagar imóvel?")) { await supabase.from('imoveis').delete().eq('id', id); carregarDadosIniciais(); } }} 
              salario={salario} 
              totalGastosFixos={totalGastosFixos} 
              onIniciarEdicao={(i: any) => { setImovelSendoEditado(i); setAbaAtiva('cadastro'); }} 
            />
          )}
          {abaAtiva === 'cadastro' && (
            <TabCadastro onSalvar={handleSalvarImovel} imovelParaEditar={imovelSendoEditado} onLimparEdicao={() => setImovelSendoEditado(null)} />
          )}
          {abaAtiva === 'mapa' && <TabMapa imoveisSalvos={imoveisSalvos} />}
        </div>
      </main>

      {/* DOCK NAVEGAÇÃO SUPER GLOW */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-[100] px-6 pointer-events-none">
        <nav className="flex items-center justify-around w-full max-w-md bg-[#0a0a0c]/80 backdrop-blur-2xl border border-purple-900/30 rounded-full p-2 shadow-[0_0_50px_rgba(168,85,247,0.2)] pointer-events-auto">
          <button onClick={() => setAbaAtiva('lista')} className={`flex-1 flex flex-col items-center py-3 rounded-full transition-colors ${abaAtiva === 'lista' ? 'text-purple-300 bg-purple-500/10 shadow-inner' : 'text-zinc-600 hover:text-zinc-300'}`}>
            <span className="text-xl mb-1">📋</span>
            <span className="text-[8px] font-black uppercase tracking-widest">Favoritos</span>
          </button>
          <div className="px-3">
            <button onClick={() => { setImovelSendoEditado(null); setAbaAtiva('cadastro'); }} className={`p-6 rounded-full -mt-12 border-4 border-[#08080a] shadow-2xl transition-all duration-300 ${abaAtiva === 'cadastro' ? 'bg-purple-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.6)] scale-110' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
              <span className="text-2xl block font-bold">＋</span>
            </button>
          </div>
          <button onClick={() => setAbaAtiva('mapa')} className={`flex-1 flex flex-col items-center py-3 rounded-full transition-colors ${abaAtiva === 'mapa' ? 'text-purple-300 bg-purple-500/10 shadow-inner' : 'text-zinc-600 hover:text-zinc-300'}`}>
            <span className="text-xl mb-1">🗺️</span>
            <span className="text-[8px] font-black uppercase tracking-widest">Onde</span>
          </button>
        </nav>
      </div>

      {modalAberto && (
        <ModalConfiguracoes focoInicial={modalAberto} mostrarSalario={mostrarSalario} onClose={() => { setModalAberto(null); carregarDadosIniciais(); }} />
      )}
    </div>
  );
} 
// FUTURO: Animação de fundo com estrelas cadentes, nebulosas e um foguete passando de vez em quando.