import React from 'react';
import { CheckCircle, Calendar, Clock, Copy, AlertCircle, Upload } from 'lucide-react';

interface SuccessVoteModalProps {
  candidateName: string;
  candidateDescription: string;
  candidatePhoto?: string;
  onClose: () => void;
}

export default function SuccessVoteModal({ 
  candidateName, 
  candidateDescription, 
  candidatePhoto,
  onClose 
}: SuccessVoteModalProps) {
  // Generate transaction ID
  const transactionId = `0x${Math.random().toString(16).substring(2, 15)}...e4b1`;
  
  // Get current date and time
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';

  const handleCopyTransaction = () => {
    navigator.clipboard.writeText(transactionId);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
      <div className="bg-[#1a1d35] border border-gray-700 rounded-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center">
          {/* Icon with animation */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
            <div className="relative w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" fill="white" />
            </div>
            {/* Small blue dot */}
            <div className="absolute -top-1 right-2 w-6 h-6 bg-indigo-500 rounded-full border-4 border-[#1a1d35] flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl text-white mb-3">Terima Kasih!</h2>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed">
            Suara Anda telah berhasil direkam dan diamankan di dalam sistem blockchain kami.
          </p>
        </div>

        {/* Vote Proof Card */}
        <div className="px-8 pb-8">
          <div className="bg-[#0f1123] border border-gray-700 rounded-xl p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-400 uppercase tracking-wide">Bukti Suara</div>
              <div className="flex items-center gap-1.5 bg-green-600/20 px-2.5 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-400">Verified</span>
              </div>
            </div>

            {/* Candidate Info */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-700">
              <div className="text-gray-500 text-sm">Pilihan Anda</div>
            </div>

            <div className="flex items-center gap-4 mb-5">
              {candidatePhoto ? (
                <img
                  src={candidatePhoto}
                  alt={candidateName}
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 bg-gray-800 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-600" />
                </div>
              )}
              <div>
                <div className="text-white mb-1">{candidateName}</div>
                <div className="text-sm text-indigo-400">{candidateDescription}</div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Tanggal</div>
                <div className="flex items-center gap-2 text-white text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {dateStr}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Waktu</div>
                <div className="flex items-center gap-2 text-white text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {timeStr}
                </div>
              </div>
            </div>

            {/* Transaction ID */}
            <div>
              <div className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Transaction ID</div>
              <div className="flex items-center justify-between bg-[#1a1d35] rounded-lg px-3 py-2">
                <span className="text-sm text-gray-300 font-mono">{transactionId}</span>
                <button 
                  onClick={handleCopyTransaction}
                  className="text-indigo-400 hover:text-indigo-300 transition"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 mt-4 text-xs text-gray-500">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Vote ini tidak dapat diubah atau dihapus setelah disubmit.</span>
          </div>
        </div>

        {/* Close Button */}
        <div className="px-8 pb-8">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-lg transition"
          >
            Lihat Hasil Real-time
          </button>
        </div>
      </div>
    </div>
  );
}
