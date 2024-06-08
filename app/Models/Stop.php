<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stop extends Model
{
    use HasFactory;

    protected $table = 'stops';

    protected $fillable = [
        'stop_code',
        'stop_name',
        'stop_desc',
        'stop_lat',
        'stop_lon',
        'stop_url',
        'location_type',
        'parent_station'
    ];

    // Define the relationship to the StopTime model
    public function stopTimes()
    {
        return $this->hasMany(StopTime::class, 'stop_id');
    }
}

