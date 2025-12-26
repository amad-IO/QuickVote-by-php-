import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Vote, Shield, TrendingUp, Lock, Menu, X } from 'lucide-react';

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a1d35] to-[#0f1123] text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#1a1d35]/80 border-b border-gray-800/50">
                <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Vote className="w-6 h-6 text-indigo-500" />
                        <span className="text-xl font-semibold">QuickVote</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
                        <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-200">Features</a>
                        <a href="#how" className="text-gray-300 hover:text-white transition-colors duration-200">How It Works</a>
                        <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-200">Pricing</a>
                    </nav>

                    {/* Desktop Action Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login" className="text-gray-300 hover:text-white transition-colors duration-200">Login</Link>
                        <Link
                            to="/register"
                            className="bg-indigo-600 hover:bg-opacity-90 hover:shadow-lg hover:shadow-indigo-500/50 px-6 py-2 rounded-lg transition-all duration-300 text-white hover:text-white font-medium"
                        >
                            Get started
                        </Link>
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
                    <div className="md:hidden bg-[#1a1d35] border-t border-gray-800/50 animate-in slide-in-from-top">
                        <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
                            <a
                                href="#features"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-gray-300 hover:text-white transition-colors py-2"
                            >
                                Features
                            </a>
                            <a
                                href="#how"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-gray-300 hover:text-white transition-colors py-2"
                            >
                                How It Works
                            </a>
                            <a
                                href="#pricing"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-gray-300 hover:text-white transition-colors py-2"
                            >
                                Pricing
                            </a>
                            <div className="border-t border-gray-800 pt-4 flex flex-col gap-3">
                                <Link
                                    to="/login"
                                    className="text-center text-gray-300 hover:text-white transition-colors py-2"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 hover:bg-opacity-90 hover:shadow-lg text-center px-6 py-2 rounded-lg transition-all duration-300 text-white hover:text-white font-medium"
                                >
                                    Create a Vote
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 sm:px-6 py-20 sm:py-32 pt-28 sm:pt-40 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="text-indigo-400 mb-4 text-sm sm:text-base">
                        ✓ Built on Enterprise-Grade Security
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        Secure, Scalable Voting for the Modern Web
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
                        Buat polling dan pemilihan yang handal dalam hitungan detik. Dibuat untuk developer, dipercaya oleh organisasi di seluruh dunia. Cukup daftar dan biarkan kami melakukan sisanya.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-indigo-600 hover:bg-opacity-90 hover:shadow-lg hover:shadow-indigo-500/50 px-6 sm:px-8 py-3 sm:py-4 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 text-white hover:text-white font-medium"
                        >
                            <Vote className="w-5 h-5" />
                            Create a Vote
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto mt-16 sm:mt-20">
                    <div className="bg-[#1f2342]/30 p-4 sm:p-6 rounded-lg border border-gray-800/30">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">1M+</div>
                        <div className="text-gray-400 text-sm sm:text-base">Votes Cast</div>
                    </div>
                    <div className="bg-[#1f2342]/30 p-4 sm:p-6 rounded-lg border border-gray-800/30">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">10k+</div>
                        <div className="text-gray-400 text-sm sm:text-base">Active Users</div>
                    </div>
                    <div className="bg-[#1f2342]/30 p-4 sm:p-6 rounded-lg border border-gray-800/30">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">99.99%</div>
                        <div className="text-gray-400 text-sm sm:text-base">Uptime</div>
                    </div>
                    <div className="bg-[#1f2342]/30 p-4 sm:p-6 rounded-lg border border-gray-800/30">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">256-bit</div>
                        <div className="text-gray-400 text-sm sm:text-base">Encryption</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Why QuickVote?</h2>
                <p className="text-center text-gray-400 mb-12 sm:mb-16 max-w-2xl mx-auto px-4">
                    Built with top tier reliability and security, your users demand. We handle the complexity so you can focus on the content.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
                    <div className="bg-[#1f2342] border border-indigo-900/30 p-6 sm:p-8 rounded-lg hover:-translate-y-2 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer">
                        <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-4">
                            <Lock className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">End-to-End Encryption</h3>
                        <p className="text-gray-400">
                            Setiap suara terenkripsi penuh, memastikan hanya pengguna yang berwenang memiliki akses ke data voting penting Anda. Kami tidak akan pernah tahu salinannya sejak awal. Tidak pernah.
                        </p>
                    </div>

                    <div className="bg-[#1f2342] border border-indigo-900/30 p-6 sm:p-8 rounded-lg hover:-translate-y-2 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer">
                        <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Instant Scale</h3>
                        <p className="text-gray-400">
                            Baik 10 atau 10 juta pengguna, infrastruktur kami menangani traffic secara real-time, tanpa lag dan performa yang tidak terganggu.
                        </p>
                    </div>

                    <div className="bg-[#1f2342] border border-indigo-900/30 p-6 sm:p-8 rounded-lg hover:-translate-y-2 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer">
                        <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-4">
                            <TrendingUp className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Real-Time Analytics</h3>
                        <p className="text-gray-400">
                            Lacak suara secara real-time, pantau keterlibatan, dan dapatkan wawasan yang dapat ditindaklanjuti dengan laporan otomatis.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how" className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
                <div className="text-center mb-12 sm:mb-16">
                    <div className="text-gray-500 mb-2 text-sm sm:text-base">Three Steps</div>
                    <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                        Get your first poll running in minutes. No coding required, just a series of point-and-clicks you know well.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-12 sm:space-y-16">
                    <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 transform hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 cursor-pointer">
                            <div className="text-xl sm:text-2xl font-bold">1</div>
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-semibold mb-3">Create Poll</h3>
                            <p className="text-gray-400">
                                Define your candidates, set up security settings, and configure advanced options for distribution.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 transform hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 cursor-pointer">
                            <div className="text-xl sm:text-2xl font-bold">2</div>
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-semibold mb-3">Share Link</h3>
                            <p className="text-gray-400">
                                In seconds, a secure, optimized link for the poll is created. You'll also get a link to social media, or embed it easily.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 transform hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 cursor-pointer">
                            <div className="text-xl sm:text-2xl font-bold">3</div>
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-semibold mb-3">Cast Vote</h3>
                            <p className="text-gray-400">
                                Users cast votes in a simple, clean interface. Use multiple formats: ratings, ranked choices, or standard yes/no votes.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 transform hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 cursor-pointer">
                            <div className="text-xl sm:text-2xl font-bold">4</div>
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-semibold mb-3">Analyze Results</h3>
                            <p className="text-gray-400">
                                View real-time breakdowns, voting spikes, voter insights, and export contact results.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
                {/* Section removed */}
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Vote className="w-5 h-5 text-indigo-500" />
                                <span className="font-semibold">QuickVote</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Modern voting platform for the modern web. We deliver secure solutions trusted by developers globally.
                            </p>
                        </div>
                        <div>
                            <div className="text-white mb-4 font-semibold text-sm">PRODUCT</div>
                            <div className="space-y-2 text-gray-400 text-sm">
                                <div className="hover:text-white transition-colors cursor-pointer">Features</div>
                                <div className="hover:text-white transition-colors cursor-pointer">Pricing</div>
                                <div className="hover:text-white transition-colors cursor-pointer">API Docs</div>
                                <div className="hover:text-white transition-colors cursor-pointer">Integration</div>
                            </div>
                        </div>
                        <div>
                            <div className="text-white mb-4 font-semibold text-sm">RESOURCES</div>
                            <div className="space-y-2 text-gray-400 text-sm">
                                <div className="hover:text-white transition-colors cursor-pointer">Documentation</div>
                                <div className="hover:text-white transition-colors cursor-pointer">Case Studies</div>
                                <div className="hover:text-white transition-colors cursor-pointer">Community</div>
                                <div className="hover:text-white transition-colors cursor-pointer">Help Center</div>
                            </div>
                        </div>
                        <div>
                            <div className="text-white mb-4 font-semibold text-sm">LEGAL</div>
                            <div className="space-y-2 text-gray-400 text-sm">
                                <div className="hover:text-white transition-colors cursor-pointer">Privacy</div>
                                <div className="hover:text-white transition-colors cursor-pointer">Terms of Service</div>
                                <div className="hover:text-white transition-colors cursor-pointer">Security</div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
                        © 2023 QuickVote Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}