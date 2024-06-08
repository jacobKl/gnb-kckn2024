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
        Schema::create('stops', function (Blueprint $table) {
            $table->id('stop_id');
            $table->string('stop_code')->nullable();
            $table->string('stop_name');
            $table->text('stop_desc')->nullable();
            $table->decimal('stop_lat', 10, 7);
            $table->decimal('stop_lon', 10, 7);
            $table->string('stop_url')->nullable();
            $table->integer('location_type')->nullable();
            $table->integer('parent_station')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stops');
    }
};
