// Função para pegar latitude/longitude de um endereço em JF
async function getCoords(endereco: string) {
  // Adicionamos o "Juiz de Fora, MG" para o Nominatim não se perder
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco + ", Juiz de Fora, MG")}`;
  
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'SimuLar-App-Matheus' } // Boa prática para evitar bloqueio
    });
    const data = await res.json();
    return data.length > 0 ? { lat: data[0].lat, lon: data[0].lon } : null;
  } catch (error) {
    console.error("Erro no Geocoding:", error);
    return null;
  }
}

export async function calcularTemposJF(enderecoDestino: string) {
  // COORDENADAS PRECISAS (JF - MG)
  const coordsPai = { lat: -21.7612, lon: -43.3492 }; 
  const coordsTrampo = { lat: -21.7589, lon: -43.3514 }; 

  const origem = await getCoords(enderecoDestino);
  if (!origem) return null;

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

  return {
    tempoPai: await getRoute(coordsPai.lat, coordsPai.lon, 'driving'),
    tempoTrab: await getRoute(coordsTrampo.lat, coordsTrampo.lon, 'driving'),
    tempoApe: await getRoute(coordsTrampo.lat, coordsTrampo.lon, 'walking')
  };
}