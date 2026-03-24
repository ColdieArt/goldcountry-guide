"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const CITIES: { name: string; lat: number; lng: number }[] = [
  { name: "Auburn", lat: 38.8966, lng: -121.0769 },
  { name: "Grass Valley", lat: 39.2185, lng: -121.06 },
  { name: "Nevada City", lat: 39.2616, lng: -121.0161 },
  { name: "Rocklin", lat: 38.7908, lng: -121.2358 },
  { name: "Newcastle", lat: 38.8755, lng: -121.1322 },
  { name: "Loomis", lat: 38.8213, lng: -121.1931 },
  { name: "Roseville", lat: 38.7521, lng: -121.288 },
];

const CENTER = { lat: 39.0, lng: -121.14 };

export default function GoldCountryMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [CENTER.lat, CENTER.lng],
      zoom: 10,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const goldIcon = L.divIcon({
      className: "",
      html: `<div style="width:14px;height:14px;background:#b8860b;border:2px solid #8b6508;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.4)"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    CITIES.forEach((city) => {
      L.marker([city.lat, city.lng], { icon: goldIcon })
        .addTo(map)
        .bindPopup(`<strong>${city.name}</strong>`);
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="h-full w-full rounded-lg"
      style={{ minHeight: 300 }}
    />
  );
}
