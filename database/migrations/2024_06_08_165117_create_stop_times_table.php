<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stop_times', function (Blueprint $table) {
            $table->id("id");
            $table->integer("trip_id");
            $table->time("arrival_time");
            $table->time("departure_time");
            $table->integer("stop_id");
            $table->integer("stop_sequence");
            $table->string("stop_headsign")->nullable();
            $table->integer("pickup_type")->nullable();
            $table->integer("drop_off_type")->nullable();
            $table->float("shape_dist_traveled")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stop_times');
    }
};
