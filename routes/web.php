<?php

use App\Http\Controllers\GTFSController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::prefix('api')->group(function () {
    Route::get("/get-shapes-by-route/{routeId}", [GTFSController::class, 'getShapesByRoute']);
    Route::get("/get-stops-by-route/{routeId}", [GTFSController::class, 'getStopsForRoute']);
    Route::get("/get-stops-by-route-name/{routeName}", [GTFSController::class, 'getStopsForRouteName']);
    Route::get("/get-described-routes", [GTFSController::class, 'getRoutesWithStops']);
    Route::get("/routes", [GTFSController::class, 'getRoutes']);
    Route::get("/stops", [GTFSController::class, 'getStops']);
    Route::get("/times-by-stop/{stopId}", [GTFSController::class, 'getTimesByStop']);
    Route::get("/trips", [GTFSController::class, 'getTrips']);
});
require __DIR__ . '/auth.php';
