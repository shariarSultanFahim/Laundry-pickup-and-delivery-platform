"use client";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { useEffect, useMemo, useRef, useState } from "react";

import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { Button } from "../ui";

// Fix for default marker icon missing in Leaflet + Next.js
// This ensures the marker icon appears correctly without needing external assets.
const icon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

// Helper component to recenter map when position changes
function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

interface MapProps {
  showMap?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
}

export default function LeafletMap({ showMap = true, onLocationSelect }: MapProps) {
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);
  const [loading, setLoading] = useState(false);

  const markerRef = useRef<L.Marker>(null);

  const handleLocateMe = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos: [number, number] = [latitude, longitude];
        setPosition(newPos);
        setLoading(false);
        if (onLocationSelect) onLocationSelect(latitude, longitude);
      },
      () => {
        setLoading(false);
      }
    );
  };

  // Automatically get user location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos: [number, number] = [latitude, longitude];
        setPosition(newPos);
        if (onLocationSelect) onLocationSelect(latitude, longitude);
      },
      () => {
        // Error handler - silently fail on mount
      }
    );
  }, [onLocationSelect]);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
          if (onLocationSelect) onLocationSelect(lat, lng);
        }
      }
    }),
    [onLocationSelect]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-start">
        <Button type="button" onClick={handleLocateMe} disabled={loading}>
          {loading ? "Locating..." : "📍 Use My GPS"}
        </Button>
      </div>
      {showMap && (
        <div className="relative z-0 h-100 w-full overflow-hidden rounded-lg border border-gray-300">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              draggable={true}
              eventHandlers={eventHandlers}
              position={position}
              ref={markerRef}
              icon={icon}
            >
              <Popup>Drag me to adjust location!</Popup>
            </Marker>
            <Recenter lat={position[0]} lng={position[1]} />
          </MapContainer>
        </div>
      )}
    </div>
  );
}
