import React, {useState} from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    Polyline,
} from "react-leaflet";
import {useUserLocation} from "./../hooks/useUserLocation";
import {useQuery} from "react-query";
import DebounceAutocompleteInput from "./../components/DebounceAutocompleteInput";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMap} from "@fortawesome/free-solid-svg-icons";
import MapSetter, {createFontAwesomeMarkerIcon} from "../components/MapSetter";
import Loader from "../components/Loader";
import {calcTimeToSeconds} from "../components/Stops";

const parseTime = (time) => {
    const part = time.substr(0, 5).split(':');
    return `${parseInt(part[0]) % 24}:${part[1]}`;
}

const getDescription = (track) => {
    const desc = [];

    track.reverse().forEach(step => {
        if (desc.filter(item => item.name == step.route_short_name).length == 0) {
            desc.push({name: step.route_short_name, stop: step.stop_name, arrive: parseTime(step.arrival_time)})
        }
    });
    return desc.reverse();
}

function MainScreen() {
    const [location] = useUserLocation();
    const [selectedRoute, setSelectedRoute] = useState(null);

    const [firstStop, setFirstStop] = useState();
    const [secondStop, setSecondStop] = useState();
    const [tripSearched, setTripSearched] = useState(false);
    const [zoom, setZoom] = useState(12);
    const [center, setCenter] = useState({lat: 50.049683, lng: 19.944544});
    const [showModal, setShowModal] = useState(false); // Added state variable for modal visibility

    const {isLoading, error, data, refetch} = useQuery({
        queryKey: ["routeData"],
        queryFn: () =>
            fetch(`/api/find-route?start_stop_id=${firstStop.stop_id}&end_stop_id=${secondStop.stop_id}`).then(
                (res) => res.json()
            ),
        enabled: false,
    });

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
            console.log(emissionsResponse)
            setShowModal(true); // Show the modal
        }
        setTripSearched(true);
    };

    if (isLoading) return <Loader/>;

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
                                disabled={!firstStop && !secondStop}
                            >
                                Szukaj
                            </button>
                        </div>
                    </div>
                </nav>
            </header>
            {/* <div className="fixed w-[90%] flex top-[70px] gap-1 z-30 overflow-y-scroll left-[5%]"> */}
                {/* {data ? data.trips.sort((a, b) => calcTimeToSeconds(a.departure_time) - calcTimeToSeconds(b.departure_time)).map((track, j) => (
                    <p className="bg-white p-2 cursor-pointer" key={j} onClick={() => handleRouteSelection(data.trips)}>
                        {parseTime(track.departure_time)}
                    </p>
                )) : null} */}
            {/* </div> */}
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
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
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
                <MapSetter zoom={zoom} center={center}/>
            </MapContainer>
            {showModal && (
                <div id="default-modal" tabIndex="-1" aria-hidden="true"
                     className="fixed inset-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div
                                className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Terms of Service
                                </h3>
                                <button type="button"
                                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                        data-modal-hide="default-modal"
                                        onClick={() => setShowModal(false)}
                                >
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                         fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                              stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="p-4 md:p-5 space-y-4">
                                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                    With less than a month to go before the European Union enacts new consumer privacy
                                    laws
                                    for its citizens, companies around the world are updating their terms of service
                                    agreements to comply.
                                </p>
                                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                    The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect
                                    on
                                    May 25 and is meant to ensure a common set of data rights in the European Union. It
                                    requires organizations to notify users as soon as possible of high-risk data
                                    breaches
                                    that could personally affect them.
                                </p>
                            </div>
                            <div
                                className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                <button data-modal-hide="default-modal" type="button"
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={() => setShowModal(false)} // Hide the modal
                                >
                                    I accept
                                </button>
                                <button data-modal-hide="default-modal" type="button"
                                        className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                        onClick={() => setShowModal(false)} // Hide the modal
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MainScreen;
