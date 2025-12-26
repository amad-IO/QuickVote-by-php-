import React, { useEffect, useState } from 'react';
import { getPolls, getPollResults } from '../../services/api';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface Candidate {
    id: string;
    name: string;
    description: string;
    photo: string | null;
}

interface Poll {
    id: string;
    title: string;
    candidates: Candidate[];
    is_active: boolean;
}

interface PollResult {
    total_votes: number;
    candidates: {
        id: string;
        name: string;
        votes: number;
        percentage: number;
    }[];
}

const VotingHistoryPage: React.FC = () => {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [results, setResults] = useState<Record<string, PollResult>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolls = async () => {
            setLoading(true);
            const data = await getPolls();
            setPolls(data);
            setLoading(false);
            // Fetch results for each poll
            data.forEach(async (poll: Poll) => {
                const res = await getPollResults(poll.id);
                setResults((prev) => ({ ...prev, [poll.id]: res }));
            });
        };
        fetchPolls();

        // Auto refresh every 10 seconds untuk update results
        const interval = setInterval(() => {
            fetchPolls();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="text-center py-12 text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#0f1123] text-white px-4 py-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-8 text-center">Daftar Voting & Hasil</h1>
            <div className="w-full max-w-4xl space-y-10">
                {polls.map((poll) => {
                    const pollResult = results[poll.id];
                    const hasVotes = pollResult && pollResult.total_votes > 0;

                    // Find winner and check for ties
                    let winner = null;
                    let isTied = false;

                    if (hasVotes && pollResult.candidates.length > 0) {
                        const maxVotes = Math.max(...pollResult.candidates.map(c => c.votes));
                        const topCandidates = pollResult.candidates.filter(c => c.votes === maxVotes);

                        if (topCandidates.length > 1) {
                            isTied = true;
                        } else {
                            winner = topCandidates[0];
                        }
                    }
                    return (
                        <div key={poll.id} className="bg-[#191a33] rounded-2xl p-6 border border-gray-800 shadow mb-8">
                            <h2 className="text-2xl font-bold mb-2">{poll.title}</h2>
                            {pollResult ? (
                                <>
                                    <div className="mb-4">
                                        <Bar
                                            data={{
                                                labels: pollResult.candidates.map((c) => c.name),
                                                datasets: [
                                                    {
                                                        label: 'Jumlah Suara',
                                                        data: pollResult.candidates.map((c) => c.votes),
                                                        backgroundColor: [
                                                            '#6467f2', '#a855f7', '#d946ef', '#f59e42', '#34d399', '#f87171', '#60a5fa', '#fbbf24', '#10b981', '#ef4444'
                                                        ],
                                                    },
                                                ],
                                            }}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: { display: false },
                                                    title: { display: false },
                                                },
                                                scales: {
                                                    y: { beginAtZero: true, ticks: { color: '#fff' } },
                                                    x: { ticks: { color: '#fff' } },
                                                },
                                            }}
                                        />
                                    </div>
                                    {hasVotes ? (
                                        <div className="mt-4">
                                            <span className="font-semibold">Pemenang:</span>{' '}
                                            {isTied ? (
                                                <span className="text-yellow-400 font-bold">Hasil Seimbang</span>
                                            ) : winner ? (
                                                <span className="text-[#6467f2] font-bold">{winner.name} ({winner.votes} suara)</span>
                                            ) : null}
                                        </div>
                                    ) : (
                                        <div className="mt-4 text-gray-400 text-center py-2 bg-gray-800/30 rounded-lg">
                                            Belum ada suara yang masuk
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-gray-400">Belum ada hasil voting.</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VotingHistoryPage;
