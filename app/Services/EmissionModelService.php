<?php

namespace App\Services;

class EmissionModelService {

    // Coefficients from trained LR model in ai/lr-emission.py
    public static function estimateEmission(float $engineCapacity, float $fuelConsumption): float
    {
        return 4.31789235 * $engineCapacity + 19.9594371 * $fuelConsumption;
    }
}
