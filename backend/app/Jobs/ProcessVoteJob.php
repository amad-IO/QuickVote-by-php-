<?php

namespace App\Jobs;

use App\Models\Vote;
use App\Models\Candidate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessVoteJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Vote data to process
     */
    public $voteData;

    /**
     * Number of times the job may be attempted
     */
    public $tries = 3;

    /**
     * Number of seconds to wait before retrying
     */
    public $backoff = [5, 10, 30];

    /**
     * Timeout for the job (90 seconds)
     */
    public $timeout = 90;

    /**
     * Create a new job instance
     */
    public function __construct(array $voteData)
    {
        $this->voteData = $voteData;
        $this->onQueue('votes'); // High priority queue
    }

    /**
     * Execute the job - Process vote with batch optimization
     */
    public function handle()
    {
        $email = $this->voteData['email'];
        $candidateId = $this->voteData['candidate_id'];

        try {
            // Validate candidate exists
            $candidate = Candidate::find($candidateId);
            if (!$candidate) {
                Log::warning("Vote rejected: Invalid candidate ID {$candidateId}");
                return;
            }

            // Check for duplicate vote (database level)
            $existingVote = Vote::where('email', $email)->first();
            if ($existingVote) {
                Log::info("Vote rejected: Duplicate email {$email}");
                return;
            }

            // Insert vote into database
            DB::transaction(function () use ($email, $candidateId) {
                Vote::create([
                    'email' => $email,
                    'candidate_id' => $candidateId,
                    'voted_at' => now(),
                ]);
            });

            // Update results cache
            $this->updateResultsCache();

            // Mark vote as processed in Redis
            Cache::put("vote_status:{$email}", 'completed', 3600);

            Log::info("Vote processed successfully for {$email} -> Candidate {$candidateId}");

        } catch (QueryException $e) {
            // Handle duplicate key violation (email unique constraint)
            if ($e->getCode() === '23000') {
                Log::warning("Vote rejected: Duplicate email {$email} (DB constraint)");
                return; // Don't retry
            }

            // Other database errors - retry
            Log::error("Database error processing vote: " . $e->getMessage());
            throw $e;

        } catch (\Exception $e) {
            Log::error("Error processing vote: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Update results cache after vote
     */
    protected function updateResultsCache()
    {
        try {
            // Calculate fresh results
            $results = DB::table('votes')
                ->select('candidate_id', DB::raw('COUNT(*) as votes'))
                ->groupBy('candidate_id')
                ->get();

            // Update cache (30 second TTL)
            Cache::put('results:latest', $results, 30);

            // Also cache individual candidate counts
            foreach ($results as $result) {
                Cache::put("candidate:{$result->candidate_id}:votes", $result->votes, 30);
            }

        } catch (\Exception $e) {
            Log::error("Error updating results cache: " . $e->getMessage());
        }
    }

    /**
     * Handle job failure
     */
    public function failed(\Throwable $exception)
    {
        $email = $this->voteData['email'];

        // Mark vote as failed
        Cache::put("vote_status:{$email}", 'failed', 3600);

        Log::error("Vote processing failed permanently for {$email}: " . $exception->getMessage());
    }
}
