import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vote, Plus, Play, Link as LinkIcon, X, ArrowLeft, Copy, CheckCircle, Upload, Square, Trash2 } from 'lucide-react';
import { createPoll, getPolls, startPoll, stopPoll, deletePoll, uploadCandidatePhoto } from '../../services/api';

interface Candidate {
    id: string;
    name: string;
    description: string;
    photo?: string;
}

interface Poll {
    id: string;
    title: string;
    candidates: Candidate[];
    is_active: boolean;
    created_by: number;
    created_at: string;
}

export default function DashboardTwo() {
    // Single voting state instead of array
    const [myVoting, setMyVoting] = useState<Poll | null>(null);

    // Form states (unchanged)
    const [showAddCandidate, setShowAddCandidate] = useState(false);
    const [candidateName, setCandidateName] = useState('');
    const [candidateDesc, setCandidateDesc] = useState('');
    const [candidatePhoto, setCandidatePhoto] = useState('');
    const [pollTitle, setPollTitle] = useState('');
    const [currentCandidates, setCurrentCandidates] = useState<Candidate[]>([]);
    const [generatedLink, setGeneratedLink] = useState('');
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const navigate = useNavigate();

    useEffect(() => {
        loadMyVoting();
    }, []);

    // Load current user's voting only
    const loadMyVoting = async () => {
        try {
            const data = await getPolls();
            console.log('✅ Polls loaded from database:', data);

            // Filter to get only current user's poll (backend enforces one per user)
            const myPoll = data.find((poll: any) => poll.created_by === currentUser.id);
            setMyVoting(myPoll || null);
            console.log('My voting:', myPoll);
        } catch (error) {
            console.error('Error loading voting:', error);
            setMyVoting(null);
        }
    };

    const handleAddCandidate = () => {
        if (!candidateName.trim()) return;

        const newCandidate: Candidate = {
            id: Date.now().toString(),
            name: candidateName,
            description: candidateDesc,
            photo: candidatePhoto
        };

        setCurrentCandidates([...currentCandidates, newCandidate]);
        setCandidateName('');
        setCandidateDesc('');
        setCandidatePhoto('');
        setShowAddCandidate(false);
    };

    const handleRemoveCandidate = (id: string) => {
        setCurrentCandidates(currentCandidates.filter(c => c.id !== id));
    };

    const handleSavePoll = async () => {
        console.log('🔵 handleSavePoll called');
        console.log('📝 Poll Title:', pollTitle);
        console.log('👥 Candidates:', currentCandidates);
        console.log('👤 Current User:', currentUser);

        if (!pollTitle.trim() || currentCandidates.length < 2) {
            console.log('❌ Validation failed');
            alert('Masukkan judul polling dan minimal 2 kandidat');
            return;
        }

        try {
            console.log('📡 Saving poll to database via API...');

            // Photos are already URLs from upload, no compression needed
            const response = await createPoll(pollTitle, currentCandidates);

            console.log('✅ Poll saved to database:', response);

            // Success feedback
            alert('Voting berhasil disimpan ke database!\n\nPoll ID: ' + response.poll.id);

            setPollTitle('');
            setCurrentCandidates([]);
            await loadMyVoting(); // Reload to show the new voting

            console.log('✅ State reset and voting reloaded from database');
        } catch (error: any) {
            console.error('❌ Error in handleSavePoll:', error);

            let errorMessage = 'Terjadi kesalahan saat menyimpan voting';

            // Check if backend is not running
            if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error')) {
                errorMessage = 'Backend tidak running!\n\nJalankan: cd backend && php artisan serve';
            }
            // Check for active/draft poll exists error
            else if (error?.response?.status === 422 && error?.response?.data?.error === 'active_or_draft_poll_exists') {
                errorMessage = '❌ Tidak Bisa Membuat Voting Baru\n\n' +
                    (error?.response?.data?.message || 'Anda masih memiliki voting yang belum selesai.') +
                    '\n\n💡 Cara mengatasi:\n' +
                    '1. Aktifkan voting yang sudah dibuat, lalu stop voting tersebut, ATAU\n' +
                    '2. Hapus voting yang belum dimulai';
            }
            // Other backend errors
            else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            alert('Error: ' + errorMessage);
        }
    };

    const handleStartVoting = async () => {
        if (!myVoting) return;

        try {
            // Call API to start poll
            await startPoll(myVoting.id);

            // Generate link
            const link = `${window.location.origin}/vote/${myVoting.id}`;
            setGeneratedLink(link);
            setShowLinkModal(true);

            // Reload voting to get updated status
            await loadMyVoting();
        } catch (error: any) {
            console.error('Error starting poll:', error);
            alert('Error: ' + (error.message || 'Failed to start poll'));
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleStopVoting = async () => {
        if (!myVoting) return;

        try {
            await stopPoll(myVoting.id);
            await loadMyVoting(); // Reload to get updated status
            alert('Voting berhasil dihentikan!');
        } catch (error) {
            console.error('Error stopping poll:', error);
            alert('Gagal menghentikan voting. Silakan coba lagi.');
        }
    };

    const handleDeletePoll = async () => {
        if (!myVoting) return;

        if (confirm('Apakah Anda yakin ingin menghapus voting ini?')) {
            try {
                console.log('🗑️ Deleting poll:', myVoting.id);

                // Call backend API to delete poll
                await deletePoll(myVoting.id);

                console.log('✅ Poll deleted from database');

                // Reset state to show create form
                setMyVoting(null);

                alert('Voting berhasil dihapus!');
            } catch (error) {
                console.error('❌ Error deleting poll:', error);
                alert('Gagal menghapus voting. Silakan coba lagi.');
            }
        }
    };

    const handleShowLink = () => {
        if (!myVoting) return;
        const link = `${window.location.origin}/vote/${myVoting.id}`;
        setGeneratedLink(link);
        setShowLinkModal(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a1d35] to-[#0f1123] text-white">
            {/* Header */}
            <header className="border-b border-gray-800 sticky top-0 bg-[#1a1d35]/95 backdrop-blur-md z-40">
                <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={() => navigate('/dashboard/one')}
                            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-lg"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            <Vote className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
                            <span className="text-base sm:text-xl font-semibold">Kelola Voting</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="max-w-6xl mx-auto">
                    {myVoting ? (
                        /* Show Voting Status & Management */
                        <div className="bg-[#1f2342] border border-indigo-900/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
                            <h2 className="text-xl sm:text-2xl font-bold mb-6">Status Voting</h2>

                            {/* Voting Info */}
                            <div className="mb-6 pb-6 border-b border-gray-700">
                                <h3 className="text-2xl font-bold mb-2">{myVoting.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span>{myVoting.candidates.length} kandidat</span>
                                    <span>•</span>
                                    {myVoting.is_active ? (
                                        <span className="flex items-center gap-2 text-green-400 font-semibold">
                                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                            Aktif
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2 text-gray-500">
                                            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                                            Draft
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Active Voting Link */}
                            {myVoting.is_active && (
                                <div className="mb-6 p-4 bg-[#0f1123] rounded-lg border border-gray-700">
                                    <div className="text-sm text-gray-400 mb-2">Link Voting:</div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 text-indigo-400 break-all text-sm">
                                            {window.location.origin}/vote/{myVoting.id}
                                        </div>
                                        <button
                                            onClick={handleCopyLink}
                                            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition text-sm"
                                        >
                                            {copied ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                    <span>Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Candidates Grid */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-400 block mb-4">
                                    Kandidat ({myVoting.candidates.length})
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {myVoting.candidates.map((candidate) => (
                                        <div
                                            key={candidate.id}
                                            className="bg-[#0f1123] border border-gray-700 rounded-lg p-4 flex items-center gap-4"
                                        >
                                            {candidate.photo ? (
                                                <img
                                                    src={candidate.photo}
                                                    alt={candidate.name}
                                                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 bg-gray-800 rounded-lg flex-shrink-0 flex items-center justify-center">
                                                    <Upload className="w-8 h-8 text-gray-600" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-indigo-400 uppercase tracking-wide mb-1">Kandidat</div>
                                                <div className="mb-1 truncate font-semibold">{candidate.name}</div>
                                                {candidate.description && (
                                                    <div className="text-sm text-gray-400 line-clamp-1">{candidate.description}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                                {!myVoting.is_active ? (
                                    <button
                                        onClick={handleStartVoting}
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-opacity-90 hover:shadow-lg hover:shadow-indigo-500/50 px-6 py-3 rounded-lg transition-all duration-300 font-medium"
                                    >
                                        <Play className="w-4 h-4" fill="currentColor" />
                                        Mulai Voting
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleShowLink}
                                            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 hover:shadow-lg px-6 py-3 rounded-lg transition-all duration-300 font-medium"
                                        >
                                            <LinkIcon className="w-4 h-4" />
                                            Lihat Link
                                        </button>
                                        <button
                                            onClick={handleStopVoting}
                                            className="flex items-center gap-2 bg-orange-600 hover:bg-opacity-90 hover:shadow-lg hover:shadow-orange-500/50 px-6 py-3 rounded-lg transition-all duration-300 font-medium"
                                        >
                                            <Square className="w-4 h-4" />
                                            Stop
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={handleDeletePoll}
                                    className="flex items-center gap-2 bg-red-600 hover:bg-opacity-90 hover:shadow-lg hover:shadow-red-500/50 px-6 py-3 rounded-lg transition-all duration-300 font-medium"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Show Create New Voting Form */
                        <div className="bg-[#1f2342] border border-indigo-900/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
                            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Buat Voting Baru</h2>

                            {/* Poll Title */}
                            <div className="mb-5 sm:mb-6">
                                <label className="text-sm font-medium text-gray-400 block mb-2">Judul Voting</label>
                                <input
                                    type="text"
                                    value={pollTitle}
                                    onChange={(e) => setPollTitle(e.target.value)}
                                    placeholder="Contoh: Pemilihan Ketua OSIS 2024"
                                    className="w-full bg-[#0f1123] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                                />
                            </div>

                            {/* Candidates List */}
                            <div className="mb-5 sm:mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-sm font-medium text-gray-400">Kandidat ({currentCandidates.length})</label>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                    {currentCandidates.map((candidate) => (
                                        <div
                                            key={candidate.id}
                                            className="bg-[#0f1123] border border-gray-700 rounded-lg overflow-hidden relative group"
                                        >
                                            <button
                                                onClick={() => handleRemoveCandidate(candidate.id)}
                                                className="absolute top-2 right-2 z-10 bg-red-600 hover:bg-red-700 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            {candidate.photo ? (
                                                <img
                                                    src={candidate.photo}
                                                    alt={candidate.name}
                                                    className="w-full h-48 object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                                                    <Upload className="w-12 h-12 text-gray-600" />
                                                </div>
                                            )}
                                            <div className="p-4">
                                                <div className="mb-1 font-semibold">{candidate.name}</div>
                                                <div className="text-sm text-gray-400 line-clamp-2">{candidate.description}</div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Candidate Card */}
                                    <button
                                        onClick={() => setShowAddCandidate(true)}
                                        className="border-2 border-dashed border-gray-700 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center gap-4 min-h-[280px] sm:min-h-[320px] transition-all duration-300 group"
                                    >
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-indigo-600/20 group-hover:bg-indigo-600/30 group-hover:scale-110 flex items-center justify-center transition-all duration-300">
                                            <Plus className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-500" />
                                        </div>
                                        <div className="text-center">
                                            <div className="mb-1 font-medium">Tambah Kandidat</div>
                                            <div className="text-sm text-gray-400">Klik untuk menambahkan kandidat baru</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Save Button */}
                            {currentCandidates.length >= 2 && (
                                <button
                                    type="button"
                                    onClick={handleSavePoll}
                                    className="w-full bg-green-600 hover:bg-opacity-90 hover:shadow-lg hover:shadow-green-500/50 py-3 rounded-lg transition-all duration-300 font-medium text-white"
                                >
                                    Simpan Voting
                                </button>
                            )}
                            {currentCandidates.length < 2 && (
                                <div className="text-gray-400 text-sm text-center py-2">
                                    Tambahkan minimal 2 kandidat untuk menyimpan voting
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Candidate Modal */}
            {showAddCandidate && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
                    <div className="bg-[#1a1d35] border border-gray-800 rounded-2xl p-8 max-w-md w-full">
                        <h3 className="text-2xl mb-6">Tambah Kandidat</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Nama Kandidat</label>
                                <input
                                    type="text"
                                    value={candidateName}
                                    onChange={(e) => setCandidateName(e.target.value)}
                                    placeholder="Nama lengkap kandidat"
                                    className="w-full bg-[#0f1123] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Deskripsi (Opsional)</label>
                                <textarea
                                    value={candidateDesc}
                                    onChange={(e) => setCandidateDesc(e.target.value)}
                                    placeholder="Visi misi atau deskripsi singkat"
                                    className="w-full bg-[#0f1123] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition h-24 resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Foto (Opsional)</label>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-center gap-2 w-full bg-[#0f1123] border border-gray-700 hover:border-indigo-500 rounded-lg px-4 py-3 text-gray-400 cursor-pointer transition">
                                        <Upload className="w-4 h-4" />
                                        <span>Pilih Foto</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    try {
                                                        console.log('📤 Uploading photo...');
                                                        const imageUrl = await uploadCandidatePhoto(file);
                                                        console.log('✅ Photo uploaded:', imageUrl);
                                                        setCandidatePhoto(imageUrl);
                                                    } catch (error) {
                                                        console.error('❌ Upload failed:', error);
                                                        alert('Gagal mengupload foto. Silakan coba lagi.');
                                                    }
                                                }
                                            }}
                                            className="hidden"
                                        />
                                    </label>
                                    {candidatePhoto && (
                                        <div className="relative">
                                            <img
                                                src={candidatePhoto}
                                                alt="Preview"
                                                className="w-full h-32 object-cover rounded-lg border border-gray-700"
                                            />
                                            <button
                                                onClick={() => setCandidatePhoto('')}
                                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 rounded-full p-1 transition"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowAddCandidate(false);
                                        setCandidateName('');
                                        setCandidateDesc('');
                                        setCandidatePhoto('');
                                    }}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg transition"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleAddCandidate}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg transition"
                                >
                                    Tambahkan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Link Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
                    <div className="bg-[#1a1d35] border border-gray-800 rounded-2xl p-8 max-w-md w-full">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-2xl mb-2">Link Voting Berhasil Dibuat!</h3>
                            <p className="text-gray-400">Bagikan link ini kepada pemilih</p>
                        </div>

                        <div className="bg-[#0f1123] border border-gray-700 rounded-lg p-4 mb-4 relative">
                            <div className="text-sm text-gray-400 mb-2">Link Voting:</div>
                            <div className="text-indigo-400 break-all pr-10">{generatedLink}</div>
                            <button
                                onClick={handleCopyLink}
                                className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition"
                                title="Salin Link"
                            >
                                {copied ? (
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                ) : (
                                    <Copy className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLinkModal(false)}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg transition"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => navigate(`/vote/${generatedLink.split('/vote/')[1]}`)}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg transition flex items-center justify-center gap-2"
                            >
                                <Vote className="w-4 h-4" />
                                Buka Halaman Voting
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}