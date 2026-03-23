"use client";

import { useState, useEffect } from 'react';

export default function TabCadastro({ onSalvar, imovelParaEditar, onLimparEdicao, onCancelar }: any) {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [linkAnuncio, setLinkAnuncio] = useState('');
  const [aluguel, setAluguel] = useState('');
  const [condominio, setCondominio] = useState('');
  const [iptu, setIptu] = useState('');
  const [luz, setLuz] = useState('');
  const [agua, setAgua] = useState('');
  const [gas, setGas] = useState('');

  useEffect(() => {
    if (imovelParaEditar) {
      setNome(imovelParaEditar.nome || '');
      setEndereco(imovelParaEditar.endereco || '');
      setLinkAnuncio(imovelParaEditar.link_anuncio || '');
      setAluguel(imovelParaEditar.aluguel?.toString() || '');
      setCondominio(imovelParaEditar.condominio?.toString() || '');
      setIptu(imovelParaEditar.iptu?.toString() || '');
      setLuz(imovelParaEditar.luz?.toString() || '');
      setAgua(imovelParaEditar.agua?.toString() || '');
      setGas(imovelParaEditar.gas?.toString() || '');
    }
  }, [imovelParaEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSalvar({
      nome,
      endereco,
      link_anuncio: linkAnuncio,
      aluguel: Number(aluguel),
      condominio: Number(condominio),
      iptu: Number(iptu),
      luz: Number(luz),
      agua: Number(agua),
      gas: Number(gas)
    });
    limpar();
  };

  const limpar = () => {
    setNome(''); setEndereco(''); setLinkAnuncio('');
    setAluguel(''); setCondominio(''); setIptu('');
    setLuz(''); setAgua(''); setGas('');
    onLimparEdicao();
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex justify-between items-center mb-10 px-4">
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
          {imovelParaEditar ? '🚀 Editando Imóvel' : '➕ Novo Imóvel em JF'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 px-2">
        {/* INFO BÁSICA */}
        <div className="bg-[#0a0a0c] border border-white/5 p-8 rounded-[3rem] shadow-2xl space-y-4">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Informações Gerais</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome (Ex: Apê Democrata)" className="w-full bg-black/50 p-5 rounded-3xl border border-white/5 text-white outline-none focus:border-purple-500 transition-all" />
            <input required value={endereco} onChange={e => setEndereco(e.target.value)} placeholder="Endereço em Juiz de Fora" className="w-full bg-black/50 p-5 rounded-3xl border border-white/5 text-white outline-none focus:border-purple-500 transition-all" />
            <input value={linkAnuncio} onChange={e => setLinkAnuncio(e.target.value)} placeholder="Link do Anúncio (ZAP, OLX...)" className="w-full bg-black/50 p-5 rounded-3xl border border-white/5 text-white outline-none focus:border-purple-500 transition-all md:col-span-2" />
          </div>
        </div>

        {/* FINANCEIRO */}
        <div className="bg-[#0a0a0c] border border-white/5 p-8 rounded-[3rem] shadow-2xl space-y-4">
          <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] mb-4">Custos Mensais (R$)</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              ['Aluguel', aluguel, setAluguel],
              ['Condomínio', condominio, setCondominio],
              ['IPTU', iptu, setIptu],
              ['Luz (Cemig)', luz, setLuz],
              ['Água (Cesama)', agua, setAgua],
              ['Gás', gas, setGas]
            ].map(([label, val, set]: any, i) => (
              <div key={i}>
                <label className="text-[8px] font-black text-zinc-700 uppercase mb-2 block">{label}</label>
                <input type="number" value={val} onChange={e => set(e.target.value)} placeholder="0.00" className="w-full bg-black/50 p-4 rounded-2xl border border-white/5 text-white outline-none focus:border-purple-500" />
              </div>
            ))}
          </div>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="flex flex-col md:flex-row gap-4">
          <button 
            type="button" 
            onClick={onCancelar}
            className="flex-1 bg-zinc-900/50 hover:bg-zinc-800 p-6 rounded-[2rem] font-black text-zinc-500 hover:text-white uppercase tracking-[0.2em] transition-all border border-white/5"
          >
            {imovelParaEditar ? 'Desistir da Edição' : 'Cancelar'}
          </button>
          
          <button 
            type="submit" 
            className="flex-[2] bg-gradient-to-r from-purple-600 to-fuchsia-600 p-6 rounded-[2rem] font-black text-white uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all"
          >
            {imovelParaEditar ? 'Sincronizar Alterações' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}