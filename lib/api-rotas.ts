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
  const coordsPai = { lat: -21.7612, lon: -43.3492 }; 
  const coordsTrampo = { lat: -21.7589, lon: -43.3514 }; 

  const origem = await getCoords(enderecoDestino);
  if (!origem) return null;

  const getRoute = async (toLat: number, toLon: number, mode: 'driving' | 'walking') => {
    try {
      // Mudança aqui: Usando strings diretas que o router.project-osrm.org aceita
      const perfil = mode === 'driving' ? 'driving' : 'walking';
      
      const url = `https://router.project-osrm.org/route/v1/${perfil}/${origem.lon},${origem.lat};${toLon},${toLat}?overview=false`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        return Math.round(data.routes[0].duration / 60);
      }
      return 0;
    } catch (error) { 
      return 0; 
    }
  };

  // Rodando um por um para não dar conflito de requisição no servidor gratuito
  const tempoPaiCarro = await getRoute(coordsPai.lat, coordsPai.lon, 'driving');
  const tempoPaiApe = await getRoute(coordsPai.lat, coordsPai.lon, 'walking');
  const tempoTrabCarro = await getRoute(coordsTrampo.lat, coordsTrampo.lon, 'driving');
  const tempoTrabApe = await getRoute(coordsTrampo.lat, coordsTrampo.lon, 'walking');

  return {
    tempoPaiCarro,
    tempoPaiApe,
    tempoTrabCarro,
    tempoTrabApe
  };
}