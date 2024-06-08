<?php

namespace App\Http\Controllers;

use App\Models\Routes;
use App\Models\Shapes;
use App\Models\Stop;
use App\Models\StopTime;
use App\Models\Trips;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\RouteService;

class GTFSController extends Controller
{
    protected $routeService;

    public function __construct(RouteService $routeService)
    {
        $this->routeService = $routeService;
    }

    public function getShapesByRoute($routeId): JsonResponse
    {
        // Fetch the trips for the given route
        $trips = Trips::where('route_id', $routeId)->get();

        // Collect all shape IDs from the trips
        $shapeIds = $trips->pluck('shape_id')->unique();

        // Fetch all shapes points for these shape IDs
        $shapes = Shapes::whereIn('shape_id', $shapeIds)->orderBy('shape_pt_sequence')->get();

        return response()->json([
            'data' => $shapes,
            'routes' => $this->routeService->getRoutes(),
            'stops' => $this->routeService->getStops()
        ]);
    }

    public function getRoutes(Request $request): JsonResponse
    {
        $routes = Routes::all();

        return response()->json([
            'data' => $routes,
            'routes' => $this->routeService->getRoutes(),
            'stops' => $this->routeService->getStops()
        ]);
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

        return response()->json([
            'data' => $stops,
            'routes' => $this->routeService->getRoutes(),
            'stops' => $this->routeService->getStops()
        ]);
    }

    public function getStops(Request $request): JsonResponse
    {
        $stops = Stop::all();

        return response()->json([
            'data' => $stops,
            'routes' => $this->routeService->getRoutes(),
            'stops' => $this->routeService->getStops()
        ]);
    }

    public function getTimesByStop($stopId): JsonResponse
    {
        $stopTimes = StopTime::where('stop_id', $stopId)->orderBy('arrival_time')->get();

        return response()->json([
            'data' => $stopTimes,
            'routes' => $this->routeService->getRoutes(),
            'stops' => $this->routeService->getStops()
        ]);
    }

    public function getTrips(Request $request): JsonResponse
    {
        $trips = Trips::all();

        return response()->json([
            'data' => $trips,
            'routes' => $this->routeService->getRoutes(),
            'stops' => $this->routeService->getStops()
        ]);
    }
}
