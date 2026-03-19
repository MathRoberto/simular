// Função para pegar latitude/longitude de um endereço em JF
async function getCoords(endereco: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco + ", Juiz de Fora, MG")}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.length > 0 ? { lat: data[0].lat, lon: data[0].lon } : null;
}

export async function calcularTemposJF(enderecoDestino: string) {
  const coordsPai = { lat: -21.7612, lon: -43.3492 }; 
  const coordsTrampo = { lat: -21.7595, lon: -43.3510 }; 

  const origem = await getCoords(enderecoDestino);
  if (!origem) return null;

  // Função genérica para pegar tempo (carro ou a pé)
  const getRoute = async (toLat: number, toLon: number, mode: 'driving' | 'walking') => {
    const res = await fetch(`https://router.project-osrm.org/route/v1/${mode}/${origem.lon},${origem.lat};${toLon},${toLat}?overview=false`);
    const data = await res.json();
    return Math.round(data.routes[0].duration / 60);
  };

  return {
    tempoPai: await getRoute(coordsPai.lat, coordsPai.lon, 'driving'),
    tempoTrab: await getRoute(coordsTrampo.lat, coordsTrampo.lon, 'driving'),
    tempoApe: await getRoute(coordsTrampo.lat, coordsTrampo.lon, 'walking') // Adicionamos aqui!
  };
}