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

export async function calcularTemposJF(enderecoDestino: string) {
  // Coordenadas fixas (JF)
  const coordsPai = { lat: -21.7612, lon: -43.3492 }; 
  const coordsTrampo = { lat: -21.7589, lon: -43.3514 }; // Oscar Vidal, 274

  const origem = await getCoords(enderecoDestino);
  if (!origem) return null;

  // FUNÇÃO DE ROTA CORRIGIDA (OSRM usa 'car' e 'foot')
  const getRoute = async (toLat: number, toLon: number, mode: 'driving' | 'walking') => {
    try {
      // O segredo está aqui: 'car' para dirigir e 'foot' para caminhar
      const perfil = mode === 'driving' ? 'car' : 'foot';
      
      // A URL do OSRM público segue esse padrão: /route/v1/{perfil}/{coords}
      const url = `https://router.project-osrm.org/route/v1/${perfil}/${origem.lon},${origem.lat};${toLon},${toLat}?overview=false`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      // OSRM retorna a duração em SEGUNDOS, convertemos para MINUTOS
      if (data.routes && data.routes.length > 0) {
        return Math.round(data.routes[0].duration / 60);
      }
      return 0;
    } catch (error) { 
      console.error("Erro no OSRM:", error);
      return 0; 
    }
  };

  // Executa os cálculos (Usando await para garantir que cada um pegue seu perfil)
  const tPaiCarro = await getRoute(coordsPai.lat, coordsPai.lon, 'driving');
  const tPaiApe = await getRoute(coordsPai.lat, coordsPai.lon, 'walking');
  const tTrabCarro = await getRoute(coordsTrampo.lat, coordsTrampo.lon, 'driving');
  const tTrabApe = await getRoute(coordsTrampo.lat, coordsTrampo.lon, 'walking');

  return {
    tempoPaiCarro: tPaiCarro,
    tempoPaiApe: tPaiApe,
    tempoTrabCarro: tTrabCarro,
    tempoTrabApe: tTrabApe
  };
}