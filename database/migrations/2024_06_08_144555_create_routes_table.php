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
        Schema::create('routes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("route_id");
            $table->integer("agency_id")
                ->nullable();
            $table->string("route_short_name");
            $table->string("route_long_name");
            $table->string("route_desc")
                ->nullable();
            $table->integer("route_type");
            $table->string("route_url")
                ->nullable();
            $table->string("route_color");
            $table->string("route_text_color");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('routes');
    }
};
