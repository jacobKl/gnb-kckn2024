import React from "react";
import { useQuery } from "react-query";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import SingleRoute from "./SingleRoute";

function AllRoutes() {
    const { isLoading, error, data } = useQuery({
        queryKey: ["routesData"],
        queryFn: () =>
            fetch("/api/routes").then((res) =>
                res.json()
            )
    });

    if (isLoading) return 'Loading...';

    return <div>
        <MapContainer center={[50.049683, 19.944544]} zoom={9} scrollWheelZoom={false}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data.map((route,j) => (<SingleRoute key={j} route={route}></SingleRoute>))}
        </MapContainer>
    </div>;
}

export default AllRoutes;