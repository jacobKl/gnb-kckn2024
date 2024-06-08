<?php

use App\Http\Controllers\GTFSController;
use Illuminate\Support\Facades\Route;

Route::get('/csrf', [GTFSController::class, 'getCsrfToken']);
Route::post('/calculate-emission', [GTFSController::class, 'getCalculatedEmission']);
