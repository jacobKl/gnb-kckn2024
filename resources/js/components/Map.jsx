import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import MapSetter from "./MapSetter";

function Map({center, zoom, children}) {
    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {children}

            <MapSetter zoom={zoom} center={center} />
        </MapContainer>
    );
}

export default Map;
