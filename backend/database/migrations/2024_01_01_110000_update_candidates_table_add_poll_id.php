<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCandidatesTableAddPollId extends Migration
{
    public function up()
    {
        Schema::table('candidates', function (Blueprint $table) {
            $table->foreignId('poll_id')->after('id')->nullable()->constrained('polls')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('candidates', function (Blueprint $table) {
            $table->dropForeign(['poll_id']);
            $table->dropColumn('poll_id');
        });
    }
}
