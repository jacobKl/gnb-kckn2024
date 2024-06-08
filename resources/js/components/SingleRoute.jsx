import React from "react";
import { Polyline } from 'react-leaflet'
import { useQuery } from 'react-query'


function SingleRoute({ route, routeColor }) {
    const { isLoading, error, data } = useQuery({
        queryKey: [`route-${route.route_id}-shapes`],
        queryFn: () => fetch("/api/get-shapes-by-route/" + route.route_id).then((res) => res.json()),
    });

    if (isLoading) return;

    const shapesById = data.reduce((acc, shape) => {
        if (!acc[shape.shape_id]) {
            acc[shape.shape_id] = [];
        }
        acc[shape.shape_id].push([shape.shape_pt_lat, shape.shape_pt_lon]);
        return acc;
    }, {});

    return <>
        {Object.values(shapesById).map((shapePoints, index) => (
            <Polyline key={index} positions={shapePoints} color={`#${route.route_color}`} />
        ))}
    </>;
}

export default SingleRoute;
