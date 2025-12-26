<?php

namespace App\Http\Controllers;

use App\Http\Requests\VoteRequest;
use App\Http\Resources\VoteResultResource;
use App\Models\Candidate;
use App\Services\VoteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

class VoteController extends Controller
{
    protected $voteService;

    public function __construct(VoteService $voteService)
    {
        $this->voteService = $voteService;
    }

    /**
     * Store a new vote (Async with Queue)
     * Returns instant response - vote processed in background
     */
    public function store(VoteRequest $request): JsonResponse
    {
        // Queue vote for async processing
        $result = $this->voteService->queueVote(
            $request->email,
            $request->candidate_id
        );

        // Check if duplicate
        if ($result['status'] === 'duplicate') {
            return response()->json([
                'message' => $result['message'],
                'error' => 'Email ini sudah melakukan voting'
            ], 422);
        }

        // Return instant 202 Accepted (processing in background)
        return response()->json([
            'message' => 'Vote sedang diproses',
            'vote_id' => $result['vote_id'],
            'status' => 'queued'
        ], 202); // HTTP 202 = Accepted for processing
    }

    /**
     * Get voting results (Cached for performance)
     * Cache TTL: 30 seconds
     */
    public function results(): JsonResponse
    {
        // Get results from cache (avoid database query)
        $cachedResults = $this->voteService->getCachedResults();

        // Get candidate details with vote counts
        $results = Candidate::withCount('votes')
            ->orderBy('votes_count', 'desc')
            ->get();

        return response()->json([
            'data' => VoteResultResource::collection($results),
            'cached' => !empty($cachedResults),
            'timestamp' => now()->toIso8601String()
        ]);
    }

    /**
     * Check vote status by email or vote_id
     */
    public function status(string $identifier): JsonResponse
    {
        $status = $this->voteService->getVoteStatus($identifier);

        if (!$status) {
            return response()->json([
                'message' => 'Vote not found'
            ], 404);
        }

        return response()->json($status);
    }

    /**
     * Get queue statistics (for monitoring)
     */
    public function queueStats(): JsonResponse
    {
        $stats = $this->voteService->getQueueStats();

        return response()->json($stats);
    }
}
