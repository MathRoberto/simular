async function getCoords(endereco: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco + ", Juiz de Fora, MG")}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'SimuLar-App-Matheus' } });
    const data = await res.json();
    if (!data || data.length === 0) return null;
    return { lat: Number(data[0].lat), lon: Number(data[0].lon) };
  } catch (error) {
    return null;
  }
}

async function getRoute(
  origemLat: number, origemLon: number,
  toLat: number, toLon: number,
  mode: 'driving' | 'walking'
) {
  try {
    const perfil = mode === 'driving' ? 'driving' : 'walking';
    const url = `https://router.project-osrm.org/route/v1/${perfil}/${origemLon},${origemLat};${toLon},${toLat}?overview=false`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      return Math.round(data.routes[0].duration / 60);
    }
    return 0;
  } catch {
    return 0;
  }
}

export type Destino = {
  id: string;
  nome: string;
  endereco: string;
};

export type TempoDestino = {
  destinoId: string;
  destinoNome: string;
  carro: number;
  ape: number;
};

export async function calcularTemposParaDestinos(
  enderecoOrigem: string,
  destinos: Destino[]
): Promise<TempoDestino[] | null> {
  const origem = await getCoords(enderecoOrigem);
  if (!origem) return null;

  const resultados: TempoDestino[] = [];

  for (const destino of destinos) {
    const coordsDestino = await getCoords(destino.endereco);
    if (!coordsDestino) {
      resultados.push({
        destinoId: destino.id,
        destinoNome: destino.nome,
        carro: 0,
        ape: 0,
      });
      continue;
    }

    const carro = await getRoute(origem.lat, origem.lon, coordsDestino.lat, coordsDestino.lon, 'driving');
    const ape = await getRoute(origem.lat, origem.lon, coordsDestino.lat, coordsDestino.lon, 'walking');

    resultados.push({
      destinoId: destino.id,
      destinoNome: destino.nome,
      carro,
      ape,
    });
  }

  return resultados;
}

// Mantido para compatibilidade legada (caso precise)
export async function calcularTemposJF(enderecoDestino: string) {
  const coordsPai = { lat: -21.7612, lon: -43.3492 };
  const coordsTrampo = { lat: -21.7589, lon: -43.3514 };

  const origem = await getCoords(enderecoDestino);
  if (!origem) return null;

  const tempoPaiCarro = await getRoute(origem.lat, origem.lon, coordsPai.lat, coordsPai.lon, 'driving');
  const tempoPaiApe = await getRoute(origem.lat, origem.lon, coordsPai.lat, coordsPai.lon, 'walking');
  const tempoTrabCarro = await getRoute(origem.lat, origem.lon, coordsTrampo.lat, coordsTrampo.lon, 'driving');
  const tempoTrabApe = await getRoute(origem.lat, origem.lon, coordsTrampo.lat, coordsTrampo.lon, 'walking');

  return { tempoPaiCarro, tempoPaiApe, tempoTrabCarro, tempoTrabApe };
}