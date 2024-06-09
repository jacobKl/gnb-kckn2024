import React, { useEffect } from "react";
import { useMap } from "react-leaflet";

function MapSetter({ zoom, center }) {
    const map = useMap();
    useEffect(() => {
        map.setView([center.lat, center.lng], zoom);
    }, [center, zoom]);

    return null;
}

export default MapSetter;
