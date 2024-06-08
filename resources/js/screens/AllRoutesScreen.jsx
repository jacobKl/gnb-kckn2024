import React, { useState } from "react";
import { useQuery } from "react-query";
import { MapContainer, TileLayer } from "react-leaflet";
import SingleRoute from "../components/SingleRoute";

function AllRoutesScreen() {
    const [selectedRoute, setSelectedRoute] = useState(null);
    const { isLoading, error, data } = useQuery({
        queryKey: ["bigMapData"],
        queryFn: () =>
            fetch("/api/get-described-routes").then((res) => res.json()),
    });

    if (isLoading) return "Loading...";
    if (error) return "Error";

    const handleClick = (route) => {
        if (!selectedRoute) {
            setSelectedRoute(route);
            return;
        }

        if (route.id == selectedRoute.id) setSelectedRoute(null);
        else setSelectedRoute(route);
    };

    return (
        <div className="flex flex-row">
            <div className="bg-white p-2 rounded shadow basis-1/4">
                {data.map((route, j) => (
                    <div
                        className="bg-white my-4 rounded flex flex-col text-center items-center cursor-pointer"
                        key={j}
                        onClick={() => handleClick(route)}
                    >
                        <div className="text-xl font-bold">
                            {route.route_short_name}
                        </div>
                        <div className="ps-2 text-sm text-gray-500">
                            {route.route_long_name}
                        </div>
                    </div>
                ))}
            </div>
            <div className="basis-3/4 h-full">
                <MapContainer
                    center={[50.049683, 19.944544]}
                    zoom={9}
                    scrollWheelZoom={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {selectedRoute ? (
                        <SingleRoute route={selectedRoute} color={selectedRoute}></SingleRoute>
                    ) : (
                        data.map((route, j) => (
                            <SingleRoute key={j} route={route}></SingleRoute>
                        ))
                    )}
                </MapContainer>
            </div>
        </div>
    );
}

export default AllRoutesScreen;
