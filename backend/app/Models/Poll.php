<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Poll extends Model
{
    protected $fillable = [
        'title',
        'is_active',
        'was_started',
        'created_by'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'was_started' => 'boolean',
    ];

    /**
     * Get the candidates for the poll
     */
    public function candidates(): HasMany
    {
        return $this->hasMany(Candidate::class);
    }

    /**
     * Get the votes for the poll
     */
    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    /**
     * Get the creator of the poll
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get vote counts for this poll
     */
    public function getVoteCountsAttribute()
    {
        return $this->votes()
            ->selectRaw('candidate_id, count(*) as count')
            ->groupBy('candidate_id')
            ->pluck('count', 'candidate_id');
    }
}
