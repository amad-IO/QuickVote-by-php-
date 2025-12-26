import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Vote, Plus, BarChart3, LogOut, Menu, X } from 'lucide-react';
import { getResults } from '../../services/api';

const DashboardOne: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const response = await getResults();
                // API returns {data: [...]} so extract the array
                setResults(response.data || response);
            } catch (err: any) {
                setError(err.message || 'Error fetching results');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    const handleLogout = () => {
        // Clear ALL authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');

        // Force page reload to clear React state and trigger ProtectedRoute check
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a1d35] to-[#0f1123] text-white">
            {/* Header */}
            <header className="border-b border-gray-800 sticky top-0 bg-[#1a1d35]/95 backdrop-blur-md z-40">
                <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Vote className="w-6 h-6 text-indigo-500" />
                        <span className="text-lg sm:text-xl font-semibold">QuickVote</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-gray-400 text-sm">Halo, <span className="text-white font-medium">{currentUser.name}</span></div>
                        <button
                            onClick={handleLogout}
                            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-white p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-[#1a1d35] border-t border-gray-800/50">
                        <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
                            <div className="text-gray-400 text-sm">
                                Halo, <span className="text-white font-medium">{currentUser.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-left text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Welcome Section */}
                    <div className="text-center mb-8 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Selamat Datang di QuickVote</h1>
                        <p className="text-lg sm:text-xl text-gray-400">
                            Platform voting modern untuk kebutuhan Anda
                        </p>
                    </div>

                    {/* Action Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
                        {/* Create New Poll */}
                        <Link
                            to="/dashboard/two"
                            className="bg-[#1f2342] border border-indigo-900/30 rounded-2xl p-6 sm:p-8 hover:-translate-y-1 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Plus className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Buat Voting Baru</h2>
                            <p className="text-sm sm:text-base text-gray-400">
                                Mulai membuat voting baru dengan menambahkan kandidat dan mengatur preferensi
                            </p>
                        </Link>

                        {/* View Results */}
                        <Link
                            to="/voting-history"
                            className="bg-[#1f2342] border border-indigo-900/30 rounded-2xl p-6 sm:p-8 hover:-translate-y-1 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                                <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Lihat Hasil Voting</h2>
                            <p className="text-sm sm:text-base text-gray-400">
                                Pantau hasil voting secara real-time dan analisis data pemilih
                            </p>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                        <div className="bg-[#1f2342] border border-indigo-900/30 rounded-xl p-5 sm:p-6 text-center hover:border-indigo-500/50 transition-all duration-300">
                            <div className="text-3xl sm:text-4xl font-bold text-indigo-400 mb-2">0</div>
                            <div className="text-sm sm:text-base text-gray-400">Total Voting</div>
                        </div>
                        <div className="bg-[#1f2342] border border-indigo-900/30 rounded-xl p-5 sm:p-6 text-center hover:border-indigo-500/50 transition-all duration-300">
                            <div className="text-3xl sm:text-4xl font-bold text-indigo-400 mb-2">0</div>
                            <div className="text-sm sm:text-base text-gray-400">Suara Terkumpul</div>
                        </div>
                        <div className="bg-[#1f2342] border border-indigo-900/30 rounded-xl p-5 sm:p-6 text-center hover:border-indigo-500/50 transition-all duration-300">
                            <div className="text-3xl sm:text-4xl font-bold text-indigo-400 mb-2">0</div>
                            <div className="text-sm sm:text-base text-gray-400">Voting Aktif</div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="bg-[#1f2342] border border-indigo-900/30 rounded-2xl p-6 sm:p-8">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Hasil Voting Terbaru</h2>
                        {loading && <p className="text-gray-400 text-center py-8">Loading results...</p>}
                        {error && <p className="text-red-400 text-center py-8 bg-red-500/10 border border-red-500/20 rounded-lg">{error}</p>}
                        {!loading && !error && results.length === 0 && (
                            <p className="text-gray-400 text-center py-8">Belum ada hasil voting tersedia</p>
                        )}
                        {!loading && !error && results.length > 0 && (
                            <ul className="space-y-3">
                                {results.map((result: any) => (
                                    <li key={result.id} className="bg-[#0f1123] border border-gray-700 rounded-lg p-4 hover:border-indigo-500/50 transition-all duration-300">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                            <span className="font-medium">{result.name}</span>
                                            <span className="text-indigo-400 text-sm sm:text-base">{result.votes} suara</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOne;
