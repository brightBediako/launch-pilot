import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from './store/authStore';
import TopBanner from './components/TopBanner';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LaunchesPage from './pages/LaunchesPage';
import LaunchDetailPage from './pages/LaunchDetailPage';
import LaunchNewPage from './pages/LaunchNewPage';
import PartnersPage from './pages/PartnersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';

// Create QueryClient instance
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            retry: 1,
        },
    },
});

function App() {
    const { isAuthenticated, fetchCurrentUser } = useAuthStore();

    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token && !isAuthenticated) {
            fetchCurrentUser().catch(() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            });
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <TopBanner />
                <Navbar />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
                <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/launches"
                    element={
                        <ProtectedRoute>
                            <LaunchesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/launches/new"
                    element={
                        <ProtectedRoute>
                            <LaunchNewPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/launches/:id"
                    element={
                        <ProtectedRoute>
                            <LaunchDetailPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/partners"
                    element={
                        <ProtectedRoute>
                            <PartnersPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <AnalyticsPage />
                        </ProtectedRoute>
                    }
                />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
