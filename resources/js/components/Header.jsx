import React from "react";
import { useState, useEffect } from "react";
import DebounceAutocompleteInput from "./DebounceAutocompleteInput";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMap } from '@fortawesome/free-solid-svg-icons'

function Header() {
    const [firstStop, setFirstStop] = useState();
    const [secondStop, setSecondStop] = useState();
    const [tripSearched, setTripSearched] = useState(false);

    const searchTrip = () => {
        setTripSearched(true);
    };

    return (
        <>
            <header className="z-30 relative">
                <nav className="bg-white p-2 border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                    <div className="flex flex-wrap justify-between gap-4 items-center mx-auto max-w-screen-xl">
                        <div>a</div>
                        <div>
                            <DebounceAutocompleteInput setTripSearched={setTripSearched} setSelected={setFirstStop} />
                            {firstStop ? (
                                <DebounceAutocompleteInput
                                    setTripSearched={setTripSearched}
                                    setSelected={setSecondStop}
                                />
                            ) : null}
                            {firstStop && secondStop ? (
                                <button
                                    className="shadow bg-green-500 p-1 px-2 rounded text-white"
                                    onClick={searchTrip}
                                >
                                    Szukaj
                                </button>
                            ) : null}
                        </div>
                        <button>a</button>
                    </div>
                </nav>
            </header>
            {tripSearched ? (
                <a
                    target="_blank"
                    className="fixed bottom-20 z-30  bg-white right-4 rounded shadow p-3"
                    href={`https://www.google.com/maps/dir/?api=1&origin=${firstStop.stop_lat},${firstStop.stop_lon}&destination=${secondStop.stop_lat},${secondStop.stop_lon}&travelmode=driving`}
                >
                    <FontAwesomeIcon icon={faMap} />
                </a>
            ) : null}
        </>
    );
}

export default Header;
