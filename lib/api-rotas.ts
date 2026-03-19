async function getCoords(endereco: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco + ", Juiz de Fora, MG")}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'SimuLar-App-Matheus' } });
    const data = await res.json();
    return data.length > 0 ? { lat: Number(data[0].lat), lon: Number(data[0].lon) } : null;
  } catch (error) {
    return null;
  }
}

export async function calcularTemposJF(enderecoDestino: string) {
  const coordsPai = { lat: -21.7612, lon: -43.3492 }; 
  const coordsTrampo = { lat: -21.7589, lon: -43.3514 }; // Oscar Vidal, 274

  const origem = await getCoords(enderecoDestino);
  if (!origem) return null;

  const getRoute = async (toLat: number, toLon: number, mode: 'driving' | 'walking') => {
    try {
      const url = `https://router.project-osrm.org/route/v1/${mode}/${origem.lon},${origem.lat};${toLon},${toLat}?overview=false`;
      const res = await fetch(url);
      const data = await res.json();
      return data.routes ? Math.round(data.routes[0].duration / 60) : 0;
    } catch { return 0; }
  };

  return {
    tempoPaiCarro: await getRoute(coordsPai.lat, coordsPai.lon, 'driving'),
    tempoPaiApe: await getRoute(coordsPai.lat, coordsPai.lon, 'walking'),
    tempoTrabCarro: await getRoute(coordsTrampo.lat, coordsTrampo.lon, 'driving'),
    tempoTrabApe: await getRoute(coordsTrampo.lat, coordsTrampo.lon, 'walking')
  };
}