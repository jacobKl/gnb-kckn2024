import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import Header from "../components/Header";
import { useUserLocation } from './../hooks/useUserLocation'

function MainScreen() {
    const [ location, error ] = useUserLocation();

    return (
        <>
            <Header />
            {/* <MapContainer
                center={[50.049683, 19.944544]}
                zoom={9}
                scrollWheelZoom={false}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {
                    location ? (<Marker position={location}></Marker>) : null
                }
            </MapContainer> */}
        </>
    );
}

export default MainScreen;
