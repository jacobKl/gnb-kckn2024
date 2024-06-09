import React, { useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    Polyline,
} from "react-leaflet";
import { useUserLocation } from "./../hooks/useUserLocation";
import { useQuery } from "react-query";
import DebounceAutocompleteInput from "./../components/DebounceAutocompleteInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-solid-svg-icons";
import MapSetter from "../components/MapSetter";
import Loader from "../components/Loader";
import { calcTimeToSeconds } from "../components/Stops";

const parseTime = (time) => {
    const part = time.substr(0, 5).split(':');
    return `${parseInt(part[0]) % 24}:${part[1]}`;
}

function MainScreen() {
    const [location] = useUserLocation();
    const [selectedRoute, setSelectedRoute] = useState(null);

    const [firstStop, setFirstStop] = useState();
    const [secondStop, setSecondStop] = useState();
    const [tripSearched, setTripSearched] = useState(false);
    const [zoom, setZoom] = useState(12);
    const [center, setCenter] = useState({ lat: 50.049683, lng: 19.944544 });

    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ["routeData"],
        queryFn: () =>
            fetch(`/api/find-route?start_stop_id=${firstStop.stop_id}&end_stop_id=${firstStop.stop_id}`).then(
                (res) => res.json()
            ),
        enabled: false,
    });

    const searchTrip = () => {
        refetch();
        setTripSearched(true);
    };

    if (isLoading) return <Loader />;

    const handleRouteSelection = (track) => {
        setSelectedRoute(track);
        setZoom(13);
        setCenter({
            lat: track[0].stop_lat,
            lng: track[0].stop_lon
        });
    }

    return (
        <div className="main">
            <header className="z-30 relative">
                <nav className="bg-white p-2 border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                    <div className="flex flex-wrap justify-between gap-4 items-center mx-auto max-w-screen-xl">
                        <div className="text-lg font-bold text-white">
                            TRASOWNICZEK
                        </div>
                        <div className="flex gap-2">
                            <DebounceAutocompleteInput
                                setTripSearched={setTripSearched}
                                setSelected={setFirstStop}
                            />

                            <DebounceAutocompleteInput
                                setTripSearched={setTripSearched}
                                setSelected={setSecondStop}
                                disabled={!firstStop}
                            />

                            <button
                                className="shadow bg-green-500 p-1 px-2 rounded text-white"
                                onClick={searchTrip}
                                // disabled={!firstStop && !secondStop}
                            >
                                Szukaj
                            </button>
                        </div>
                    </div>
                </nav>
            </header>
            <div className="fixed w-[90%] flex top-[70px] gap-1 z-30 overflow-y-scroll left-[5%]">
                {data ? data.trips.sort((a,b) => calcTimeToSeconds(a[0].departure_time) - calcTimeToSeconds(b[0].departure_time)).map((track, j) => (
                    <p className="bg-white p-2 cursor-pointer" key={j} onClick={() => handleRouteSelection(track)}>
                        {parseTime(track[0].departure_time)}
                    </p>
                )) : null}
            </div>
            {tripSearched ? (
                <a
                    target="_blank"
                    className="fixed bottom-20 z-30  bg-white right-4 rounded shadow p-3"
                    href={`https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lon}&destination=${secondStop.stop_lat},${secondStop.stop_lon}&travelmode=driving`}
                >
                    <FontAwesomeIcon icon={faMap} />
                </a>
            ) : null}
            <MapContainer
                center={[50.049683, 19.944544]}
                zoom={12}
                scrollWheelZoom={false}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                { location ? <Marker position={location}></Marker> : null }
                { selectedRoute ? selectedRoute.map((stop, j) => (
                    <>
                        <Marker
                            key={`${j}`}
                            position={{
                                lat: stop.stop_lat,
                                lon: stop.stop_lon,
                            }}
                        >
                            <Popup>{stop.stop_name}</Popup>
                            <Polyline key={j} positions={[]}></Polyline>
                        </Marker>
                        {j < selectedRoute.length - 1 ? (
                            <Polyline
                                key={`polyline-${j}`}
                                color={`${stop.is_intersection ? 'red' : 'blue'}`}
                                positions={[
                                    [stop.stop_lat, stop.stop_lon],
                                    [
                                        selectedRoute[j + 1].stop_lat,
                                        selectedRoute[j + 1].stop_lon,
                                    ],
                                ]}
                            ></Polyline>
                        ) : null}
                    </>
                )) : null}
                <MapSetter zoom={zoom} center={center} />
            </MapContainer>
        </div>
    );
}

export default MainScreen;
