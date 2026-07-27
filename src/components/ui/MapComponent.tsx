import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js/Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different types
const alertIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const shelterIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapProps {
  disasters: any[];
  shelters: any[];
}

export default function MapComponent({ disasters, shelters }: MapProps) {
  // Center roughly on Taiwan
  const center: [number, number] = [23.6978, 120.9605];
  const defaultZoom = 7;

  return (
    <MapContainer 
      center={center} 
      zoom={defaultZoom} 
      style={{ height: '100%', width: '100%', zIndex: 10 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Plot Disasters */}
      {disasters.map((d) => {
        // Fallback coordinate mapping if backend doesn't provide lat/lng directly
        // In a real scenario, d.location.latitude would be used.
        // We simulate a location near Taiwan if missing for demo purposes, 
        // but prefer actual backend data.
        let lat = d.location?.latitude || d.latitude || 23.6978;
        let lng = d.location?.longitude || d.longitude || 120.9605;
        
        return (
          <Marker key={`dis-${d.id}`} position={[lat, lng]} icon={alertIcon}>
            <Popup>
              <div className="font-sans">
                <strong className="text-red-600 block text-base mb-1">{d.name || d.title || d.type || 'Disaster Alert'}</strong>
                <span className="text-gray-600 text-sm">{d.status} • {d.severity} Priority</span>
              </div>
            </Popup>
            <Circle center={[lat, lng]} radius={15000} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }} />
          </Marker>
        );
      })}

      {/* Plot Shelters */}
      {shelters.map((s) => {
        let lat = s.location?.latitude || s.latitude || 23.6978;
        let lng = s.location?.longitude || s.longitude || 120.9605;

        return (
          <Marker key={`sh-${s.id}`} position={[lat, lng]} icon={shelterIcon}>
            <Popup>
              <div className="font-sans">
                <strong className="text-green-600 block text-base mb-1">{s.name}</strong>
                <span className="text-gray-600 text-sm">{s.currentOccupancy} / {s.capacity} Occupancy</span>
                <br />
                <span className="text-gray-500 text-xs mt-1 block">Status: {s.status}</span>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
