"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// City coordinates
const CITY_COORDS: Record<string, { lat: number; lng: number; name: string }> = {
  auburn:        { lat: 38.8966, lng: -121.0769, name: "Auburn" },
  "grass-valley": { lat: 39.2185, lng: -121.06,   name: "Grass Valley" },
  "nevada-city":  { lat: 39.2616, lng: -121.0161, name: "Nevada City" },
  rocklin:       { lat: 38.7908, lng: -121.2358, name: "Rocklin" },
  newcastle:     { lat: 38.8755, lng: -121.1322, name: "Newcastle" },
  loomis:        { lat: 38.8213, lng: -121.1931, name: "Loomis" },
  roseville:     { lat: 38.7521, lng: -121.288,  name: "Roseville" },
};

// Trade → color mapping
const TRADE_COLORS: Record<string, { bg: string; border: string; label: string }> = {
  electricians:         { bg: "#f59e0b", border: "#d97706", label: "Electricians" },
  plumbers:             { bg: "#3b82f6", border: "#2563eb", label: "Plumbers" },
  roofers:              { bg: "#ef4444", border: "#dc2626", label: "Roofers" },
  hvac:                 { bg: "#10b981", border: "#059669", label: "HVAC" },
  "landscape":          { bg: "#22c55e", border: "#16a34a", label: "Landscape" },
  "general-contractors": { bg: "#8b5cf6", border: "#7c3aed", label: "General Contractors" },
  "concrete-contractors": { bg: "#6b7280", border: "#4b5563", label: "Concrete" },
  architects:           { bg: "#ec4899", border: "#db2777", label: "Architects" },
};

// Contractor data for map pins (generated from contractors.ts)
interface MapContractor {
  name: string;
  tradeSlug: string;
  primaryCity: string;
  additionalCities: string[];
}

