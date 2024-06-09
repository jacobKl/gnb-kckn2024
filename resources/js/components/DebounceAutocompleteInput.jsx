import React, { useState, useEffect } from "react";
import { getStopsByPrefix } from "../utils/api";

function DebounceAutocompleteInput({ setSelected, setTripSearched, disabled }) {
    const [searchPhrase, setSearchPhrase] = useState("");
    const [matchedLocations, setMatchedLocations] = useState("");
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        if (searchPhrase && !finished) {
            const delayDebounceFn = setTimeout(async () => {
                const response = await getStopsByPrefix(searchPhrase);
                setMatchedLocations(response);
                setTripSearched(false)
            }, 1000);

            return () => clearTimeout(delayDebounceFn);
        }
    }, [searchPhrase]);

    const handleSearchInput = (e) => {
        setFinished(false);
        setSearchPhrase(e.target.value);
    };

    const select = (location) => {
        setSelected(location);
        setFinished(true);
        setSearchPhrase(location.stop_name);
    }

    return (
        <>
            <div className="relative">
                <input
                    className="bg-primary-100 rounded-full text-white placeholder:text-primary-500 p-1 pl-2 border-none shadow appearance-none"
                    type="search"
                    placeholder="Lokalizacja"
                    value={searchPhrase}
                    onInput={(e) => handleSearchInput(e)}
                    disabled={disabled}
                />
                {(matchedLocations && !finished) ? (
                    <ol className="absolute top-100 w-full shadow max-input-height overflow-scroll">
                        {matchedLocations.map((location, j) => (
                            <li className="bg-white p-2 text-sm cursor-pointer" onClick={() => select(location)} key={j}>{location.stop_name}</li>
                        ))}
                    </ol>
                ) : null}
            </div>
        </>
    );
}

export default DebounceAutocompleteInput;
