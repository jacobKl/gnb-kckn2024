import React, { useReducer } from "react";

export const AppContext = React.createContext({});

const reducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'SET_FIRST_STOP':
            return {
                ...state,
                firstStop: payload
            }
        case 'SET_SECOND_STOP':
            return {
                ...state,
                secondStop: payload
            }
        default:
            return {
                ...state
            }
    }
};

function AppContextProvider({children}) {
    const [state, dispatch] = useReducer(reducer, {
        firstStop: '',
        secondStop: '',
        tripSearched: false
    });

    return <AppContext.Provider value={{state, dispatch}}>{children}</AppContext.Provider>;
}

export default AppContextProvider;
