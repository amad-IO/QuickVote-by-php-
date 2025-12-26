<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use App\Models\Candidate;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PollController extends Controller
{
    /**
     * Get all polls
     */
    public function index()
    {
        $polls = Poll::with(['candidates', 'votes'])->get();
        return response()->json($polls);
    }

    /**
     * Create a new poll
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'candidates' => 'required|array|min:2',
            'candidates.*.name' => 'required|string|max:255',
            'candidates.*.description' => 'nullable|string',
            'candidates.*.photo' => 'nullable|string',
        ]);

        // Check if user already has an active or draft poll
        $userId = auth()->id();

        if (!$userId) {
            return response()->json([
                'message' => 'Authentication required',
                'error' => 'unauthenticated'
            ], 401);
        }

        if ($this->hasActiveOrDraftPoll($userId)) {
            return response()->json([
                'message' => 'Anda masih memiliki voting yang belum selesai. Harap selesaikan atau hapus voting tersebut terlebih dahulu sebelum membuat voting baru.',
                'error' => 'active_or_draft_poll_exists'
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Create poll
            $poll = Poll::create([
                'title' => $validated['title'],
                'is_active' => false,
                'created_by' => $userId,  // Use $userId from validation above
            ]);

            // Create candidates
            foreach ($validated['candidates'] as $candidateData) {
                Candidate::create([
                    'poll_id' => $poll->id,
                    'name' => $candidateData['name'],
                    'description' => $candidateData['description'] ?? null,
                    'photo' => $candidateData['photo'] ?? null,
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Poll created successfully',
                'poll' => $poll->load('candidates')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            \Log::error('Poll creation failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to create poll',
                'error' => $e->getMessage(),
                'details' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    /**
     * Get a specific poll with candidates and vote counts
     */
    public function show($id)
    {
        $poll = Poll::with(['candidates.votes'])->findOrFail($id);

        // Calculate vote counts
        $poll->candidates->each(function ($candidate) {
            $candidate->vote_count = $candidate->votes->count();
        });

        return response()->json($poll);
    }

    /**
     * Start/Activate a poll
     */
    public function start($id)
    {
        $poll = Poll::findOrFail($id);
        $poll->is_active = true;
        $poll->was_started = true;  // Mark that this poll has been started
        $poll->save();

        return response()->json([
            'message' => 'Poll started successfully',
            'poll' => $poll
        ]);
    }

    /**
     * Stop/Deactivate a poll
     */
    public function stop($id)
    {
        $poll = Poll::findOrFail($id);
        $poll->is_active = false;
        $poll->save();

        return response()->json([
            'message' => 'Poll stopped successfully',
            'poll' => $poll
        ]);
    }

    /**
     * Submit a vote
     */
    public function vote(Request $request, $id)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'candidate_id' => 'required|exists:candidates,id'
        ]);

        $poll = Poll::findOrFail($id);

        // Check if poll is active
        if (!$poll->is_active) {
            return response()->json([
                'message' => 'This poll is not active'
            ], 403);
        }

        // Check if email already voted in this poll
        $existingVote = Vote::where('poll_id', $id)
            ->where('email', $validated['email'])
            ->first();

        if ($existingVote) {
            return response()->json([
                'message' => 'You have already voted in this poll'
            ], 422);
        }

        // Create vote
        $vote = Vote::create([
            'poll_id' => $id,
            'candidate_id' => $validated['candidate_id'],
            'email' => $validated['email'],
        ]);

        return response()->json([
            'message' => 'Vote submitted successfully',
            'vote' => $vote
        ], 201);
    }

    /**
     * Get poll results
     */
    public function results($id)
    {
        $poll = Poll::with(['candidates'])->findOrFail($id);

        // Get vote counts per candidate
        $results = Vote::where('poll_id', $id)
            ->select('candidate_id', DB::raw('count(*) as votes'))
            ->groupBy('candidate_id')
            ->get()
            ->keyBy('candidate_id');

        $totalVotes = Vote::where('poll_id', $id)->count();

        // Format candidates with votes and percentage
        $candidatesWithResults = $poll->candidates->map(function ($candidate) use ($results, $totalVotes) {
            $votes = $results->get($candidate->id)->votes ?? 0;
            $percentage = $totalVotes > 0 ? ($votes / $totalVotes) * 100 : 0;

            return [
                'id' => $candidate->id,
                'name' => $candidate->name,
                'votes' => $votes,
                'percentage' => round($percentage, 2)
            ];
        });

        return response()->json([
            'poll' => $poll,
            'total_votes' => $totalVotes,
            'candidates' => $candidatesWithResults
        ]);
    }

    /**
     * Delete a poll
     */
    public function destroy($id)
    {
        $poll = Poll::findOrFail($id);
        $poll->delete();

        return response()->json([
            'message' => 'Poll deleted successfully'
        ]);
    }

    /**
     * Check if user has any active or draft poll
     * 
     * A poll is considered "unfinished" if:
     * - It is currently active (is_active = true), OR
     * - It is a draft (is_active = false AND was_started = false)
     * 
     * A poll that was started and stopped (is_active = false AND was_started = true)
     * is considered "finished", and user can create new polls.
     * 
     * @param int $userId
     * @return bool
     */
    private function hasActiveOrDraftPoll($userId)
    {
        // Check if user has any currently active poll
        $hasActivePoll = Poll::where('created_by', $userId)
            ->where('is_active', true)
            ->exists();

        if ($hasActivePoll) {
            return true;
        }

        // Check if user has draft poll (never been started)
        $hasDraftPoll = Poll::where('created_by', $userId)
            ->where('is_active', false)
            ->where('was_started', false)
            ->exists();

        return $hasDraftPoll;
    }
}