const CONTRACTORS: MapContractor[] = [
  // Electricians
  { name: "JC Electrical", tradeSlug: "electricians", primaryCity: "auburn", additionalCities: ["newcastle", "loomis", "rocklin"] },
  { name: "Foothill Electric", tradeSlug: "electricians", primaryCity: "grass-valley", additionalCities: ["nevada-city"] },
  { name: "Placer Power Electric", tradeSlug: "electricians", primaryCity: "rocklin", additionalCities: ["roseville", "loomis"] },
  { name: "Gold Rush Wiring", tradeSlug: "electricians", primaryCity: "auburn", additionalCities: ["newcastle", "grass-valley"] },
  { name: "Sierra Spark Electric", tradeSlug: "electricians", primaryCity: "nevada-city", additionalCities: ["grass-valley"] },
  { name: "Roseville Electric Pros", tradeSlug: "electricians", primaryCity: "roseville", additionalCities: ["rocklin"] },
  // Plumbers
  { name: "Sierra Plumbing Co.", tradeSlug: "plumbers", primaryCity: "auburn", additionalCities: ["rocklin", "roseville", "loomis"] },
  { name: "NV County Plumbing", tradeSlug: "plumbers", primaryCity: "grass-valley", additionalCities: ["nevada-city"] },
  { name: "Foothills Plumbing & Drain", tradeSlug: "plumbers", primaryCity: "newcastle", additionalCities: ["auburn", "loomis"] },
  { name: "Roseville Rooter", tradeSlug: "plumbers", primaryCity: "roseville", additionalCities: ["rocklin"] },
  { name: "Gold Vein Plumbing", tradeSlug: "plumbers", primaryCity: "auburn", additionalCities: ["grass-valley", "newcastle"] },
  { name: "Loomis Plumbing Works", tradeSlug: "plumbers", primaryCity: "loomis", additionalCities: ["rocklin"] },
  // Roofers
  { name: "Gold Country Roofing", tradeSlug: "roofers", primaryCity: "auburn", additionalCities: ["grass-valley", "nevada-city", "newcastle"] },
  { name: "Sierra Top Roofing", tradeSlug: "roofers", primaryCity: "grass-valley", additionalCities: ["nevada-city"] },
  { name: "Placer Roofing Solutions", tradeSlug: "roofers", primaryCity: "rocklin", additionalCities: ["roseville", "loomis"] },
  { name: "Roseville Roofing Co.", tradeSlug: "roofers", primaryCity: "roseville", additionalCities: ["rocklin"] },
  { name: "Foothill Roof Masters", tradeSlug: "roofers", primaryCity: "auburn", additionalCities: ["newcastle", "loomis"] },
  // HVAC
  { name: "Auburn Heating & Air", tradeSlug: "hvac", primaryCity: "auburn", additionalCities: ["newcastle", "loomis", "rocklin"] },
  { name: "Sierra Climate Control", tradeSlug: "hvac", primaryCity: "grass-valley", additionalCities: ["nevada-city"] },
  { name: "Roseville Comfort HVAC", tradeSlug: "hvac", primaryCity: "roseville", additionalCities: ["rocklin", "loomis"] },
  { name: "NV City HVAC", tradeSlug: "hvac", primaryCity: "nevada-city", additionalCities: ["grass-valley"] },
  { name: "Placer Air Systems", tradeSlug: "hvac", primaryCity: "rocklin", additionalCities: ["roseville", "auburn"] },
  // Landscape
  { name: "Gold Country Tree Care", tradeSlug: "landscape", primaryCity: "auburn", additionalCities: ["newcastle", "grass-valley"] },
  { name: "Sierra Arbor Works", tradeSlug: "landscape", primaryCity: "nevada-city", additionalCities: ["grass-valley"] },
  { name: "Placer Tree Pros", tradeSlug: "landscape", primaryCity: "rocklin", additionalCities: ["roseville", "loomis"] },
  { name: "Loomis Tree Service", tradeSlug: "landscape", primaryCity: "loomis", additionalCities: ["newcastle", "auburn"] },
  { name: "Roseville Tree Experts", tradeSlug: "landscape", primaryCity: "roseville", additionalCities: ["rocklin"] },
  // General Contractors
  { name: "Auburn Builders", tradeSlug: "general-contractors", primaryCity: "auburn", additionalCities: ["newcastle", "grass-valley"] },
  { name: "Sierra Summit Construction", tradeSlug: "general-contractors", primaryCity: "grass-valley", additionalCities: ["nevada-city"] },
  { name: "Placer Home Builders", tradeSlug: "general-contractors", primaryCity: "rocklin", additionalCities: ["roseville", "loomis"] },
  { name: "Nevada City Remodel Co.", tradeSlug: "general-contractors", primaryCity: "nevada-city", additionalCities: ["grass-valley"] },
  { name: "Roseville General Contracting", tradeSlug: "general-contractors", primaryCity: "roseville", additionalCities: ["rocklin"] },
  { name: "Loomis Country Builders", tradeSlug: "general-contractors", primaryCity: "loomis", additionalCities: ["newcastle"] },
  // Concrete
  { name: "Gold Country Concrete", tradeSlug: "concrete-contractors", primaryCity: "auburn", additionalCities: ["newcastle", "loomis"] },
  { name: "Sierra Concrete Works", tradeSlug: "concrete-contractors", primaryCity: "grass-valley", additionalCities: ["nevada-city"] },
  { name: "Placer Flatwork", tradeSlug: "concrete-contractors", primaryCity: "rocklin", additionalCities: ["roseville"] },
  { name: "Roseville Concrete Co.", tradeSlug: "concrete-contractors", primaryCity: "roseville", additionalCities: ["rocklin", "loomis"] },
  { name: "Foothill Concrete Solutions", tradeSlug: "concrete-contractors", primaryCity: "auburn", additionalCities: ["grass-valley", "newcastle"] },
  // Architects
  { name: "Auburn Design Studio", tradeSlug: "architects", primaryCity: "auburn", additionalCities: ["newcastle", "grass-valley"] },
  { name: "Nevada County Architects", tradeSlug: "architects", primaryCity: "nevada-city", additionalCities: ["grass-valley"] },
  { name: "Placer Architectural Group", tradeSlug: "architects", primaryCity: "rocklin", additionalCities: ["roseville", "loomis"] },
  { name: "Roseville Home Design", tradeSlug: "architects", primaryCity: "roseville", additionalCities: ["rocklin"] },
  { name: "Grass Valley Design-Build", tradeSlug: "architects", primaryCity: "grass-valley", additionalCities: ["nevada-city", "auburn"] },
];

