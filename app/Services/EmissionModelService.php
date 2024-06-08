<?php

namespace App\Services;

class EmissionModelService
{
    const EARTH_RADIUS = 6371000;

    // Coefficients from trained LR model in ai/lr-emission.py

    /**
     * @param float $engineCapacity
     * @param float $fuelConsumption
     * @return float
     */
    public function estimateEmission(float $engineCapacity, float $fuelConsumption): float
    {
        return 4.31789235 * $engineCapacity + 19.9594371 * $fuelConsumption;
    }

    public function haversineGreatCircleDistance($latitudeFrom, $longitudeFrom, $latitudeTo, $longitudeTo)
    {
        // Convert from degrees to radians
        $latFrom = deg2rad($latitudeFrom);
        $lonFrom = deg2rad($longitudeFrom);
        $latTo = deg2rad($latitudeTo);
        $lonTo = deg2rad($longitudeTo);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
                cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));
        return $angle * self::EARTH_RADIUS;
    }
}
