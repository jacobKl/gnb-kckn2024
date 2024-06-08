<?php

namespace App\Services;

use App\Models\Routes;
use App\Models\Stop;
use App\Models\StopTime;
use Illuminate\Database\Eloquent\Collection;

class RouteService
{
    /**
     * Get all routes.
     *
     * @return Collection
     */
    public function getRoutes()
    {
        return Routes::all();
    }

    /**
     * Get all stops.
     *
     * @return Collection
     */
    public function getStops()
    {
        return Stop::all();
    }

    public function findRoute(string $startStopId, string $endStopId): array
    {
        $stops = Stop::all();
        $stopsMap =[];

        foreach ($stops as $stop) {
            $stopsMap[$stop->stop_id] = $stop;
        }

        //get all trips which have stop starts
        $potentialStartTrips = StopTime::where('stop_id', $startStopId)->pluck('trip_id');

        //Group trip ids to stops
        $startTripsWithStops = collect(StopTime::whereIn("trip_id", $potentialStartTrips)->get()->all())
            ->groupBy(fn(StopTime $stopTime) => $stopTime->trip_id);

        //get all trips which have stop ends
        $potentialEndTrips = StopTime::where('stop_id', $endStopId)->pluck('trip_id');

        //group trip ids to stops
        $endTripsWithStops = collect(StopTime::whereIn("trip_id", $potentialEndTrips)->get()->all())
            ->groupBy(fn(StopTime $stopTime) => $stopTime->trip_id);

        //check if there is some
        $directConnections = $potentialStartTrips->intersect($potentialEndTrips);

        if ($directConnections->isNotEmpty()) {
            $filteredDirectTrips = collect();
            foreach ($directConnections as $tripId) {
                $startStop = $startTripsWithStops->get($tripId)->filter(function (StopTime $stopTime) use ($startStopId) {
                    return $stopTime->stop_id == $startStopId;
                })->first();
                $endStop = $endTripsWithStops->get($tripId)->filter(function (StopTime $stopTime) use ($endStopId) {
                    return $stopTime->stop_id == $endStopId;
                })->first();

                if ($startStop->stop_sequence < $endStop->stop_sequence) {
                    $filteredDirectTrips->push($startTripsWithStops->get($tripId)
                        ->filter(function (StopTime $stopTime) use ($startStop, $endStop) {
                            return $stopTime->stop_sequence >= $startStop->stop_sequence && $stopTime->stop_sequence <= $endStop->stop_sequence;
                        })
                        ->map(function (StopTime $stopTime) use ($stopsMap) {
                        return [...$stopTime->toArray(), "stop_name" => $stopsMap[$stopTime->stop_id]->stop_name,
                            "stop_lat" => $stopsMap[$stopTime->stop_id]->stop_lat,
                            "stop_lon" => $stopsMap[$stopTime->stop_id]->stop_lon];
                    })

                    );
                }
            }
            if ($filteredDirectTrips->isNotEmpty()) {
                return [
                    'route' => 'direct',
                    'trips' => $filteredDirectTrips
                ];
            }
        }

        $connection = [];

        //foreach start trip with stops
        foreach ($startTripsWithStops as $startTripId => $startStops) {
            //foreach end trip with stops
            foreach ($endTripsWithStops as $endTripId => $endStops) {
                //get desired destination
                $destination = $endStops->filter(fn(StopTime $stopTime) => $stopTime->stop_id == $endStopId)->first();

                $startStopMappedToStops = $startStops->map(function (StopTime $stopTime) {
                    return $stopTime->stop_id;
                });

                $endStopMappedToStops = $endStops->map(function (StopTime $stopTime) {
                    return $stopTime->stop_id;
                });
                //get intersection between startStop and endStops
                $intersection = $startStopMappedToStops->intersect($endStopMappedToStops);

                //if intersection is not empty (which means you can change trip)
                if ($intersection->isNotEmpty()) {
                    foreach ($intersection as $intersectionId)
                        $currentlyChecked = $endStops->filter(fn(StopTime $stopTime) => $stopTime->stop_id == $intersectionId)->first();
                    if ($currentlyChecked->stop_sequence < $destination->stop_sequence) {
                        $connection[$startTripId][] = ["start" => $startStops->map(function (StopTime $stopTime) use ($stopsMap) {
                            return [...$stopTime->toArray(),
                                "stop_name" => $stopsMap[$stopTime->stop_id]->stop_name,
                                "stop_lat" => $stopsMap[$stopTime->stop_id]->stop_lat,
                                "stop_lon" => $stopsMap[$stopTime->stop_id]->stop_lon];
                        }),
                            "end" => $endStops->map(function (StopTime $stopTime) use ($stopsMap) {
                                return [...$stopTime->toArray(),
                                    "stop_name" => $stopsMap[$stopTime->stop_id]->stop_name,
                                    "stop_lat" => $stopsMap[$stopTime->stop_id]->stop_lat,
                                    "stop_lon" => $stopsMap[$stopTime->stop_id]->stop_lon];
                            })];
                        break;
                    }
                }
            }
        }


        return [
            'route' => 'change',
            'trips' => $connection
        ];
    }
}
