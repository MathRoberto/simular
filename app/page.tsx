"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { calcularTemposJF } from '@/lib/api-rotas';
import TabCadastro from '@/components/TabCadastro';
import TabListaComparacao from '@/components/TabListaComparacao';
import TabMapa from '@/components/TabMapa'; // Garanta que este import exista

export default function SimularDashboard() {
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState<'lista' | 'cadastro' | 'mapa'>('lista');
  const [imoveisSalvos, setImoveisSalvos] = useState<any[]>([]);
  const [imovelSendoEditado, setImovelSendoEditado] = useState<any | null>(null);
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

    if (imovelSendoEditado) {
      await supabase.from('imoveis').update(payload).eq('id', imovelSendoEditado.id);
      setImovelSendoEditado(null);
    } else {
      await supabase.from('imoveis').insert([payload]);
    }

    await carregarDados();
    setAbaAtiva('lista');
    setCarregando(false);
  };

  const iniciarEdicao = (imovel: any) => {
    setImovelSendoEditado(imovel);
    setAbaAtiva('cadastro');
  };

  const cancelarAcao = () => {
    setImovelSendoEditado(null);
    setAbaAtiva('lista');
  };

  if (carregando) return <div className="min-h-screen bg-[#0d0d12] flex items-center justify-center text-purple-500 font-black italic animate-pulse">🌌 SINCRONIZANDO COCKPIT...</div>;

  return (
    <div className="min-h-screen bg-[#0d0d12] relative text-neutral-200 overflow-x-hidden">
      {/* Nebulosas de fundo... */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[5%] right-[-5%] w-[40%] h-[60%] bg-fuchsia-900/5 blur-[100px] rounded-full" />
      </div>

      <header className="p-6 border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center relative">
        <div className="flex flex-col">
          <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest italic">Sobra Estimada</span>
          <div className="flex items-center gap-3">
            <span className={`font-mono font-bold text-emerald-400 ${!mostrarSobra && 'blur-sm select-none'}`}>
              R$ {(salario - totalGastosFixos).toFixed(2)}
            </span>
            <button onClick={() => setMostrarSobra(!mostrarSobra)} className="text-xs">{mostrarSobra ? '🔓' : '🔒'}</button>
          </div>
        </div>

        {/* BOTÃO DE CANCELAR DINÂMICO */}
        {abaAtiva === 'cadastro' && (
            <button 
                onClick={cancelarAcao} 
                className="absolute left-1/2 -translate-x-1/2 bg-rose-950/30 text-rose-500 px-6 py-2 rounded-full font-black text-[10px] uppercase italic tracking-widest border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all"
            >
                Abortar Missão
            </button>
        )}

        {abaAtiva !== 'cadastro' && (
          <button onClick={() => { setImovelSendoEditado(null); setAbaAtiva('cadastro'); }} className="bg-purple-600 px-6 py-2 rounded-full font-black text-[10px] uppercase italic tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 transition-all">
             ＋ Novo Apê
          </button>
        )}
      </header>

      <main className="max-w-7xl mx-auto p-8 relative z-10 pb-40">
        {abaAtiva === 'lista' && (
          <TabListaComparacao 
            imoveisSalvos={imoveisSalvos} 
            salario={salario} 
            totalGastosFixos={totalGastosFixos} 
            onIniciarEdicao={iniciarEdicao}
            onExcluir={async (id: any) => { if(confirm("Deletar?")) { await supabase.from('imoveis').delete().eq('id', id); carregarDados(); } }} 
          />
        )}
        
        {abaAtiva === 'cadastro' && (
          <TabCadastro onSalvar={handleSalvar} imovelParaEditar={imovelSendoEditado} />
        )}

        {/* AGORA O MAPA APARECE! */}
        {abaAtiva === 'mapa' && (
            <TabMapa imoveisSalvos={imoveisSalvos} />
        )}
      </main>

      {/* DOCK NAVEGAÇÃO SUPER GLOW */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-[100] px-6 pointer-events-none">
        <nav className="flex items-center justify-around w-full max-w-sm bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
          <button onClick={() => setAbaAtiva('lista')} className={`flex-1 flex flex-col items-center py-3 rounded-full transition-all ${abaAtiva === 'lista' ? 'text-purple-300 bg-white/5 shadow-inner' : 'text-zinc-600 hover:text-zinc-300'}`}>
            <span className="text-xl mb-1 italic">📋</span>
            <span className="text-[8px] font-black uppercase tracking-widest italic">Favoritos</span>
          </button>
          
          <button onClick={() => setAbaAtiva('mapa')} className={`flex-1 flex flex-col items-center py-3 rounded-full transition-all ${abaAtiva === 'mapa' ? 'text-purple-300 bg-white/5 shadow-inner' : 'text-zinc-600 hover:text-zinc-300'}`}>
            <span className="text-xl mb-1 italic">🗺️</span>
            <span className="text-[8px] font-black uppercase tracking-widest italic">Onde</span>
          </button>
        </nav>
      </div>

    </div>
  );
}