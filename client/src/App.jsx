import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
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
        <Router>
            <Navbar />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
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
