import React from "react";
import { useState, useEffect } from "react";
import DebounceAutocompleteInput from "./DebounceAutocompleteInput";

function Header() {
    const [firstStop, setFirstStop] = useState();
    const [secondStop, setSecondStop] = useState();

    const searchTrip = () => {
        console.log(firstStop, secondStop);
    }

    return (
        <header>
            <nav className="bg-white p-2 border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div className="flex flex-wrap gap-4 items-center mx-auto max-w-screen-xl">
                    <DebounceAutocompleteInput setSelected={setFirstStop} />
                    {firstStop ? <DebounceAutocompleteInput setSelected={setSecondStop} /> : null}
                    {(firstStop && secondStop) ? <button className="shadow bg-green-500 p-1 px-2 rounded text-white" onClick={searchTrip}>Szukaj</button> : null}
                </div>
            </nav>
        </header>
    );
}

export default Header;
