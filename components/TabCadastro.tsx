"use client";

import { useState, useEffect } from 'react';

// Ajustamos a Tipagem para aceitar apenas a função unificada 'onSalvar'
export default function TabCadastro({ onSalvar, imovelParaEditar, onLimparEdicao }: any) {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [aluguel, setAluguel] = useState<number>(0);
  const [condominio, setCondominio] = useState<number>(0);
  const [iptu, setIptu] = useState<number>(0);
  
  // Padrões de Juiz de Fora (Cemig/Cesama) que definimos
  const [luz, setLuz] = useState<number>(150);
  const [agua, setAgua] = useState<number>(75);
  const [gas, setGas] = useState<number>(45);

  useEffect(() => {
    if (imovelParaEditar) {
      setNome(imovelParaEditar.nome);
      setEndereco(imovelParaEditar.endereco);
      setAluguel(imovelParaEditar.aluguel);
      setCondominio(imovelParaEditar.condominio);
      setIptu(imovelParaEditar.iptu);
      setLuz(imovelParaEditar.luz || 150);
      setAgua(imovelParaEditar.agua || 75);
      setGas(imovelParaEditar.gas || 45);
    }
  }, [imovelParaEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dados = { nome, endereco, aluguel, condominio, iptu, luz, agua, gas };

    // CORREÇÃO AQUI: Usamos sempre a função 'onSalvar'.
    // A lógica de INSERT ou UPDATE já está dentro dela no 'page.tsx'.
    onSalvar(dados);
    
    limpar();
  };

  const limpar = () => {
    setNome(''); setEndereco(''); setAluguel(0); setCondominio(0); setIptu(0);
    setLuz(150); setAgua(75); setGas(45);
    onLimparEdicao?.();
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="bg-[#0f0f12] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <h3 className="text-purple-400 font-black uppercase text-[10px] tracking-[0.3em] mb-6 italic">Informações Básicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required value={nome} onChange={e => setNome(e.target.value)} placeholder="Apelido do Imóvel" className="bg-black/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-purple-500 text-white transition-all" />
            <input required value={endereco} onChange={e => setEndereco(e.target.value)} placeholder="Rua e número, Juiz de Fora" className="bg-black/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-purple-500 text-white transition-all" />
          </div>
        </div>

        <div className="bg-[#0f0f12] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <h3 className="text-fuchsia-400 font-black uppercase text-[10px] tracking-[0.3em] mb-6 italic">Custos do Apartamento</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] text-zinc-600 uppercase font-black ml-2">Aluguel</label>
              <input type="number" value={aluguel || ''} onChange={e => setAluguel(Number(e.target.value))} className="w-full bg-black/50 p-4 rounded-2xl border border-white/5 outline-none text-white font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-zinc-600 uppercase font-black ml-2">Condomínio</label>
              <input type="number" value={condominio || ''} onChange={e => setCondominio(Number(e.target.value))} className="w-full bg-black/50 p-4 rounded-2xl border border-white/5 outline-none text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-zinc-600 uppercase font-black ml-2">Luz (Cemig)</label>
              <input type="number" value={luz} onChange={e => setLuz(Number(e.target.value))} className="w-full bg-black/50 p-4 rounded-2xl border border-white/5 outline-none text-purple-300" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-zinc-600 uppercase font-black ml-2">Água (Cesama)</label>
              <input type="number" value={agua} onChange={e => setAgua(Number(e.target.value))} className="w-full bg-black/50 p-4 rounded-2xl border border-white/5 outline-none text-blue-300" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-zinc-600 uppercase font-black ml-2">Gás</label>
              <input type="number" value={gas} onChange={e => setGas(Number(e.target.value))} className="w-full bg-black/50 p-4 rounded-2xl border border-white/5 outline-none text-orange-300" />
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 p-6 rounded-[2rem] font-black text-white uppercase tracking-widest shadow-xl hover:scale-[1.01] active:scale-95 transition-all">
          {imovelParaEditar ? '💾 Atualizar Apartamento' : '🚀 Cadastrar e Gerar Rotas'}
        </button>
      </form>
    </div>
  );
}