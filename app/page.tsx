"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImovelSalvo, Destino } from '@/types';
import TabCadastro from '@/components/TabCadastro';
import TabListaComparacao from '@/components/TabListaComparacao';
import TabMapa from '@/components/TabMapa';
import TabDestinos from '@/components/TabDestinos';
import ModalConfiguracoes from '@/components/ModalConfiguracoes';
import { supabase } from '@/lib/supabase';
import { calcularTemposParaDestinos } from '@/lib/api-rotas';

export default function SimularDashboard() {
  const router = useRouter();

  // NAVEGAÇÃO
  const [abaAtiva, setAbaAtiva] = useState<'lista' | 'cadastro' | 'mapa' | 'destinos'>('lista');
  const [carregando, setCarregando] = useState(true);

  // PRIVACIDADE
  const [mostrarSobra, setMostrarSobra] = useState(false);
  const [mostrarSalario, setMostrarSalario] = useState(false);
  const [modalAberto, setModalAberto] = useState<'gastos' | 'salario' | null>(null);

  // DADOS
  const [imoveisSalvos, setImoveisSalvos] = useState<ImovelSalvo[]>([]);
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [imovelSendoEditado, setImovelSendoEditado] = useState<ImovelSalvo | null>(null);
  const [salario, setSalario] = useState<number>(0);
  const [totalGastosFixos, setTotalGastosFixos] = useState<number>(0);

  // PROTEÇÃO DE ROTA
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Imóveis do usuário
    const { data: imov } = await supabase
      .from('imoveis')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (imov) setImoveisSalvos(imov as ImovelSalvo[]);

    // CONFIGURAÇÕES (SALÁRIO)
    const { data: cfg } = await supabase
      .from('configuracoes')
      .select('salario')
      .eq('user_id', user.id);
    
    if (cfg && cfg.length > 0) {
      setSalario(Number(cfg[0].salario || 0));
    } else {
      setSalario(0);
    }

    // Gastos fixos do usuário
    const { data: gst } = await supabase
      .from('gastos_fixos')
      .select('valor')
      .eq('user_id', user.id);
    const soma = gst ? gst.reduce((acc: number, curr: any) => acc + Number(curr.valor || 0), 0) : 0;
    setTotalGastosFixos(soma);

    // Destinos do usuário
    const { data: dest } = await supabase
      .from('destinos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    if (dest) setDestinos(dest as Destino[]);
  };

  const handleSalvarImovel = async (n: any) => {
    setCarregando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let temposDestinos = null;
      if (destinos.length > 0) {
        temposDestinos = await calcularTemposParaDestinos(n.endereco, destinos);
      }

      const dadosParaSalvar = {
        ...n,
        user_id: user.id,
        tempos_destinos: temposDestinos || [],
        tempoTrabalhoCarro: 0,
        tempoCasaCarro: 0,
        tempoTrabalhoApe: 0,
      };

      if (imovelSendoEditado) {
        await supabase.from('imoveis').update(dadosParaSalvar).eq('id', imovelSendoEditado.id);
        setImovelSendoEditado(null);
      } else {
        await supabase.from('imoveis').insert([dadosParaSalvar]);
      }

      await carregarDadosIniciais();
      setAbaAtiva('lista');
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
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

  const sobra = salario - totalGastosFixos;

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200 selection:bg-purple-500/30 overflow-x-hidden relative">

      {/* HEADER */}
      <header className="p-5 border-b border-purple-900/10 bg-[#0a0a0c]/40 backdrop-blur-xl sticky top-0 z-[50]">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">

          <div className="flex flex-col">
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1 italic">Sobra Mensal</span>
            <div className="flex items-center gap-3 bg-zinc-900/30 px-4 py-2 rounded-2xl border border-white/5 shadow-inner">
              <span className={`font-mono font-bold text-sm ${mostrarSobra ? (sobra >= 0 ? 'text-emerald-400' : 'text-rose-400') : 'text-zinc-800 bg-zinc-800 select-none rounded blur-sm px-2'}`}>
                R$ {sobra.toFixed(2)}
              </span>
              <button onClick={() => setMostrarSobra(!mostrarSobra)} className="text-lg opacity-60 hover:opacity-100 transition-opacity">
                {mostrarSobra ? '🔓' : '🔒'}
              </button>
              <button onClick={() => setModalAberto('gastos')} className="text-lg hover:rotate-90 transition-all text-zinc-600 hover:text-white">⚙️</button>
            </div>
          </div>

          <button onClick={handleLogout} className="text-[8px] font-black text-zinc-700 hover:text-red-500 transition-colors uppercase italic tracking-widest">
            Sair do Cockpit
          </button>

          <div className="flex flex-col items-end">
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-purple-400/50 mb-1 italic">Renda Mensal</span>
            <div className="flex items-center gap-3 bg-purple-900/5 px-4 py-2 rounded-2xl border border-purple-500/10 shadow-inner">
              <button onClick={() => setModalAberto('salario')} className="text-lg hover:rotate-90 transition-all text-zinc-600 hover:text-purple-400">⚙️</button>
              <button onClick={() => setMostrarSalario(!mostrarSalario)} className="text-lg opacity-60 hover:opacity-100 transition-opacity">
                {mostrarSalario ? '🔓' : '🔒'}
              </button>
              <span className={`font-mono font-black text-sm ${mostrarSalario ? 'text-purple-400' : 'text-zinc-800 bg-zinc-800 select-none rounded blur-sm px-2'}`}>
                R$ {salario.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto p-4 md:p-12 pb-40">
        {abaAtiva === 'lista' && (
          <TabListaComparacao
            imoveisSalvos={imoveisSalvos}
            onExcluir={async (id: string) => {
              await supabase.from('imoveis').delete().eq('id', id);
              carregarDadosIniciais();
            }}
            salario={salario}
            totalGastosFixos={totalGastosFixos}
            onIniciarEdicao={(i: any) => { setImovelSendoEditado(i); setAbaAtiva('cadastro'); }}
          />
        )}
        {abaAtiva === 'cadastro' && (
          <TabCadastro
            onSalvar={handleSalvarImovel}
            imovelParaEditar={imovelSendoEditado}
            onLimparEdicao={() => setImovelSendoEditado(null)}
            onCancelar={() => {
              setImovelSendoEditado(null);
              setAbaAtiva('lista');
            }}
          />
        )}
        {abaAtiva === 'mapa' && (
          <TabMapa imoveisSalvos={imoveisSalvos} destinos={destinos} />
        )}
        {abaAtiva === 'destinos' && (
          <TabDestinos destinos={destinos} onAtualizar={carregarDadosIniciais} />
        )}
      </main>

      {/* DOCK DE NAVEGAÇÃO PADRONIZADO */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-[100] px-6 pointer-events-none">
        <nav className="flex items-center justify-around w-full max-w-lg bg-[#0f0f12]/80 backdrop-blur-2xl border border-white/10 rounded-full p-2 shadow-2xl pointer-events-auto">
          
          <button 
            onClick={() => setAbaAtiva('lista')} 
            className={`flex-1 flex flex-col items-center py-3 rounded-full transition-all ${abaAtiva === 'lista' ? 'text-purple-400 bg-white/5 shadow-inner' : 'text-zinc-600 hover:text-zinc-300'}`}
          >
            <span className="text-xl mb-1">📋</span>
            <span className="text-[7px] font-black uppercase tracking-widest italic">Imóveis</span>
          </button>

          <button 
            onClick={() => { setImovelSendoEditado(null); setAbaAtiva('cadastro'); }} 
            className={`flex-1 flex flex-col items-center py-3 rounded-full transition-all ${abaAtiva === 'cadastro' ? 'text-purple-400 bg-white/5 shadow-inner' : 'text-zinc-600 hover:text-zinc-300'}`}
          >
            <span className="text-xl mb-1">📝</span>
            <span className="text-[7px] font-black uppercase tracking-widest italic">Cadastro</span>
          </button>

          <button 
            onClick={() => setAbaAtiva('destinos')} 
            className={`flex-1 flex flex-col items-center py-3 rounded-full transition-all ${abaAtiva === 'destinos' ? 'text-purple-400 bg-white/5 shadow-inner' : 'text-zinc-600 hover:text-zinc-300'}`}
          >
            <span className="text-xl mb-1">📍</span>
            <span className="text-[7px] font-black uppercase tracking-widest italic">Destinos</span>
          </button>
          
          <button 
            onClick={() => setAbaAtiva('mapa')} 
            className={`flex-1 flex flex-col items-center py-3 rounded-full transition-all ${abaAtiva === 'mapa' ? 'text-purple-400 bg-white/5 shadow-inner' : 'text-zinc-600 hover:text-zinc-300'}`}
          >
            <span className="text-xl mb-1">🗺️</span>
            <span className="text-[7px] font-black uppercase tracking-widest italic">Rotas</span>
          </button>

          

        </nav>
      </div>

      {/* MODAL CONFIG */}
      {modalAberto && (
        <ModalConfiguracoes
          focoInicial={modalAberto}
          mostrarSalario={mostrarSalario}
          onClose={async () => { 
            setModalAberto(null); 
            await carregarDadosIniciais(); 
          }}
        />
      )}
    </div>
  );
}