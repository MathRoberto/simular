"use client";
import { useState } from 'react';
import { calcularTemposJF } from '@/lib/api-rotas';

export default function TabMapa({ imoveisSalvos }: any) {
  const [calculandoTudo, setCalculandoTudo] = useState(false);
  const [temposLocal, setTemposLocal] = useState<{ [key: string]: any }>({});
  const [erros, setErros] = useState<{ [key: string]: boolean }>({});

  const handleCalcularTudo = async () => {
    if (imoveisSalvos.length === 0) return;
    setCalculandoTudo(true);
    setErros({});

    const novosTempos: { [key: string]: any } = {};
    const novosErros: { [key: string]: boolean } = {};

    const promises = imoveisSalvos.map(async (imovel: any) => {
      try {
        const res = await calcularTemposJF(imovel.endereco);
        if (res) {
          novosTempos[imovel.id] = {
            paiCarro: res.tempoPaiCarro, 
            trampoCarro: res.tempoTrabCarro,
            paiApe: res.tempoPaiApe,
            trampoApe: res.tempoTrabApe
          };
        } else {
            novosErros[imovel.id] = true;
        }
      } catch (error) {
        novosErros[imovel.id] = true;
      }
    });

    await Promise.all(promises);

    setTemposLocal(novosTempos);
    setErros(novosErros);
    setCalculandoTudo(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      
      <div className="px-4 flex justify-between items-center bg-black/30 p-6 rounded-[2rem] border border-white/5 shadow-2xl">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] italic drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">Análise de Percurso (JF)</h2>
          <p className="text-[9px] text-zinc-500 uppercase font-bold mt-1 italic tracking-wider">Mostrando {imoveisSalvos.length} Imóveis no Radar</p>
        </div>
        
        {imoveisSalvos.length > 0 && (
            <button 
                onClick={handleCalcularTudo}
                disabled={calculandoTudo}
                className="bg-purple-600/20 text-purple-400 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-purple-500/20"
            >
                {calculandoTudo ? '🌌 PROCESSANDO JF...' : '🚀 CALCULAR JF (TODOS)'}
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
        {imoveisSalvos.map((imovel: any) => {
          const dados = temposLocal[imovel.id];
          const erroNoEnd = erros[imovel.id];
          
          return (
            <div key={imovel.id} className="bg-white/[0.03] backdrop-blur-md border border-white/5 p-8 rounded-[3rem] hover:border-purple-500/30 transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-purple-900/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"/>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic truncate pr-4">{imovel.nome}</h3>
                  <p className="text-[9px] text-zinc-600 mt-1 truncate">📍 {imovel.endereco}</p>
                </div>
              </div>

              {dados ? (
                <div className="grid grid-cols-2 gap-4 animate-in zoom-in-95 duration-500 relative z-10">
                  <div className="bg-black/60 p-6 rounded-[2.2rem] border border-purple-900/20 shadow-inner">
                    <span className="text-[9px] font-black text-zinc-500 uppercase block mb-3 italic tracking-wider">Oscar Vidal (Trampo)</span>
                    <div className="flex flex-col gap-2">
                      {/* CORREÇÃO AQUI: Carro usa trampoCarro, Pedestre usa trampoApe */}
                      <span className="text-xl font-black text-white tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">🚗 {dados.trampoCarro}m</span>
                      <span className="text-xl font-black text-purple-400 tracking-tight drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">🏃 {dados.trampoApe}m</span>
                    </div>
                  </div>
                  <div className="bg-black/60 p-6 rounded-[2.2rem] border border-purple-900/20 shadow-inner">
                    <span className="text-[9px] font-black text-zinc-500 uppercase block mb-3 italic tracking-wider">Casa do Pai</span>
                    <div className="flex flex-col gap-2">
                      {/* CORREÇÃO AQUI: Carro usa paiCarro, Pedestre usa paiApe */}
                      <span className="text-xl font-black text-white tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">🚗 {dados.paiCarro}m</span>
                      <span className="text-xl font-black text-fuchsia-400 tracking-tight drop-shadow-[0_0_10px_rgba(217,70,239,0.4)]">🏃 {dados.paiApe}m</span>
                    </div>
                  </div>
                </div>
              ) : erroNoEnd ? (
                  <div className="h-28 flex flex-col items-center justify-center border-2 border-dashed border-rose-900/20 rounded-[2.5rem] bg-rose-950/20 text-rose-500 gap-2">
                    <span className="text-xl">⚠️</span>
                    <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest italic">Endereço Não Encontrado</span>
                  </div>
              ) : (
                <div className="h-28 flex items-center justify-center border-2 border-dashed border-purple-900/10 rounded-[2.5rem] bg-black/20 text-[9px] font-black text-zinc-700 uppercase tracking-widest italic animate-pulse">
                   Aguardando Comando de JF
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}