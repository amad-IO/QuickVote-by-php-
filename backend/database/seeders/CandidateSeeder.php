<?php

namespace Database\Seeders;

use App\Models\Candidate;
use Illuminate\Database\Seeder;

class CandidateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $candidates = [
            [
                'name' => 'Candidate A',
                'description' => 'Visi: Membangun kampus digital yang modern dan inovatif',
                'photo' => null,
            ],
            [
                'name' => 'Candidate B',
                'description' => 'Visi: Meningkatkan kualitas pendidikan dan fasilitas mahasiswa',
                'photo' => null,
            ],
            [
                'name' => 'Candidate C',
                'description' => 'Visi: Menciptakan lingkungan kampus yang inklusif dan berkelanjutan',
                'photo' => null,
            ],
        ];

        foreach ($candidates as $candidate) {
            Candidate::create($candidate);
        }
    }
}
