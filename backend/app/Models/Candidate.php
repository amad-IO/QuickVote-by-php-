<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Candidate extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'poll_id',
        'name',
        'description',
        'photo',
    ];

    /**
     * Get the poll that owns the candidate
     */
    public function poll()
    {
        return $this->belongsTo(Poll::class);
    }

    /**
     * Get all votes for this candidate.
     */
    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    /**
     * Get the total vote count for this candidate.
     */
    public function getVotesCountAttribute(): int
    {
        return $this->votes()->count();
    }
}
