import React from 'react'
import { Marker, Popup } from 'react-leaflet';
import SingleRoute from './SingleRoute';

function SelectedRoute({selectedRoute}) {
  return (
    <>
        <SingleRoute
            route={selectedRoute}
            color={selectedRoute}
        ></SingleRoute>
        {selectedRoute.stops.map((stop, j) => (
            <Marker
                key={j}
                position={{
                    lat: stop.stop_lat,
                    lon: stop.stop_lon,
                }}
            >
                <Popup>{stop.stop_name}</Popup>
            </Marker>
        ))}
    </>
  )
}

export default SelectedRoute
