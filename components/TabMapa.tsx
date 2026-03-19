"use client";

import { useState } from 'react';
import { calcularTemposJF } from '../lib/api-rotas';

export default function TabMapa({ imoveisSalvos }: any) {
  const [selecionado, setSelecionado] = useState<any>(null);
  const [tempos, setTempos] = useState<{pai: number, trampo: number} | null>(null);
  const [calculando, setCalculando] = useState(false);

  const rodarCalculo = async (imovel: any) => {
    setSelecionado(imovel);
    setCalculando(true);
    const res = await calcularTemposJF(imovel.endereco);
    if (res) {
      setTempos({ pai: res.tempoPai, trampo: res.tempoTrab });
    }
    setCalculando(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* SELETOR ESTILO DASHBOARD */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {imoveisSalvos.map((imovel: any) => (
          <button 
            key={imovel.id}
            onClick={() => rodarCalculo(imovel)}
            className={`p-6 rounded-[2rem] border transition-all text-left ${selecionado?.id === imovel.id ? 'bg-purple-600 border-purple-400 shadow-[0_0_30px_rgba(147,51,234,0.3)]' : 'bg-[#0f0f12] border-white/5 hover:border-white/10'}`}
          >
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selecionado?.id === imovel.id ? 'text-purple-200' : 'text-zinc-600'}`}>Imóvel</p>
            <p className="font-bold text-white truncate">{imovel.nome}</p>
          </button>
        ))}
      </div>

      {/* RESULTADO DOS CÁLCULOS */}
      {selecionado && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in-95 duration-500">
          
          {/* CARD TRABALHO */}
          <div className="bg-[#0f0f12] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase text-fuchsia-500 tracking-[0.3em]">Destino: Oscar Vidal</span>
              <h4 className="text-4xl font-black text-white mt-4 italic">
                {calculando ? '...' : `${tempos?.trampo || selecionado.tempoTrabalhoCarro} min`}
              </h4>
              <p className="text-zinc-500 text-[10px] mt-2 font-bold uppercase">Tempo Estimado de Carro</p>
            </div>
            <div className="absolute -right-4 -bottom-4 text-8xl opacity-5 select-none">🚗</div>
          </div>

          {/* CARD PAI */}
          <div className="bg-[#0f0f12] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase text-blue-500 tracking-[0.3em]">Destino: Casa do Pai</span>
              <h4 className="text-4xl font-black text-white mt-4 italic">
                {calculando ? '...' : `${tempos?.pai || selecionado.tempoCasaCarro} min`}
              </h4>
              <p className="text-zinc-600 text-[10px] mt-2 font-bold uppercase">Trânsito em tempo real (JF)</p>
            </div>
            <div className="absolute -right-4 -bottom-4 text-8xl opacity-5 select-none">🏠</div>
          </div>

        </div>
      )}

      {!selecionado && (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
          <p className="text-zinc-800 font-black uppercase tracking-[0.5em] text-xs">Selecione um apê para calcular o deslocamento</p>
        </div>
      )}
    </div>
  );
}