<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StopTime extends Model
{
    use HasFactory;

    protected $table = 'stop_times';

    protected $fillable = [
        'trip_id',
        'arrival_time',
        'departure_time',
        'stop_id',
        'stop_sequence',
        'stop_headsign',
        'pickup_type',
        'drop_off_type',
        'shape_dist_traveled'
    ];

    // Define the relationship to the Stop model
    public function stop()
    {
        return $this->belongsTo(Stop::class, 'stop_id');
    }
}

