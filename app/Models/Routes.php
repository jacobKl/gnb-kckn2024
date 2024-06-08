<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Symfony\Component\Mailer\EventListener\EnvelopeListener;

class Routes extends Model
{
    use HasFactory;


    protected $table = 'routes';

    const ATTRIBUTE_ROUTE_ID = 'route_id';
    const ATTRIBUTE_AGENCY_ID = 'agency_id';
    const ATTRIBUTE_ROUTE_SHORT_NAME = 'route_short_name';

    const ATTRIBUTE_ROUTE_LONG_NAME = 'route_long_name';
    const ATTRIBUTE_ROUTE_TYPE = 'route_type';
    const ATTRIBUTE_ROUTE_URL = "route_url";
    const ATTRIBUTE_ROUTE_COLOR = "route_color";
    const ATTRIBUTE_ROUTE_TEXT_COLOR = "route_text_color";

    protected $fillable = [
        self::ATTRIBUTE_ROUTE_ID,
        self::ATTRIBUTE_AGENCY_ID,
        self::ATTRIBUTE_ROUTE_SHORT_NAME,
        self::ATTRIBUTE_ROUTE_LONG_NAME,
        self::ATTRIBUTE_ROUTE_TYPE,
        self::ATTRIBUTE_ROUTE_URL,
        self::ATTRIBUTE_ROUTE_COLOR,
        self::ATTRIBUTE_ROUTE_TEXT_COLOR,
    ];

}
