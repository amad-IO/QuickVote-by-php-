import React from 'react';
import { ShieldX, MessageCircle } from 'lucide-react';

interface AlertModalProps {
  onClose: () => void;
}

export default function AlertModal({ onClose }: AlertModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
      <div className="bg-[#1a1d35] border border-gray-700 rounded-2xl p-10 max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-8 h-8 text-indigo-400" />
        </div>

        {/* Title */}
        <h2 className="text-3xl text-white mb-4">Email Already Used</h2>

        {/* Message */}
        <p className="text-gray-400 mb-8 leading-relaxed">
          Our records show that a vote has already been submitted associated with this email address. 
          QuickVote ensures one vote per person for security.
        </p>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg transition mb-4"
        >
          Kembali
        </button>

        {/* Contact Support */}
        <button className="text-gray-400 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto transition">
          <MessageCircle className="w-4 h-4" />
          Contact Support
        </button>
      </div>
    </div>
  );
}