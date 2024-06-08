<?php

namespace App\Http\Controllers;

use App\Models\Routes;
use App\Models\Shapes;
use App\Models\Stop;
use App\Models\StopTime;
use App\Models\Trips;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GTFSController extends Controller
{
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
}
