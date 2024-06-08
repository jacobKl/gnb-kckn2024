<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Agency;
use App\Models\Calendar;
use App\Models\CalendarDate;
use App\Models\FeedInfo;
use App\Models\Route;
use App\Models\Shape;
use App\Models\StopTime;
use App\Models\Stop;
use App\Models\Transfer;
use App\Models\Trip;

class GtfsExampleSeeder extends Seeder
{
    public function run()
    {
        $this->importData('agency', Agency::class);
        $this->importData('calendar', Calendar::class);
        $this->importData('calendar_dates', CalendarDate::class);
        $this->importData('feed_info', FeedInfo::class);
        $this->importData('routes', Route::class);
        $this->importData('shapes', Shape::class);
        $this->importData('stop_times', StopTime::class);
        $this->importData('stops', Stop::class);
        $this->importData('transfers', Transfer::class);
        $this->importData('trips', Trip::class);
    }

    private function importData($filename, $modelClass)
    {
        $path = database_path("gtfs/{$filename}.txt");

        if (!File::exists($path)) {
            $this->command->error("File not found: {$filename}.txt");
            return;
        }

        $data = array_map('str_getcsv', file($path));
        $header = array_map('camel_case', $data[0]);
        unset($data[0]);

        foreach ($data as $row) {
            $rowData = array_combine($header, $row);
            $modelClass::factory()->create($rowData);
        }

        $this->command->info("Imported data for {$filename}.");
    }
}
