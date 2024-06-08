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
