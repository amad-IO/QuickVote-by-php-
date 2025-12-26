import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, AlertCircle, Lock, TrendingUp, Users } from 'lucide-react';
import { getPoll, submitVote, getPollResults } from '../../services/api';

interface Candidate {
    id: string;
    poll_id: string;
    name: string;
    description: string;
    photo: string | null;
    vote_count?: number;
}

interface Poll {
    id: string;
    title: string;
    candidates: Candidate[];
    is_active: boolean;
}

interface VoteResults {
    total_votes: number;
    candidates: {
        id: string;
        name: string;
        votes: number;
        percentage: number;
    }[];
}

const VotingPageNew: React.FC = () => {
    const { id: pollId } = useParams<{ id?: string }>();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [results, setResults] = useState<VoteResults | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [voted, setVoted] = useState(false);

    // Load poll data
    const loadPoll = async () => {
        try {
            const data = await getPoll(pollId!);
            setPoll(data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading poll:', error);
            setPoll(null);
            setLoading(false);
        }
    };

    // Load results for charts
    const loadResults = async () => {
        try {
            const data = await getPollResults(pollId!);
            setResults(data);
        } catch (error) {
            console.error('Error loading results:', error);
        }
    };

    useEffect(() => {
        if (pollId) {
            loadPoll();
            loadResults();

            // Auto-refresh every 5 seconds
            const interval = setInterval(() => {
                loadResults();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [pollId]);

    const handleSelectCandidate = (candidateId: string) => {
        setSelectedCandidate(candidateId);
        setShowEmailModal(true);
    };

    const handleVoteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !selectedCandidate) return;

        try {
            await submitVote(pollId!, email, selectedCandidate);
            setVoted(true);
            setShowEmailModal(false);

            // Refresh results immediately
            await loadResults();

            // Auto reload page after 1 second to show updated chart
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            alert('Error submitting vote. Please try again.');
        }
    };

    // Calculate circular chart path
    const getCirclePath = (percentage: number, offset: number = 0) => {
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const dashArray = (percentage / 100) * circumference;
        const dashOffset = -offset * circumference / 100;

        return { dashArray: `${dashArray} ${circumference}`, dashOffset };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#1a1d35] to-[#0f1123] flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (!poll) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#1a1d35] to-[#0f1123] flex items-center justify-center px-6">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h1 className="text-3xl text-white mb-2">Voting Tidak Ditemukan</h1>
                    <p className="text-gray-400">Link voting tidak valid atau sudah dihapus</p>
                </div>
            </div>
        );
    }

    if (!poll.is_active) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#1a1d35] to-[#0f1123] flex items-center justify-center px-6">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <h1 className="text-3xl text-white mb-2">Voting Belum Aktif</h1>
                    <p className="text-gray-400">Voting ini belum dimulai oleh administrator</p>
                </div>
            </div>
        );
    }

    const totalVotes = results?.total_votes || 0;
    const candidateResults = results?.candidates || [];

    return (
        <div className="min-h-screen bg-[#0f1123] text-white flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#101122]/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center size-8 rounded bg-[#6467f2] text-white">
                                <Play className="w-5 h-5" fill="currentColor" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">QuickVote</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider">LIVE</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#191a33] border border-gray-800">
                                <Lock className="w-4 h-4" />
                                <span className="text-xs font-semibold hidden sm:inline-block">Secure Connection</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}

            <main className="flex-grow flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Hero Section */}
                <div className="w-full max-w-3xl flex flex-col items-center text-center mb-12 border-b border-gray-800 pb-8">
                    <div className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded bg-[#6467f2]/10 text-[#6467f2] text-xs font-bold uppercase tracking-wider">
                        <Users className="w-4 h-4" />
                        Campus Election
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 leading-[1.1]">
                        Live Election Overview: {poll.title}
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-xl mx-auto">
                        View real-time election status, vote distribution, and activity. Cast your vote below before the timer runs out.
                    </p>
                </div>

                {/* Cast Your Vote Section */}
                <div className="w-full max-w-4xl flex flex-col items-center mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Cast Your Vote</h2>
                    <p className="text-md text-gray-400 leading-relaxed max-w-xl mb-8 mx-auto">
                        Please select one candidate from the list below.
                    </p>

                    {/* Candidate Cards */}
                    <div className="w-full flex flex-col items-center justify-center gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                        {poll.candidates.map((candidate, index) => (
                            <div key={candidate.id} className="group flex flex-col rounded-2xl bg-[#191a33] shadow-sm hover:shadow-xl hover:shadow-[#6467f2]/10 border border-gray-800 transition-all duration-300 overflow-hidden relative w-full max-w-xs mx-auto">
                                <div className="absolute top-4 right-4 z-10">
                                    <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur text-xs font-bold border border-white/10">
                                        #{String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>
                                <div
                                    className="w-full aspect-[4/3] bg-cover bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-500"
                                    style={{
                                        backgroundImage: candidate.photo
                                            ? `url('${candidate.photo}')`
                                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    }}
                                />
                                <div className="p-6 flex flex-col grow">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold mb-1 group-hover:text-[#6467f2] transition-colors">
                                            {candidate.name}
                                        </h3>
                                        <p className="text-sm text-gray-400">{candidate.description}</p>
                                    </div>
                                    <div className="mb-6 grow">
                                        <div className="flex items-start gap-2 mb-2">
                                            <TrendingUp className="w-5 h-5 text-[#6467f2]" />
                                            <p className="text-sm font-medium">Visi & Misi</p>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2">
                                            {candidate.description}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleSelectCandidate(candidate.id)}
                                        disabled={voted}
                                        className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#6467f2] hover:bg-[#5558d9] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold transition-all active:scale-[0.98]"
                                    >
                                        <span>{voted ? 'Voted' : 'Pilih Kandidat'}</span>
                                        <Play className="w-4 h-4" fill="currentColor" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Charts Section */}
                <div className="w-full flex flex-col items-center mt-12 pt-8 border-t border-gray-800">
                    <div className="w-full max-w-md">
                        <div className="rounded-2xl bg-[#191a33] shadow-sm border border-gray-800 p-6 h-full">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold">Vote Distribution</h3>
                                    <p className="text-sm text-gray-400">Visual breakdown of vote shares</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-8 py-4">
                                {/* Circular Chart */}
                                <div className="relative w-56 h-56 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="12" />
                                        {candidateResults.map((candidate, index) => {
                                            const colors = ['#6467f2', '#a855f7', '#d946ef'];
                                            const offset = candidateResults.slice(0, index).reduce((sum, c) => sum + c.percentage, 0);
                                            const path = getCirclePath(candidate.percentage, offset);
                                            return (
                                                <circle
                                                    key={candidate.id}
                                                    cx="50"
                                                    cy="50"
                                                    r="40"
                                                    fill="none"
                                                    stroke={colors[index % colors.length]}
                                                    strokeWidth="12"
                                                    strokeDasharray={path.dashArray}
                                                    strokeDashoffset={path.dashOffset}
                                                />
                                            );
                                        })}
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <span className="text-3xl font-bold tracking-tight">{totalVotes.toLocaleString()}</span>
                                        <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest mt-1">Votes</span>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="w-full space-y-3">
                                    {candidateResults.map((candidate, index) => {
                                        const colors = ['#6467f2', '#a855f7', '#d946ef'];
                                        return (
                                            <div key={candidate.id} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: colors[index % colors.length] }}
                                                    />
                                                    <span className="text-gray-300">{candidate.name}</span>
                                                </div>
                                                <span className="font-bold">{candidate.percentage.toFixed(1)}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-8 mt-auto">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-500">
                        <p>© 2024 QuickVote Systems. All rights reserved.</p>
                        <span className="hidden md:inline-block w-1 h-1 rounded-full bg-gray-600"></span>
                        <div className="flex gap-4">
                            <a className="hover:text-[#6467f2] transition-colors" href="#">Privacy Policy</a>
                            <a className="hover:text-[#6467f2] transition-colors" href="#">Terms of Service</a>
                            <a className="hover:text-[#6467f2] transition-colors" href="#">Support</a>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                        <Lock className="w-4 h-4" />
                        <span className="text-xs font-medium">256-bit SSL Encrypted</span>
                    </div>
                </div>
            </footer>

            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#191a33] p-6 rounded-xl max-w-md w-full border border-gray-800">
                        <h3 className="text-xl font-bold mb-4">Enter Your Email</h3>
                        <form onSubmit={handleVoteSubmit}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#6467f2] focus:border-transparent mb-4"
                                required
                            />
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEmailModal(false)}
                                    className="flex-1 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-lg bg-[#6467f2] hover:bg-[#5558d9] transition font-bold"
                                >
                                    Submit Vote
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VotingPageNew;
