<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateVotesTableAddPollId extends Migration
{
    public function up()
    {
        // Drop old votes table and recreate with proper structure
        Schema::dropIfExists('votes');

        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->foreignId('poll_id')->constrained('polls')->onDelete('cascade');
            $table->foreignId('candidate_id')->constrained('candidates')->onDelete('cascade');
            $table->timestamp('voted_at')->useCurrent();
            $table->timestamps();

            // Unique constraint: one email can vote once per poll
            $table->unique(['email', 'poll_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('votes');

        // Recreate old structure
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->foreignId('candidate_id')->constrained('candidates')->onDelete('cascade');
            $table->timestamp('voted_at')->useCurrent();
            $table->timestamps();
        });
    }
}
