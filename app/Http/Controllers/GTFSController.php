<?php

namespace App\Http\Controllers;

use App\Models\Routes;
use App\Models\Shapes;
use App\Models\Stop;
use App\Models\StopTime;
use App\Models\Trips;
use App\Services\EmissionModelService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class GTFSController extends Controller
{
    protected EmissionModelService $emissionModelService;

    public function __construct(EmissionModelService $emissionModelService)
    {
        $this->emissionModelService = $emissionModelService;
    }

    public function getShapesByRoute($routeId): JsonResponse
    {
        // Fetch the trips for the given route
        $trips = Trips::where('route_id', $routeId)->get();

        // Collect all shape IDs from the trips
        $shapeIds = $trips->pluck('shape_id')->unique();

        // Fetch all shapes points for these shape IDs
        $shapes = Shapes::whereIn('shape_id', $shapeIds)->orderBy('shape_pt_sequence')->get();

        return response()->json($shapes);
    }

    public function getRoutes(Request $request): JsonResponse
    {
        $routes = Routes::all();

        return response()->json($routes);
    }

    public function getStopsForRoute(int $routeId): JsonResponse
    {
        // Fetch the trips for the given route
        $trips = Trips::where('route_id', $routeId)->get();

        // Collect all trip IDs from the trips
        $tripIds = $trips->pluck('trip_id');

        // Fetch all stop times for these trip IDs
        $stopTimes = StopTime::whereIn('trip_id', $tripIds)->get();

        // Collect all unique stop IDs from the stop times
        $stopIds = $stopTimes->pluck('stop_id')->unique();

        // Fetch all stops for these stop IDs
        $stops = Stop::whereIn('stop_id', $stopIds)->get();

        return response()->json($stops);
    }

    public function getStopsForRouteName(string $name): JsonResponse
    {
        $routes = Routes::query()
            ->where('route_short_name', $name)
            ->get();

        // Fetch the trips for the given route
        $trips = Trips::whereIn('route_id', $routes->pluck('route_id'))->get();

        // Collect all trip IDs from the trips
        $tripIds = $trips->pluck('trip_id');

        // Fetch all stop times for these trip IDs
        $stopTimes = StopTime::query()
            ->whereIn('trip_id', $tripIds)
            ->get();

        // Collect all unique stop IDs from the stop times
        $stopIds = $stopTimes->pluck('stop_id')->unique();

        // Fetch all stops for these stop IDs
        $stops = Stop::whereIn('stop_id', $stopIds)->get();

        foreach ($stopTimes as $time) {
            $time->stop = $stops->where('stop_id', $time->stop_id)->first();
        }

        foreach ($trips as $trip) {
            $trip->times = $stopTimes->where('trip_id', $trip->trip_id)->values()->toArray();
        }

        foreach ($routes as $route) {
            $route->trips = $trips->where('route_id', $route->route_id)->values()->toArray();
        }

        return response()->json($routes);
    }

    public function getRoutesWithStops(Request $request): JsonResponse
    {
        $routes = Routes::all();

        foreach ($routes as $route) {
            // Fetch the trips for the given route
            $trips = Trips::where('route_id', $route->route_id)->get();

            // Collect all trip IDs from the trips
            $tripIds = $trips->pluck('trip_id');

            // Fetch all stop times for these trip IDs
            $stopTimes = StopTime::whereIn('trip_id', $tripIds)->get();

            // Collect all unique stop IDs from the stop times
            $stopIds = $stopTimes->pluck('stop_id')->unique();

            // Fetch all stops for these stop IDs
            $stops = Stop::whereIn('stop_id', $stopIds)->get();

            // Collect all shape IDs from the trips
            $shapeIds = $trips->pluck('shape_id')->unique();

            // Fetch all shapes points for these shape IDs
            $shapes = Shapes::whereIn('shape_id', $shapeIds)->orderBy('shape_pt_sequence')->get();

            // Attach stops and shapes to the route
            $route->stops = $stops;
            $route->shapes = $shapes;
        }

        return response()->json($routes);
    }

    public function getStops(Request $request): JsonResponse
    {
        $stops = Stop::all();

        return response()->json($stops);
    }

    public function getTimesByStop($stopId): JsonResponse
    {
        $stopTimes = StopTime::where('stop_id', $stopId)->orderBy('arrival_time')->get();

        return response()->json($stopTimes);
    }

    public function getTrips(Request $request): JsonResponse
    {
        $trips = Trips::all();

        return response()->json($trips);
    }

    public function getStopsByPrefix(Request $request): JsonResponse
    {
        $prefix = Str::lower($request->get('prefix'));

        $stops = Stop::all()->filter(fn(Stop $stop) => Str::startsWith(Str::lower($stop->stop_name), [$prefix]));
        $stops = $stops->unique(fn(Stop $stop) => $stop->stop_name);
        return response()->json($stops->values());
    }

    public function findRoute(Request $request): JsonResponse
    {
        // Pobierz wszystkie trasy zawierające przystanek początkowy

        $startStopId = request('start_stop_id');
        $endStopId = request('end_stop_id');

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
                    $filteredDirectTrips->push($startTripsWithStops->get($tripId));
                }
            }
            if ($filteredDirectTrips->isNotEmpty()) {
                return response()->json([
                    'route' => 'direct',
                    'trips' => $filteredDirectTrips
                ]);
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
                        $connection[$startTripId][] = [ "start" => $startStops, "end" => $endStops];
                        break;
                    }
                }
            }
        }

        return response()->json([
            'route' => 'change',
            'trips' => $connection
        ]);
    }

    public function getRoutesByString($stopName): JsonResponse
    {
        // Fetch stops with the given name
        $stops = Stop::where('stop_name', 'like', '%' . $stopName . '%')->get();

        // Collect all stop IDs from the stops
        $stopIds = $stops->pluck('stop_id');

        // Fetch stop times for these stop IDs
        $stopTimes = StopTime::whereIn('stop_id', $stopIds)->get();

        // Collect all trip IDs from the stop times
        $tripIds = $stopTimes->pluck('trip_id')->unique();

        // Fetch trips for these trip IDs
        $trips = Trips::whereIn('trip_id', $tripIds)->get();

        // Collect all route IDs from the trips
        $routeIds = $trips->pluck('route_id')->unique();

        // Fetch routes for these route IDs
        $routes = Routes::whereIn('route_id', $routeIds)->get();

        foreach ($stopTimes as $time) {
            $time->stop = $stops->where('stop_id', $time->stop_id)->first();
        }

        foreach ($trips as $trip) {
            $trip->times = $stopTimes->where('trip_id', $trip->trip_id)->values()->toArray();
        }

        foreach ($routes as $route) {
            $route->trips = $trips->where('route_id', $route->route_id)->values()->toArray();
        }

        return response()->json($routes);
    }

    public function getCalculatedEmission(Request $request)
    {
        $distance = $this->emissionModelService->haversineGreatCircleDistance(
            $request->post('latitudeFrom'), $request->post('longitudeFrom'), $request->post('latitudeTo'), $request->post('longitudeTo')
        );

        $emission = $this->emissionModelService->estimateEmission($request->post('engineCapacity'), $request->post('fuelConsumption'));

        return response()->json([
            'distance' => $distance,
            'emission' => $emission,
            'calculatedEmission' => $distance * $emission / 1000
        ]);
    }

    public function getCsrfToken()
    {
        return csrf_token();
    }
}
