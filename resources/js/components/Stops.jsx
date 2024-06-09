import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { faRoute, faArrowDown, faArrowRight, faArrowLeft, faArrowsLeftRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const calcTimeToSeconds = (h) => {
    let hSplitted = h.split(":")
    return parseInt(hSplitted[0]) * 3600 + parseInt(hSplitted[1]) * 60 + parseInt(hSplitted[2])
}

function Stops() {
    const [chosenRoute, chooseRoute] = useState(false);
    const [chosenDirection, changeDirection] = useState("right");
    const [stops, setStops] = useState(false);
    const [chosenTrip, chooseTrip] = useState(false);
    const [stopRoutes, setStopRoutes] = useState(false);
    const [chosenStop, chooseStop] = useState(false);
    const [stopsPair, setStopsPair] = useState(false);
    const [slicedStops, setSlicedStops] = useState(false);

    const { isLoading, error, data } = useQuery({
        queryKey: ["routesData"],
        queryFn: () =>
            fetch("/api/routes").then((res) =>
                res.json()
            )
    });

    const getStops = async (name) => {
        console.log(name);
        let stopsResponse = await fetch("https://kckn24.ddev.site/api/get-stops-by-route-name/" + name).then(res => res.json());
        let higherDimensionStopsResponse = []
        for (let i = 0; i < stopsResponse.length; i += 2) {
            higherDimensionStopsResponse.push({ stops: [], direction: "right" })
        }
        for (let i = 0; i < stopsResponse.length; i++) {
            higherDimensionStopsResponse[i % (stopsResponse.length / 2)].stops.push(stopsResponse[i])
        }
        console.log(higherDimensionStopsResponse);

        chooseTrip(false);
        setStopRoutes(false);
        chooseStop(false);
        setStops(higherDimensionStopsResponse);
        setSlicedStops(higherDimensionStopsResponse[0])
        setStopsPair(0)
    }

    const getStopRoutes = async (name) => {
        console.log("https://kckn24.ddev.site/api/get-routes-by-string/" + encodeURIComponent(name));
        let routesResponse = await fetch("https://kckn24.ddev.site/api/get-routes-by-string/" + encodeURIComponent(name)).then(res => res.json());
        chooseStop(name);
        setStopRoutes(routesResponse.reduce((acc, current) => {
            if (!acc.some(obj => obj.route_short_name === current.route_short_name)) {
                acc.push(current);
            }
            return acc;
        }, []));
    }

    const changeSelectedRoute = (routeId) => {
        setSlicedStops(stops[routeId])
        setStopsPair(routeId);
    }

    if (isLoading) return 'Loading...';

    console.log(data);

    return (
        <div className='stopy bg-primary-500'>
            <div className='bg-primary-500'>

                <div className=''>
                    {data.sort(
                        (a, b) => (a.route_short_name > b.route_short_name ? 1 : -1))
                        .reduce((acc, current) => {
                            if (!acc.some(obj => obj.route_short_name === current.route_short_name)) {
                                acc.push(current);
                            }
                            return acc;
                        }, [])
                        .map(route => (<button
                            onClick={() => getStops(route.route_short_name)}
                            className='bg-accent-500 p-1 m-1 rounded text-white'
                            key={route.id}>
                            {route.route_short_name}
                        </button>)
                        )
                    }
                </div>
                {stops ?
                    <div>
                        {stops.map((stop, idx) => (<button key={idx} className={`${stopsPair == idx ? "bg-accent-500" : "bg-[#7077A1]"} p-1 m-1 rounded text-white`} onClick={stopsPair == idx ? () => changeDirection(chosenDirection == "right" ? "left" : "right") : () => changeSelectedRoute(idx)}>{stop.stops[0].route_long_name.split("-")[0].trim()} {stopsPair == idx ? chosenDirection == "right" ? <FontAwesomeIcon icon={faArrowRight} /> : <FontAwesomeIcon icon={faArrowLeft} /> : <FontAwesomeIcon icon={faArrowsLeftRight} />} {stop.stops[0].route_long_name.split("-")[2].trim()}</button>))}
                        <div className='flex flex-row overflow-x-auto'>
                            {slicedStops ? slicedStops.stops[["right", "left"].indexOf(chosenDirection)].trips.sort((a, b) => (calcTimeToSeconds(a.times[0].departure_time) - calcTimeToSeconds(b.times[0].departure_time))).map((el, idx) => (
                                <div onClick={() => chooseTrip(el)} className='bg-accent-500 m-1 rounded-md cursor-pointer text-nowrap text-white' key={idx}>
                                    <FontAwesomeIcon className='w-full my-4' size="3x" icon={faRoute} />
                                    <div className='bg-accent-300 rounded-md p-2'>
                                        <p>Odjazd {el.times[0].departure_time}</p>
                                        <p className='font-semibold'>{el.times[0].stop.stop_name}</p>
                                        <FontAwesomeIcon className='my-2' icon={faArrowDown} />
                                        <p>Przyjazd {el.times[el.times.length - 1].arrival_time}</p>
                                        <p className='font-semibold'>{el.times[el.times.length - 1].stop.stop_name}</p>
                                    </div>
                                </div>
                            )) : null}
                        </div>
                    </div>
                    : null}
                {chosenTrip ?
                    <div>
                        {chosenTrip.times.map((el => (
                            <div key={el.id} className='bg-[#2D3250] p-1 m-1 rounded text-white'><p >{el.stop_sequence}: {el.departure_time} - <button onClick={() => getStopRoutes(el.stop.stop_name)}>{el.stop.stop_name}</button>{stopRoutes && chosenStop == el.stop.stop_name ? stopRoutes.map((cr) => <button key={cr.id} onClick={() => getStops(cr.route_short_name)} className='bg-[#EC8432] p-1 m-1 rounded text-white'>{cr.route_short_name}</button>) : null}</p></div>
                        )))}
                    </div>
                    :
                    null
                }
            </div>
        </div>
    )
}

export default Stops
