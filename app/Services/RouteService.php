<?php

namespace App\Services;

use App\Models\Routes;
use App\Models\Stop;
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
}
