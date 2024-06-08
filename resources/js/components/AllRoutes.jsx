import React from "react";
import { useQuery } from "react-query";
import { MapContainer, TileLayer, Marker,Popup, useMap } from 'react-leaflet'

function AllRoutes() {
    const { isPending, error, data } = useQuery({
        queryKey: ["repoData"],
        queryFn: () =>
            fetch("/").then((res) =>
                res.json()
            ),
    });

    if (isPending) return 'Loading...';

    return <div>
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    </div>;
}

export default AllRoutes;
