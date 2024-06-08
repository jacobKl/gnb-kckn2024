<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Trips extends Model
{
    use HasFactory;

    protected $table = 'trips';
    const ATTRIBUTE_ID = 'id';
    const ATTRIBUTE_ROUTE_ID = 'route_id';
    const ATTRIBUTE_SERVICE_ID = 'service_id';
    const ATTRIBUTE_TRIP_ID = "trip_id";
    const ATTRIBUTE_TRIP_SHORT_NAME = "trip_short_name";
    const ATTRIBUTE_DIRECTION_ID = "direction_id";
    const ATTRIBUTE_SHAPE_ID = "shape_id";
    const ATTRIBUTE_WHEELCHAIR_ACCESSIBLE = "wheelchair_accessible";

    const RELATION_PARENT_SHAPE = "shape";
    const RELATION_PARENT_ROUTE = "route";

    protected $fillable = [
        self::ATTRIBUTE_ROUTE_ID,
        self::ATTRIBUTE_SERVICE_ID,
        self::ATTRIBUTE_TRIP_ID,
        self::ATTRIBUTE_TRIP_SHORT_NAME,
        self::ATTRIBUTE_DIRECTION_ID,
        self::ATTRIBUTE_SHAPE_ID,
        self::ATTRIBUTE_WHEELCHAIR_ACCESSIBLE
    ];

    public function route():BelongsTo {
        return $this->belongsTo(Routes::class, self::ATTRIBUTE_ROUTE_ID);
    }

    public function shapes():BelongsTo {
        return $this->belongsTo(Shapes::class, self::ATTRIBUTE_SHAPE_ID);
    }

}
