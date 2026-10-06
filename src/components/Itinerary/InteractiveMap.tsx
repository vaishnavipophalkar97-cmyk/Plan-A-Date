import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ItineraryStop } from '../../types/index.js';
import { Maximize2, RotateCcw } from 'lucide-react';

interface InteractiveMapProps {
  stops: ItineraryStop[];
  activeStopIndex: number | null;
  onSelectStop: (index: number) => void;
  startLocation: { name: string; lat: number; lng: number };
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  stops,
  activeStopIndex,
  onSelectStop,
  startLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Function to fit all markers
  const fitAllMarkers = () => {
    if (!mapInstanceRef.current) return;
    const latLngs: L.LatLngExpression[] = stops
      .filter((s) => typeof s.lat === 'number' && typeof s.lng === 'number' && !isNaN(s.lat))
      .map((s) => [s.lat, s.lng]);

    if (startLocation.lat && startLocation.lng && !isNaN(startLocation.lat)) {
      latLngs.push([startLocation.lat, startLocation.lng]);
    }

    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center map around start location or first stop
    const centerLat = Number(stops[0]?.lat) || Number(startLocation.lat) || 22.6808;
    const centerLng = Number(stops[0]?.lng) || Number(startLocation.lng) || 75.8331;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 13,
      scrollWheelZoom: false,
    });

    // Use reliable OpenStreetMap tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Invalidate size immediately, after 100ms, and after 400ms to guarantee zero grey tiles in iframe
    requestAnimationFrame(() => {
      map.invalidateSize();
    });
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 450);

    // Add Start Location Marker
    if (startLocation.lat && startLocation.lng && !isNaN(startLocation.lat)) {
      const startIcon = L.divIcon({
        className: 'custom-start-marker',
        html: `<div style="background-color: #1c1917; color: #fff; border-radius: 9999px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.35);">⚲</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      L.marker([startLocation.lat, startLocation.lng], { icon: startIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; padding: 2px;">
            <b style="color: #1c1917;">Starting Point</b><br/>
            <span>${startLocation.name}</span>
          </div>
        `);
    }

    // Add Stop Markers
    markersRef.current = [];
    const validLatLngs: L.LatLngExpression[] = [];

    stops.forEach((stop, index) => {
      if (typeof stop.lat !== 'number' || typeof stop.lng !== 'number' || isNaN(stop.lat)) return;

      validLatLngs.push([stop.lat, stop.lng]);

      const isSelected = activeStopIndex === index;
      const markerHtml = `
        <div style="background-color: ${isSelected ? '#047857' : '#065F46'}; color: white; border-radius: 9999px; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; border: 2.5px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.28); cursor: pointer; transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'}; transition: transform 0.2s;">
          ${stop.order}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-stop-marker',
        html: markerHtml,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([stop.lat, stop.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; max-width: 210px; padding: 2px;">
            <div style="font-weight: 700; color: #065F46; font-size: 13px; margin-bottom: 2px;">${stop.order}. ${stop.name}</div>
            <div style="color: #57534E; font-size: 11px; margin-bottom: 4px;">${stop.time} · ${stop.type}</div>
            <div style="color: #78716C; font-size: 11px; line-height: 1.3;">${stop.address}</div>
          </div>
        `);

      marker.on('click', () => {
        onSelectStop(index);
      });

      markersRef.current.push(marker);
    });

    // Draw routing line connecting stops
    if (validLatLngs.length > 1) {
      polylineRef.current = L.polyline(validLatLngs, {
        color: '#059669',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '6, 8',
      }).addTo(map);
    }

    // Fit bounds nicely with padding
    if (validLatLngs.length > 0) {
      const bounds = L.latLngBounds(validLatLngs);
      if (startLocation.lat && startLocation.lng && !isNaN(startLocation.lat)) {
        bounds.extend([startLocation.lat, startLocation.lng]);
      }
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }

    setMapLoaded(true);

    // Resize observer to keep map sharp even if window changes
    let resizeObserver: ResizeObserver | null = null;
    if (window.ResizeObserver && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (resizeObserver) resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [stops, startLocation]);

  // Center on active stop when changed
  useEffect(() => {
    if (
      activeStopIndex !== null &&
      stops[activeStopIndex] &&
      mapInstanceRef.current &&
      markersRef.current[activeStopIndex]
    ) {
      const stop = stops[activeStopIndex];
      mapInstanceRef.current.flyTo([stop.lat, stop.lng], 15, { duration: 0.8 });
      markersRef.current[activeStopIndex].openPopup();
    }
  }, [activeStopIndex, stops]);

  return (
    <div className="relative w-full h-[340px] sm:h-[430px] rounded-2xl overflow-hidden border border-stone-200 shadow-2xs bg-[#f4eee5]">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Top right badges & control */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        <button
          onClick={fitAllMarkers}
          className="bg-white/95 hover:bg-white text-stone-800 p-1.5 rounded-lg border border-stone-200 shadow-2xs text-xs flex items-center gap-1 transition-all"
          title="Recenter and show all stops"
        >
          <RotateCcw className="w-3.5 h-3.5 text-stone-700" />
          <span className="hidden sm:inline text-[11px] font-medium">Recenter</span>
        </button>

        <div className="bg-white/95 backdrop-blur-xs text-[11px] font-medium text-stone-700 px-2.5 py-1.5 rounded-lg border border-stone-200/80 shadow-2xs">
          {stops.length} Outing Stops
        </div>
      </div>
    </div>
  );
};
