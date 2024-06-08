import React from "react";
import { useQuery } from "react-query";
import { MapContainer, TileLayer } from 'react-leaflet'
import SingleRoute from "../components/SingleRoute";

function AllRoutesScreen() {
    const { isLoading, error, data } = useQuery({
        queryKey: ["bigMapData"],
        queryFn: () =>
            fetch("/api/get-described-routes").then((res) =>
                res.json()
            )
    });

    if (isLoading) return 'Loading...';
    if (error) return 'Error';

    return <div>
        <MapContainer center={[50.049683, 19.944544]} zoom={9} scrollWheelZoom={false}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data.map((route,j) => (<SingleRoute key={j} route={route}></SingleRoute>))}
        </MapContainer>
    </div>;
}

export default AllRoutesScreen;
