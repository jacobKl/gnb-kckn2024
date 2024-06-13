import React, { useState } from "react";
import { useQuery } from "react-query";

import SingleRoute from "../components/SingleRoute";
import Loader from "../components/Loader";
import SelectedRoute from "../components/SelectedRoute";
import Map from "../components/Map";
import RoutesSidebar from "../components/RoutesSidebar";

import { posessRoutesData } from "../utils/api";

const INITIAL_COORDS = { lat: 50.049683, lng: 19.944544 };

function AllRoutesScreen() {
    const [ selectedRoute, setSelectedRoute ] = useState(null);

    const { isLoading, error, data } = useQuery({
        queryKey: ["all-routes-data"],
        queryFn: () => posessRoutesData()
    });

    if (isLoading) return <Loader />;

    if (error) return <Error />;

    const handleClick = (route) => {
        setSelectedRoute(route);
    };

    return (
        <div className="flex flex-row allroutes">
            <RoutesSidebar routes={data} handleClick={handleClick} />

            <div className="basis-3/4 h-full">
                <Map zoom={9} center={INITIAL_COORDS}>
                    {selectedRoute ? (
                       <SelectedRoute selectedRoute={selectedRoute} />
                    ) : (
                        data.map((route, j) => (<SingleRoute key={j} route={route}></SingleRoute>))
                    )}
                </Map>
            </div>
        </div>
    );
}

export default AllRoutesScreen;
