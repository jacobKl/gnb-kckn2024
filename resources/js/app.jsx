import { useState } from 'react';
import MainScreen from './screens/MainScreen';
import AllRoutesScreen from './screens/AllRoutesScreen';
import ScreenNav from './components/ScreenNav';
import Stops from './components/Stops';

export default function () {
    const [screen, setScreen] = useState(0);

    const render = (screen) => {
        switch (screen) {
            case 0:
                return <MainScreen />
            case 1:
                return <AllRoutesScreen />
            default:
                return <MainScreen />
        }
    }

    return (
        <>
            {render(screen)}
            <ScreenNav setScreen={setScreen} screen={screen} />
            <Stops></Stops>
        </>
    )
}
