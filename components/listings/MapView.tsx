"use client";

import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { NIGERIA_CENTER } from "@/lib/constants";

// Fix default marker icon issue with bundlers
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapViewProps {
  lat?: number | null;
  lng?: number | null;
  popup?: string;
  height?: string;
  zoom?: number;
}

export function MapView({ lat, lng, popup, height = "256px", zoom = 13 }: MapViewProps) {
  const center: [number, number] = lat && lng ? [lat, lng] : [NIGERIA_CENTER.lat, NIGERIA_CENTER.lng];

  return (
    <div style={{ height }} className="overflow-hidden rounded-xl border border-gray-200">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lat && lng && (
          <Marker position={[lat, lng]} icon={icon}>
            {popup && <Popup>{popup}</Popup>}
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
