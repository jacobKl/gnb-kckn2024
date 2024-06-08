<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Agency;
use App\Models\Calendar;
use App\Models\CalendarDate;
use App\Models\FeedInfo;
use App\Models\Routes;
use App\Models\Shapes;
use App\Models\StopTime;
use App\Models\Stop;
use App\Models\Transfer;
use App\Models\Trips;

class GtfsExampleSeeder extends Seeder
{
    public function run()
    {
//        $this->importData('agency', Agency::class);
//        $this->importData('calendar', Calendar::class);
//        $this->importData('calendar_dates', CalendarDate::class);
//        $this->importData('feed_info', FeedInfo::class);
        $this->importData('routes', Routes::class);
        $this->importData('shapes', Shapes::class);
//        $this->importData('stop_times', StopTime::class);
//        $this->importData('stops', Stop::class);
//        $this->importData('transfers', Transfer::class);
        $this->importData('trips', Trips::class);
    }

    private function importData($filename, $modelClass)
    {
        $path = database_path("seeders/gtfs/{$filename}.txt");

        if (!File::exists($path)) {
            $this->command->error("File not found: {$filename}.txt");
            return;
        }

        $data = array_map('str_getcsv', file($path));
        $header = $data[0];
        unset($data[0]);

        foreach ($data as $row) {
            $rowData = array_combine($header, $row);

            $rowData = array_map(function ($value) {
                return $value === '' ? null : $value;
            }, $rowData);

//            $rowData = array_filter($rowData, function ($key) {
//                return !str_ends_with($key, '_id');
//            }, ARRAY_FILTER_USE_KEY);

            $modelClass::create($rowData);
        }

        $this->command->info("Imported data for {$filename}.");
    }
}
