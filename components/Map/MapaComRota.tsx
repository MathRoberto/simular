"use client";

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

const L_Any = L as any;

// Forçamos o TypeScript a entender que são tuplas de [latitude, longitude]
const DESTINOS: Record<string, [number, number]> = { 
  trabalho: [-21.7610, -43.3501], 
  casaPai: [-21.7515, -43.3555] 
};

const RoutingEngine = ({ endereco, tipoRota, color }: any) => {
  const map = useMap();
  const routingControlRef = useRef<any>(null);
  const [coords, setCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!endereco) return;
    const q = `${endereco}, Juiz de Fora, MG, Brasil`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Garantimos que coords é uma tupla de [lat, lon]
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      })
      .catch(() => {
        console.warn("Rede bloqueada ou erro ao buscar endereço.");
      });
  }, [endereco]);

  useEffect(() => {
    if (!map || !coords) return;

    try {
      const pontoDestino = DESTINOS[tipoRota as keyof typeof DESTINOS];

      const routingControl = L_Any.Routing.control({
        // Usamos o 'as any' ou garantimos que coords é uma tupla
        waypoints: [
          L.latLng(coords as [number, number]), 
          L.latLng(pontoDestino)
        ],
        lineOptions: {
          styles: [{ color: color, opacity: 0.8, weight: 6 }],
          addWaypoints: false
        },
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        containerClassName: 'hidden',
        show: false // Silencia os erros no console
      }).addTo(map);

      routingControlRef.current = routingControl;

      routingControl.on('routesfound', (e: any) => {
        const bounds = L.latLngBounds(e.routes[0].coordinates);
        map.fitBounds(bounds, { padding: [40, 40] });
      });

    } catch (err) {
      console.error("Erro interno do Leaflet Routing:", err);
    }

    return () => {
      if (map && routingControlRef.current) {
        try {
          map.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        } catch (e) {
          // Ignora erros de remoção
        }
      }
    };
  }, [map, coords, tipoRota, color]);

  return coords ? <Marker position={coords} /> : null;
};

export default function MapaComRota({ endereco, tipoRota }: any) {
  const corRota = tipoRota === 'trabalho' ? '#9333ea' : '#c026d3';

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-purple-900/30 relative bg-[#050505]">
      <MapContainer 
        center={[-21.76, -43.35]} 
        zoom={13} 
        scrollWheelZoom={false} 
        className="w-full h-full" 
        zoomControl={false}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; OpenStreetMap'
        />
        <Marker position={DESTINOS[tipoRota as keyof typeof DESTINOS]} />
        <RoutingEngine endereco={endereco} tipoRota={tipoRota} color={corRota} />
      </MapContainer>
    </div>
  );
}