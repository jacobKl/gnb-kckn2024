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

class LocationController extends Controller
{
    protected EmissionModelService $emissionModelService;

    public function __construct(EmissionModelService $emissionModelService)
    {
        $this->emissionModelService = $emissionModelService;
    }

    public function getClosestStops(float $latitude, float $longitude): JsonResponse
    {
        $stops = Stop::all();

        // Calculate distance to each stop and store in an array
        $distances = [];
        foreach ($stops as $stop) {
            $distance = $this->emissionModelService->haversineGreatCircleDistance(
                $latitude,
                $longitude,
                $stop->stop_lat,
                $stop->stop_lon
            );
            $distances[] = [
                'stop' => $stop,
                'distance' => $distance
            ];
        }

        // Sort the array by distance
        usort($distances, function ($a, $b) {
            return $a['distance'] <=> $b['distance'];
        });

        // Get the 3 closest stops
        $closestStops = array_slice($distances, 0, 3);

        // Extract the stops from the array
        $closestStops = array_map(function ($item) {
            $item['stop']['distance'] = $item['distance'];
            return $item['stop'];
        }, $closestStops);

        return response()->json($closestStops);
    }
}
