import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import ProtectedRoute from "./components/common/ProtectedRoute";
import LandingPage from "./components/pages/LandingPage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import VotingPageNew from "./components/pages/VotingPageNew";
import DashboardOne from "./components/pages/DashboardOne";
import DashboardTwo from "./components/pages/DashboardTwo";
import VotingHistoryPage from "./components/pages/VotingHistoryPage";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes - No authentication required */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Public Voting - Anyone can view and vote */}
                <Route path="/vote/:id" element={<VotingPageNew />} />

                {/* Protected Routes - Require authentication */}
                <Route
                    path="/dashboard/one"
                    element={
                        <ProtectedRoute>
                            <DashboardOne />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/two"
                    element={
                        <ProtectedRoute>
                            <DashboardTwo />
                        </ProtectedRoute>
                    }
                />

                {/* Voting History - Protected */}
                <Route
                    path="/voting-history"
                    element={
                        <ProtectedRoute>
                            <VotingHistoryPage />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
