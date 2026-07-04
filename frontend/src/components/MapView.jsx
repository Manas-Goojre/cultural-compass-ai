import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const TYPE_STYLE = {
  stop: { emoji: "📍", ring: "#ff6a4d" },
  hotel: { emoji: "🏨", ring: "#8b7bff" },
  restaurant: { emoji: "🍽️", ring: "#22d3c5" },
  gem: { emoji: "💎", ring: "#f4c56a" },
};

function makeIcon(type) {
  const s = TYPE_STYLE[type] || TYPE_STYLE.stop;
  return L.divIcon({
    className: "cc-marker",
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:34px;height:34px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      background:rgba(12,19,34,0.92);border:2px solid ${s.ring};
      box-shadow:0 4px 12px rgba(0,0,0,0.5);font-size:16px;">
      <span style="transform:rotate(45deg)">${s.emoji}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32],
  });
}

function isValid(pt) {
  return pt && Number.isFinite(pt.lat) && Number.isFinite(pt.lng) && !(pt.lat === 0 && pt.lng === 0);
}

function FitBounds({ points }) {
  const map = useMap();
  useMemo(() => {
    if (!points.length) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 12);
    } else {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [points, map]);
  return null;
}

// Reusable map. Accepts { points:[{name,type,lat,lng,day}], routes:[[[lat,lng],...]] }
export default function MapView({ points = [], routes = [], height = 420 }) {
  const valid = useMemo(() => points.filter(isValid), [points]);
  const center = valid.length ? [valid[0].lat, valid[0].lng] : [20, 0];

  if (!valid.length) {
    return (
      <div
        className="glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm"
        style={{ height }}
      >
        🗺️ No mappable coordinates for this trip yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden glass-card" style={{ height }}>
      <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%", background: "#0c1322" }} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        {routes.map((line, i) => (
          <Polyline key={i} positions={line} pathOptions={{ color: "#ff8a72", weight: 3, opacity: 0.7, dashArray: "6 8" }} />
        ))}
        {valid.map((p, i) => (
          <Marker key={i} position={[p.lat, p.lng]} icon={makeIcon(p.type)}>
            <Popup>
              <div style={{ minWidth: 140 }}>
                <strong>{p.name}</strong>
                <div style={{ fontSize: 12, opacity: 0.7, textTransform: "capitalize" }}>
                  {(TYPE_STYLE[p.type]?.emoji || "📍")} {p.type || "stop"}
                  {p.day ? ` · Day ${p.day}` : ""}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <FitBounds points={valid} />
      </MapContainer>
    </div>
  );
}
