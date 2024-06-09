import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationPin, faMapPin, faFlag, faFlagCheckered, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import 'leaflet/dist/leaflet.css'
import ReactDOMServer from "react-dom/server";

export const createFontAwesomeMarkerIcon = (type) => {
    switch (type) {
        case "position":
            return L.divIcon({
                html: ReactDOMServer.renderToString(<FontAwesomeIcon style="text-shadow: 4px 4px 10px rgba(66, 68, 90, 1);" icon={faLocationDot} size="3x" />),
                className: 'custom-icon',
                iconSize: [32, 32], // Rozmiar ikony
                iconAnchor: [15, 36]
            });
        case "start":
            return L.divIcon({
                html: ReactDOMServer.renderToString(<FontAwesomeIcon style="text-shadow: 4px 4px 10px rgba(66, 68, 90, 1);" icon={faFlag} size="3x" />),
                className: 'text-red-500',
                iconSize: [32, 32],
                iconAnchor: [0, 36]
            });
        case "finish":
            return L.divIcon({
                html: ReactDOMServer.renderToString(<FontAwesomeIcon style="text-shadow: 4px 4px 10px rgba(66, 68, 90, 1);" icon={faFlagCheckered} size="3x" />),
                className: 'text-blue-500',
                iconSize: [32, 32],
                iconAnchor: [0, 36]
            });
        case "stop":
            return L.divIcon({
                html: ReactDOMServer.renderToString(<FontAwesomeIcon style="text-shadow: 4px 4px 10px rgba(66, 68, 90, 1);" icon={faMapPin} size="3x" />),
                className: 'text-primary-500',
                iconSize: [32, 32],
                iconAnchor: [15, 36]
            });
    }
};

function MapSetter({ zoom, center }) {
    const map = useMap();
    useEffect(() => {
        map.setView([center.lat, center.lng], zoom);
    }, [center, zoom]);

    return null;
}

export default MapSetter;
