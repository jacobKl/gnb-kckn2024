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
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('route_id')->constrained('routes', "route_id");
            $table->integer("service_id");
            $table->integer("trip_id");
            $table->string("trip_headsign")
                ->nullable();
            $table->string("trip_short_name")
                ->nullable();
            $table->integer("direction_id");
            $table->integer("block_id");
            $table->foreignId("shape_id")->constrained('shapes', "shape_id");
            $table->string("wheelchair_accessible")
                ->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};