const CENTER = { lat: 38.7908, lng: -121.2358 }; // Rocklin, CA

// Deterministic pseudo-random offset so each contractor gets a unique but stable position near its city
function offsetForContractor(name: string, citySlug: string, index: number): { lat: number; lng: number } {
  let hash = 0;
  const seed = name + citySlug + index;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  const r = 0.015; // ~10% radius (~1 mile spread)
  const latOff = ((((hash & 0xff) / 255) * 2) - 1) * r;
  const lngOff = (((((hash >> 8) & 0xff) / 255) * 2) - 1) * r;
  return { lat: latOff, lng: lngOff };
}

interface GoldCountryMapProps {
  focusCitySlug?: string;
}

export default function GoldCountryMap({ focusCitySlug }: GoldCountryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const focusCity = focusCitySlug ? CITY_COORDS[focusCitySlug] : null;
    const mapCenter = focusCity
      ? [focusCity.lat, focusCity.lng] as [number, number]
      : [CENTER.lat, CENTER.lng] as [number, number];
    const mapZoom = focusCity ? 13 : 10;

    const map = L.map(mapRef.current, {
      center: mapCenter,
      zoom: mapZoom,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // City label markers (gold)
    const cityIcon = L.divIcon({
      className: "",
      html: `<div style="width:16px;height:16px;background:#b8860b;border:2px solid #8b6508;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.4)"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    Object.values(CITY_COORDS).forEach((city) => {
      L.marker([city.lat, city.lng], { icon: cityIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup(`<strong>${city.name}</strong>`);
    });

    // Filter contractors for city-specific pages
    const visibleContractors = focusCitySlug
      ? CONTRACTORS.filter(
          (c) => c.primaryCity === focusCitySlug || c.additionalCities.includes(focusCitySlug)
        )
      : CONTRACTORS;

    // Contractor pins scattered near their primary city
    const cityIndexes: Record<string, number> = {};

    visibleContractors.forEach((c) => {
      const city = CITY_COORDS[c.primaryCity];
      if (!city) return;

      const color = TRADE_COLORS[c.tradeSlug];
      if (!color) return;

      const idx = (cityIndexes[c.primaryCity + c.tradeSlug] || 0);
      cityIndexes[c.primaryCity + c.tradeSlug] = idx + 1;

      const offset = offsetForContractor(c.name, c.primaryCity, idx);

      const icon = L.divIcon({
        className: "",
        html: `<div style="width:10px;height:10px;background:${color.bg};border:2px solid ${color.border};border-radius:50%;box-shadow:0 1px 2px rgba(0,0,0,.3)"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });

      const citiesList = [c.primaryCity, ...c.additionalCities]
        .map((slug) => CITY_COORDS[slug]?.name || slug)
        .join(", ");

      L.marker([city.lat + offset.lat, city.lng + offset.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<strong>${c.name}</strong><br/><span style="color:${color.bg}">\u25CF</span> ${color.label}<br/><small>Serves: ${citiesList}</small>`
        );
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [focusCitySlug]);

  return (
    <div className="relative h-full w-full">
      <div
        ref={mapRef}
        className="h-full w-full rounded-lg"
        style={{ minHeight: 300 }}
      />
      <div className="absolute bottom-2 left-2 z-[1000] rounded bg-white/90 px-2 py-1 text-[10px] leading-tight shadow">
        {Object.entries(TRADE_COLORS).map(([, color]) => (
          <div key={color.label} className="flex items-center gap-1">
            <span style={{ color: color.bg }}>{"\u25CF"}</span>
            <span>{color.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
