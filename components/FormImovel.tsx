"use client"

import { useState } from "react"

export default function FormImovel({ onAdd }: any) {
  const [nome, setNome] = useState("")
  const [aluguel, setAluguel] = useState(0)

  function handleSubmit(e: any) {
    e.preventDefault()

    const novoImovel = {
      id: Date.now().toString(),
      nome,
      endereco: "",
      aluguel,
      condominio: 0,
      iptu: 0,
      contas: {
        luz: 0,
        agua: 0,
        gas: 0,
        internet: 0
      }
    }

    onAdd(novoImovel)
    setNome("")
    setAluguel(0)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        placeholder="Nome do imóvel"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <input
        type="number"
        placeholder="Aluguel"
        value={aluguel}
        onChange={(e) => setAluguel(Number(e.target.value))}
        className="border p-2 rounded w-full"
      />

      <button className="bg-black text-white px-4 py-2 rounded">
        Adicionar
      </button>
    </form>
  )
}