import { useState } from 'react';
import MainScreen from './screens/MainScreen';
import AllRoutesScreen from './screens/AllRoutesScreen';

export default function () {
    const [screen, setScreen] = useState(0);

    const render = (screen) => {
        switch(screen) {
            case 0:
                return <MainScreen/>
            case 1:
                return <AllRoutesScreen/>
            default:
                return <MainScreen/>
        }
    }

    return (
        <>
            <button onClick={() => setScreen(0)}>Main screen</button>
            <button onClick={() => setScreen(1)}>All routes screen</button>
            {render(screen)}
        </>
    )
}
