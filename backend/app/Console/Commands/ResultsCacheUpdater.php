<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ResultsCacheUpdater extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'results:update-cache';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update results cache (run every 30 seconds via scheduler)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Calculate latest results from database
        $results = DB::table('votes')
            ->select('candidate_id', DB::raw('COUNT(*) as votes'))
            ->groupBy('candidate_id')
            ->get();

        // Update cache
        Cache::put('results:latest', $results, 30);

        // Update individual candidate vote counts
        foreach ($results as $result) {
            Cache::put("candidate:{$result->candidate_id}:votes", $result->votes, 30);
        }

        $totalVotes = $results->sum('votes');

        $this->info("✓ Results cache updated: {$totalVotes} total votes across {$results->count()} candidates");
    }
}
