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
import MapSetter, { createFontAwesomeMarkerIcon } from "../components/MapSetter";
import Loader from "../components/Loader";
import { calcTimeToSeconds } from "../components/Stops";

const parseTime = (time) => {
    const part = time.substr(0, 5).split(':');
    return `${parseInt(part[0]) % 24}:${part[1]}`;
}

const getDescription = (track) => {
    const desc = [];

    track.reverse().forEach(step => {
        if (desc.filter(item => item.name == step.route_short_name).length == 0) {
            desc.push({ name: step.route_short_name, stop: step.stop_name, arrive: parseTime(step.arrival_time) })
        }
    });
    return desc;
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
            fetch(`/api/find-route?start_stop_id=2388&end_stop_id=1271`).then(
                (res) => res.json()
            ),
        enabled: false,
    });

    const searchTrip = async () => {
        refetch();
        if (localStorage.getItem("user_car") != null) {
            let csrfToken = document.head.querySelector("[name~=csrf_token][content]").content;
            let lscar = JSON.parse(localStorage.getItem("user_car"))
            let emissionsResponse = await fetch("/api/get-calculated-emission", {
                method: "POST",
                body: JSON.stringify({
                    latitudeFrom: firstStop.stop_lat,
                    longitudeFrom: firstStop.stop_lon,
                    latitudeTo: secondStop.stop_lat,
                    longitudeTo: secondStop.stop_lon,
                    engineCapacity: lscar.displacement,
                    fuelConsumption: lscar.consumption
                }),
                headers: {
                    'Content-Type': 'Application/Json',
                    'Access-Control-Allow-Origin': '*'
                }
            }).then(res => res.json())
            console.log(emissionsResponse)
        }
        setTripSearched(true);
    };

    if (isLoading) return <Loader />;

    const handleRouteSelection = (track) => {
        console.log(track)
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
                <nav className="bg-primary-500 p-2 border-gray-200 px-4 lg:px-6 py-2.5">
                    <div className="flex flex-wrap justify-between gap-4 items-center mx-auto max-w-screen-xl">
                        <div className="text-lg text-white font-bold">
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
                                className="shadow bg-accent-500 p-1 px-3 rounded-full text-white"
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
                {data ? data.trips.sort((a, b) => calcTimeToSeconds(a.departure_time) - calcTimeToSeconds(b.departure_time)).map((track, j) => (
                    <p className="bg-white p-2 cursor-pointer" key={j} onClick={() => handleRouteSelection(data.trips)}>
                        {parseTime(track.departure_time)}
                    </p>
                )) : null}
            </div>
            {
                selectedRoute ? (
                    <div className="fixed w-full bottom-[70px] bg-white z-40 flex p-1 gap-2">
                        {getDescription(selectedRoute).map(step => (
                            <div className="flex items-center">
                                <div className="text-bold border w-[50px] h-[50px] flex items-center justify-center">{step.name}</div>
                                <div className="ps-2">
                                    <div className="text-sm">{step.stop}</div>
                                    <div className="text-sm text-gray-500">{step.arrive}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null
            }
            {/* {tripSearched ? (
                <a
                    target="_blank"
                    className="fixed bottom-20 z-30  bg-white right-4 rounded shadow p-3"
                    href={`https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lon}&destination=${secondStop.stop_lat},${secondStop.stop_lon}&travelmode=driving`}
                >
                    <FontAwesomeIcon icon={faMap} />
                </a>
            ) : null} */}
            <MapContainer
                center={[50.049683, 19.944544]}
                zoom={12}
                scrollWheelZoom={false}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {location ? <Marker position={location} icon={createFontAwesomeMarkerIcon("position")}></Marker> : null}
                {selectedRoute ? selectedRoute.map((stop, j) => (
                    <>
                        <Marker
                            icon={createFontAwesomeMarkerIcon(j == 0 ? "start" : j == selectedRoute.length - 1 ? "finish" : "stop")}
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
            {/* {cmDisplayed ? <CarManager displayCM={changeCMDisplay} /> : null} */}
        </div>
    );
}

export default MainScreen;
