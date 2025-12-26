import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Vote, Mail, Lock, Eye, EyeOff, User, ArrowLeft } from 'lucide-react';
import { register } from '../../services/api';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (password !== confirmPassword) {
            setError('Password tidak cocok');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password minimal 6 karakter');
            setLoading(false);
            return;
        }

        try {
            // Check if email already exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const emailExists = users.find((u: any) => u.email === email);

            if (emailExists) {
                setError('Email sudah terdaftar');
                setLoading(false);
                return;
            }

            // Save new user
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Auto login
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            navigate('/dashboard/one');
        } catch (err: any) {
            setError('Terjadi kesalahan, silakan coba lagi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a1d35] to-[#0f1123] flex items-center justify-center px-4 sm:px-6 py-8">
            <div className="w-full max-w-md">
                {/* Back to Home Link */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="bg-[#1a1d35] border border-gray-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                            <Vote className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl text-white text-center mb-2 font-bold">Buat Akun</h1>
                    <p className="text-gray-400 text-center mb-8 text-sm sm:text-base">
                        Daftar untuk mulai membuat voting Anda
                    </p>

                    {/* Form */}
                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="text-white text-sm font-medium block mb-2">Nama Lengkap</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full bg-[#0f1123] border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                                    required
                                />
                                <User className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-white text-sm font-medium block mb-2">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="user@example.com"
                                    className="w-full bg-[#0f1123] border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                                    required
                                />
                                <Mail className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-white text-sm font-medium block mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#0f1123] border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="text-white text-sm font-medium block mb-2">Konfirmasi Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#0f1123] border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-4 animate-in slide-in-from-top">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-opacity-90 hover:shadow-lg hover:shadow-indigo-500/50 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium mt-6"
                            disabled={loading}
                        >
                            {loading ? 'Mendaftar...' : 'Buat Akun'}
                            <Lock className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-700"></div>
                        <div className="text-gray-500 text-sm">OR</div>
                        <div className="flex-1 h-px bg-gray-700"></div>
                    </div>

                    {/* Login Link */}
                    <div className="text-center text-gray-400 text-sm sm:text-base">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-white hover:text-indigo-400 transition-colors font-medium">
                            Login di sini
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-500 text-xs sm:text-sm mt-8">
                    © 2023 QuickVote Inc. Secure Voting Platform
                </div>
            </div>
        </div>
    );
}
