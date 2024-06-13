import React from "react";
import WithContext from "../hoc/WithContext";
import DebounceAutocompleteInput from "./DebounceAutocompleteInput";

function Header({ state, dispatch, searchTrip }) {
    const setFirstStop = (selected) => {
        dispatch({ type: "SET_FIRST_STOP", payload: selected });
    };

    const setSecondStop = (selected) => {
        dispatch({ type: "SET_SECOND_STOP", payload: selected });
    };

    return (
        <header className="z-30 relative">
            <nav className="topnav bg-primary-500 p-2 border-gray-200 px-4 lg:px-6 py-2.5">
                <div className="routing-form-wrapper flex flex-wrap justify-between gap-4 items-center mx-auto max-w-screen-xl">
                    <div className="text-lg text-white font-bold">
                        TRASOWNICZEK
                    </div>
                    <div className="routing-form flex gap-2">
                        <DebounceAutocompleteInput
                            setSelected={setFirstStop}
                        />

                        <DebounceAutocompleteInput
                            setSelected={setSecondStop}
                            disabled={!state.firstStop}
                        />

                        <button
                            className="shadow bg-accent-500 p-1 px-3 rounded-full text-white"
                            onClick={searchTrip}
                            disabled={!state.firstStop && !state.secondStop}
                        >
                            Szukaj
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default WithContext(Header);
