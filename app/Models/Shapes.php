<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shapes extends Model
{
    use HasFactory;

    protected $table = 'shapes';
    const ATTRIBUTE_SHAPE_ID = "shape_id";
    const ATTRIBUTE_SHAPE_PT_LAT = "shape_pt_lat";
    const ATTRIBUTE_SHAPE_PT_LON = "shape_pt_lon";
    const ATTRIBUTE_SHAPE_DIST_TRAVELED = "shape_dist_traveled";

    protected $fillable = [
        self::ATTRIBUTE_SHAPE_PT_LAT,
        self::ATTRIBUTE_SHAPE_PT_LON,
        self::ATTRIBUTE_SHAPE_ID,
        self::ATTRIBUTE_SHAPE_DIST_TRAVELED
    ];
}
