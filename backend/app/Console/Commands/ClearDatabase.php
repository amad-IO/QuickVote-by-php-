<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ClearDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:clear {--force : Force the operation without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear all data from database tables (keep structure)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!$this->option('force')) {
            if (!$this->confirm('⚠️  This will DELETE ALL DATA from your database. Continue?')) {
                $this->info('Operation cancelled.');
                return 0;
            }
        }

        $this->info('🧹 Clearing database...');
        $this->newLine();

        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $tables = [
            'votes',
            'candidates',
            'polls',
            'users',
            'personal_access_tokens'
        ];

        $cleared = 0;

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                $count = DB::table($table)->count();
                DB::table($table)->truncate();
                $this->line("✅ Cleared table: <info>{$table}</info> ({$count} rows deleted)");
                $cleared++;
            } else {
                $this->line("⏭️  Skipped: <comment>{$table}</comment> (table not found)");
            }
        }

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->newLine();
        $this->info("✅ Database cleared! {$cleared} tables truncated.");
        $this->info('🆕 Your database is now like a fresh install!');
        $this->newLine();
        $this->warn('💡 Tip: Run "php artisan db:seed" to add sample data');

        return 0;
    }
}
