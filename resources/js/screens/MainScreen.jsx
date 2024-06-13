import React, { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
} from "react-leaflet";
import { useUserLocation } from "./../hooks/useUserLocation";
import { useQuery } from "react-query";
import DebounceAutocompleteInput from "./../components/DebounceAutocompleteInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap, faXmark, faLeaf, faTree } from "@fortawesome/free-solid-svg-icons";
import MapSetter, { createFontAwesomeMarkerIcon } from "../components/MapSetter";
import Loader from "../components/Loader";

const parseTime = (time) => {
    const part = time.substr(0, 5).split(':');
    return `${parseInt(part[0]) % 24}:${part[1]}`;
}

const getDescription = (track) => {
    const desc = [];

    [...track].reverse().forEach(step => {
        if (desc.filter(item => item.name == step.route_short_name).length == 0) {
            desc.push({ name: step.route_short_name, stop: step.stop_name, arrive: parseTime(step.arrival_time) })
        }
    });
    return desc.reverse();
}

function MainScreen() {
    const [location] = useUserLocation();

    const [selectedRoute, setSelectedRoute] = useState();
    const [firstStop, setFirstStop] = useState();
    const [secondStop, setSecondStop] = useState();
    const [tripSearched, setTripSearched] = useState(false);
    const [zoom, setZoom] = useState(12);
    const [center, setCenter] = useState({ lat: 50.049683, lng: 19.944544 });
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState([]);

    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ["routeData"],
        queryFn: () =>
            fetch(`/api/find-route?start_stop_id=${firstStop.stop_id}&end_stop_id=${secondStop.stop_id}`).then(
                (res) => res.json().then((res) => {
                    setSelectedRoute(res.trips[0])
                })
            ),
        enabled: false,
    });

    useEffect(() => {
        if (selectedRoute) {
            setZoom(13);
            setCenter({ lat: selectedRoute[0].stop_lat, lng: selectedRoute[0].stop_lon });
        }
    }, [selectedRoute])

    const searchTrip = async () => {
        refetch();
        if (localStorage.getItem("user_car") != null) {
            let lscar = JSON.parse(localStorage.getItem("user_car"))
            let emissionsResponse = await fetch("/api/calculate-emission", {
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
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }).then(res => res.json())
            setModalData(emissionsResponse);
            setShowModal(true);
        }
        setTripSearched(true);
    };

    if (isLoading) return <Loader />;

    return (
        <div className="main">
            <header className="z-30 relative">
                <nav className="topnav bg-primary-500 p-2 border-gray-200 px-4 lg:px-6 py-2.5">
                    <div className="routing-form-wrapper flex flex-wrap justify-between gap-4 items-center mx-auto max-w-screen-xl">
                        <div className="text-lg text-white font-bold">
                            TRASOWNICZEK
                        </div>
                        <div className="routing-form flex gap-2">
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
                                disabled={!firstStop && !secondStop}
                            >
                                Szukaj
                            </button>
                        </div>
                    </div>
                </nav>
            </header>
            {
                selectedRoute ? (
                    <div className="fixed w-full bottom-[70px] bg-white z-40 flex p-1 gap-2">
                        {getDescription(selectedRoute).map(step => (
                            <div className="flex items-center">
                                <div
                                    className="text-bold border w-[50px] h-[50px] flex items-center justify-center">{step.name}</div>
                                <div className="ps-2">
                                    <div className="text-sm">{step.stop}</div>
                                    <div className="text-sm text-gray-500">{step.arrive}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null
            }
            {tripSearched ? (
                <a
                    target="_blank"
                    className="fixed bottom-[140px] z-30  bg-white right-4 rounded shadow p-3"
                    href={`https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lon}&destination=${firstStop.stop_lat},${firstStop.stop_lon}&travelmode=driving`}
                >
                    <FontAwesomeIcon icon={faMap} />
                </a>
            ) : null}
            <MapContainer
                className="mapcontainer"
                center={[50.049683, 19.944544]}
                zoom={12}
                scrollWheelZoom={false}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {location ? <Marker position={location} icon={createFontAwesomeMarkerIcon("position")}></Marker> : null}
                {selectedRoute ? selectedRoute.map((stop, j) => (
                    <>
                        <Marker
                            icon={createFontAwesomeMarkerIcon(j == 0 ? "finish" : j == selectedRoute.length - 1 ? "start" : "stop")}
                            key={`${j}`}
                            position={{
                                lat: stop.stop_lat,
                                lon: stop.stop_lon,
                            }}
                        >
                            <Popup>{stop.stop_name}</Popup>
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
            {showModal && (
                <div className='carmanager bg-primary-500 rounded-3xl text-white flex justify-end flex-col min-w-96'>
                    <div className='flex flex-row justify-between items-center p-3'>
                        <span className='flex text-lg pl-2 text-center'>Brawo!</span>
                        <button className='rounded-full flex justify-center items-center bg-primary-100 w-10 h-10 aspect-ratio-1' onClick={() => setShowModal(false)}><FontAwesomeIcon size="2x" icon={faXmark} /></button>
                    </div>
                    <div className='bg-primary-300 rounded-3xl p-8 text-center'>
                        <p>Wybór transportu publicznego zamiast samochodu zaoszczędził na tej trasie: <br /> {modalData.calculatedEmissionDiff.toFixed(2)}g CO2</p>
                        <div className="text-green-500"><FontAwesomeIcon icon={faLeaf} /><FontAwesomeIcon icon={faTree} /></div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MainScreen;
