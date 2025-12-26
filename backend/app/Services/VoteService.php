<?php

namespace App\Services;

use App\Jobs\ProcessVoteJob;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class VoteService
{
    /**
     * Queue a vote for async processing
     * Returns instantly with vote tracking ID
     *
     * @param string $email
     * @param int $candidateId
     * @return array
     */
    public function queueVote(string $email, int $candidateId): array
    {
        // Generate unique vote ID for tracking
        $voteId = Str::uuid()->toString();

        // Quick duplicate check in Redis (O(1) operation)
        $alreadyVoted = $this->checkDuplicateInCache($email);
        if ($alreadyVoted) {
            return [
                'status' => 'duplicate',
                'message' => 'Email ini sudah melakukan voting',
                'vote_id' => null,
            ];
        }

        // Add email to voted set in Redis (prevent duplicates)
        $this->markEmailAsVoted($email);

        // Queue the vote for processing
        ProcessVoteJob::dispatch([
            'email' => $email,
            'candidate_id' => $candidateId,
            'vote_id' => $voteId,
            'queued_at' => now()->toIso8601String(),
        ]);

        // Track vote status in Redis
        Cache::put("vote_status:{$email}", 'queued', 3600);
        Cache::put("vote_id:{$voteId}", [
            'email' => $email,
            'candidate_id' => $candidateId,
            'status' => 'queued',
        ], 3600);

        return [
            'status' => 'queued',
            'message' => 'Vote sedang diproses',
            'vote_id' => $voteId,
        ];
    }

    /**
     * Check if email already voted (Redis cache check)
     *
     * @param string $email
     * @return bool
     */
    protected function checkDuplicateInCache(string $email): bool
    {
        // Check in Redis set 'voted_emails'
        return Redis::sismember('voted_emails', $email);
    }

    /**
     * Mark email as voted in Redis
     *
     * @param string $email
     * @return void
     */
    protected function markEmailAsVoted(string $email): void
    {
        // Add to Redis set (O(1) operation)
        Redis::sadd('voted_emails', $email);

        // Set expiry to 30 days
        Redis::expire('voted_emails', 60 * 60 * 24 * 30);
    }

    /**
     * Get vote status by email or vote ID
     *
     * @param string $identifier (email or vote_id)
     * @return array|null
     */
    public function getVoteStatus(string $identifier): ?array
    {
        // Check if it's a vote ID (UUID format)
        if (Str::isUuid($identifier)) {
            return Cache::get("vote_id:{$identifier}");
        }

        // Otherwise treat as email
        $status = Cache::get("vote_status:{$identifier}");
        if (!$status) {
            return null;
        }

        return [
            'email' => $identifier,
            'status' => $status,
        ];
    }

    /**
     * Get cached results (avoid database query)
     *
     * @return array
     */
    public function getCachedResults(): array
    {
        return Cache::remember('results:latest', 30, function () {
            // Fallback to database if cache miss
            return \DB::table('votes')
                ->select('candidate_id', \DB::raw('COUNT(*) as votes'))
                ->groupBy('candidate_id')
                ->get()
                ->toArray();
        });
    }

    /**
     * Get vote count for specific candidate (cached)
     *
     * @param int $candidateId
     * @return int
     */
    public function getCandidateVoteCount(int $candidateId): int
    {
        return Cache::remember("candidate:{$candidateId}:votes", 30, function () use ($candidateId) {
            return \DB::table('votes')
                ->where('candidate_id', $candidateId)
                ->count();
        });
    }

    /**
     * Invalidate results cache
     *
     * @return void
     */
    public function invalidateCache(): void
    {
        Cache::forget('results:latest');

        // Also clear individual candidate caches
        $candidateIds = \DB::table('candidates')->pluck('id');
        foreach ($candidateIds as $id) {
            Cache::forget("candidate:{$id}:votes");
        }
    }

    /**
     * Get queue statistics
     *
     * @return array
     */
    public function getQueueStats(): array
    {
        $queueLength = Redis::llen('queues:votes');
        $processedToday = Cache::get('stats:votes:today', 0);

        return [
            'queue_length' => $queueLength,
            'processed_today' => $processedToday,
            'queue_workers' => 2, // From docker-compose
        ];
    }
}
