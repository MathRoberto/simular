"use client";

import { useState } from 'react';
import { calcularTemposJF } from '@/lib/api-rotas';

export default function TabMapa({ imoveisSalvos }: any) {
  const [calculando, setCalculando] = useState(false);
  const [temposLocal, setTemposLocal] = useState<{ [key: string]: any }>({});

  const handleCalcular = async (imovel: any) => {
    setCalculando(true);
    const res = await calcularTemposJF(imovel.endereco);
    
    if (res) {
      // CORREÇÃO AQUI: Usando os novos nomes que vêm do api-rotas.ts
      setTemposLocal(prev => ({
        ...prev,
        [imovel.id]: {
          pai: res.tempoPaiCarro, // Antes era tempoPai
          trampo: res.tempoTrabCarro, // Antes era tempoTrab
          paiApe: res.tempoPaiApe,
          trampoApe: res.tempoTrabApe
        }
      }));
    }
    setCalculando(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="px-4">
        <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] italic drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
          Análise de Percurso (JF)
        </h2>
        <p className="text-[9px] text-zinc-500 uppercase font-bold mt-1">Clique para calcular o tempo real até os pontos fixos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
        {imoveisSalvos.map((imovel: any) => {
          const dados = temposLocal[imovel.id];
          
          return (
            <div key={imovel.id} className="bg-white/[0.03] backdrop-blur-md border border-white/5 p-8 rounded-[3rem] hover:border-purple-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic">{imovel.nome}</h3>
                  <p className="text-[9px] text-zinc-600 mt-1 truncate">📍 {imovel.endereco}</p>
                </div>
                {!dados && (
                  <button 
                    onClick={() => handleCalcular(imovel)}
                    disabled={calculando}
                    className="bg-purple-600/20 text-purple-400 p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all disabled:opacity-50"
                  >
                    {calculando ? '...' : 'Calcular'}
                  </button>
                )}
              </div>

              {dados ? (
                <div className="grid grid-cols-2 gap-4 animate-in zoom-in-95 duration-500">
                  <div className="bg-black/40 p-5 rounded-[2rem] border border-white/5">
                    <span className="text-[8px] font-black text-zinc-600 uppercase block mb-3">Oscar Vidal (Trampo)</span>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-400">🚗 {dados.trampo}m</span>
                        <span className="text-[10px] text-purple-400 font-bold">🏃 {dados.trampoApe}m</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/40 p-5 rounded-[2rem] border border-white/5">
                    <span className="text-[8px] font-black text-zinc-600 uppercase block mb-3">Casa do Pai</span>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-400">🚗 {dados.pai}m</span>
                        <span className="text-[10px] text-fuchsia-400 font-bold">🏃 {dados.paiApe}m</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem]">
                   <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">Aguardando Comando</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}