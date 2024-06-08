<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transfer extends Model
{
    use HasFactory;

    protected $table = 'transfers';

    const ATTRIBUTE_FROM_STOP_ID =  "from_stop_id";
    const ATTRIBUTE_TO_STOP_ID =  "to_stop_id";
    const ATTRIBUTE_TRANSFER_TYPE =  "transfer_type";
    const ATTRIBUTE_MIN_TRANSFER_TIME =  "min_transfer_time";
    protected $fillable = [
        self::ATTRIBUTE_FROM_STOP_ID,
        self::ATTRIBUTE_TO_STOP_ID,
        self::ATTRIBUTE_TRANSFER_TYPE,
        self::ATTRIBUTE_MIN_TRANSFER_TIME,
    ];
}
