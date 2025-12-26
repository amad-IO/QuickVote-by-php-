<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddWasStartedToPollsTable extends Migration
{
    public function up()
    {
        Schema::table('polls', function (Blueprint $table) {
            $table->boolean('was_started')->default(false)->after('is_active');
        });
    }

    public function down()
    {
        Schema::table('polls', function (Blueprint $table) {
            $table->dropColumn('was_started');
        });
    }
}
