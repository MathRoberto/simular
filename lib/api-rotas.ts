// Função para pegar latitude/longitude de um endereço em JF
async function getCoords(endereco: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco + ", Juiz de Fora, MG")}`;
  
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'SimuLar-App-Matheus' }
    });
    const data = await res.json();
    return data.length > 0 ? { lat: Number(data[0].lat), lon: Number(data[0].lon) } : null;
  } catch (error) {
    console.error("Erro no Geocoding:", error);
    return null;
  }
}

export async function calcularTemposJF(enderecoDestino: string) {
  // PONTOS DE INTERESSE PRECISOS
  const coordsPai = { lat: -21.7612, lon: -43.3492 }; 
  const coordsTrampo = { lat: -21.7589, lon: -43.3514 }; // Rua Oscar Vidal, 274

  const origem = await getCoords(enderecoDestino);
  if (!origem) return null;

  // Função para pegar tempo (carro ou a pé) via OSRM
  const getRoute = async (toLat: number, toLon: number, mode: 'driving' | 'walking') => {
    try {
      const url = `https://router.project-osrm.org/route/v1/${mode}/${origem.lon},${origem.lat};${toLon},${toLat}?overview=false`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (!data.routes || data.routes.length === 0) return 0;
      
      // Converte segundos para minutos
      return Math.round(data.routes[0].duration / 60);
    } catch (error) {
      console.error(`Erro ao calcular rota ${mode}:`, error);
      return 0;
    }
  };

  // Agora calculamos os 4 cenários:
  return {
    tempoPaiCarro: await getRoute(coordsPai.lat, coordsPai.lon, 'driving'),
    tempoPaiApe: await getRoute(coordsPai.lat, coordsPai.lon, 'walking'), // NOVO: A pé pro seu pai
    tempoTrabCarro: await getRoute(coordsTrampo.lat, coordsTrampo.lon, 'driving'),
    tempoTrabApe: await getRoute(coordsTrampo.lat, coordsTrampo.lon, 'walking') // A pé pro trampo
  };
}