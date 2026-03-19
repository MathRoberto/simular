import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Mostra pro Next.js onde tá o arquivo JSON
const filePath = path.join(process.cwd(), 'data', 'imoveis.json');

// Quando a tela PEDIR os dados (GET)
export async function GET() {
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    const imoveis = JSON.parse(fileData);
    return NextResponse.json(imoveis);
  } catch (error) {
    // Se o arquivo não existir ainda, devolve uma lista vazia
    return NextResponse.json([]);
  }
}

// Quando o formulário MANDAR salvar dados (POST)
export async function POST(request: Request) {
  try {
    const novaListaDeImoveis = await request.json();
    // Escreve a nova lista inteira no arquivo imoveis.json, formatando bonitinho com 2 espaços
    fs.writeFileSync(filePath, JSON.stringify(novaListaDeImoveis, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao salvar no JSON' }, { status: 500 });
  }
}