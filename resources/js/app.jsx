import { useState } from 'react';
import MainScreen from './screens/MainScreen';
import AllRoutesScreen from './screens/AllRoutesScreen';
import ScreenNav from './components/ScreenNav';
import Stops from './components/Stops';
import CarManager from './components/CarManager';

export default function () {
    const [screen, setScreen] = useState(0);
    const [cmActive, setCMActive] = useState(false);

    const render = (screen) => {
        switch (screen) {
            case 0:
                return <MainScreen />
            case 1:
                return <AllRoutesScreen />
            case 2:
                return <Stops />
            default:
                return <MainScreen />
        }
    }

    return (
        <>
            {render(screen)}
            <ScreenNav setScreen={setScreen} screen={screen} setCMActive={setCMActive} />
            {cmActive ? <CarManager setCMActive={setCMActive} /> : null}
        </>
    )
}
