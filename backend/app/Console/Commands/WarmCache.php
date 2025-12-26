<?php

namespace App\Console\Commands;

use App\Models\Candidate;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class WarmCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:warm';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Warm up application caches for better performance';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Warming up caches...');

        // Warm candidates cache
        $this->warmCandidatesCache();

        // Warm results cache
        $this->warmResultsCache();

        $this->info('✓ Cache warming complete!');
    }

    /**
     * Warm candidates cache
     */
    protected function warmCandidatesCache()
    {
        $this->line('→ Warming candidates cache...');

        $candidates = Candidate::all();
        Cache::put('candidates:all', $candidates, 300);

        // Cache individual candidates
        foreach ($candidates as $candidate) {
            Cache::put("candidate:{$candidate->id}", $candidate, 600);
        }

        $this->info('  ✓ Cached ' . $candidates->count() . ' candidates');
    }

    /**
     * Warm results cache
     */
    protected function warmResultsCache()
    {
        $this->line('→ Warming results cache...');

        $results = DB::table('votes')
            ->select('candidate_id', DB::raw('COUNT(*) as votes'))
            ->groupBy('candidate_id')
            ->get();

        Cache::put('results:latest', $results, 30);

        // Cache individual vote counts
        foreach ($results as $result) {
            Cache::put("candidate:{$result->candidate_id}:votes", $result->votes, 30);
        }

        $this->info('  ✓ Cached results for ' . $results->count() . ' candidates');
    }
}
