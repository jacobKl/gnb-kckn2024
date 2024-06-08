import React from "react";
import { Polyline } from 'react-leaflet'
import { useQuery } from 'react-query'


function SingleRoute({ route }) {
    const shapesById = route.shapes.reduce((acc, shape) => {
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
