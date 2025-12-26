import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Vote, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { login } from '../../services/api';

interface LoginPageProps {
    setIsAuthenticated: (value: boolean) => void;
}

export default function LoginPage({ setIsAuthenticated }: LoginPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Check for session expiration message
    useEffect(() => {
        const expired = searchParams.get('expired');
        if (expired === 'true') {
            setError('Your session has expired. Please log in again.');
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Call the login API
            const response = await login(email, password);

            // Save user info to localStorage
            if (response.user) {
                localStorage.setItem('currentUser', JSON.stringify(response.user));
            }

            // On success, navigate to return URL or default dashboard
            setIsAuthenticated(true);

            // Get return URL from query params, default to dashboard
            const returnUrl = searchParams.get('returnUrl');
            const destination = returnUrl ? decodeURIComponent(returnUrl) : '/dashboard/one';

            navigate(destination);
        } catch (err: any) {
            // Handle error
            setError(err.message || 'Email atau password salah');
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
                    <h1 className="text-2xl sm:text-3xl text-white text-center mb-2 font-bold">QuickVote</h1>
                    <p className="text-gray-400 text-center mb-8 text-sm sm:text-base">
                        Welcome back! Sign in to cast your secure vote.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
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

                        {/* Error Message */}
                        {error && (
                            <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-4 animate-in slide-in-from-top">
                                {error}
                            </div>
                        )}

                        {/* Forgot Password */}
                        <div className="text-right">
                            <a href="#" className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors">
                                Forgot Password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-opacity-90 hover:shadow-lg hover:shadow-indigo-500/50 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Secure Login'}
                            <Lock className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-700"></div>
                        <div className="text-gray-500 text-sm">OR</div>
                        <div className="flex-1 h-px bg-gray-700"></div>
                    </div>

                    {/* Register Link */}
                    <div className="text-center text-gray-400 text-sm sm:text-base">
                        Don't have an account yet?{' '}
                        <Link to="/register" className="text-white hover:text-indigo-400 transition-colors font-medium">
                            Create an account
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
