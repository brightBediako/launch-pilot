import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useLaunchStore from '../store/launchStore';
import useAuthStore from '../store/authStore';

export default function DashboardPage() {
    const { isAuthenticated } = useAuthStore();
    const { user } = useAuthStore();

    // Mock launches data
    const mockLaunches = [
        {
            _id: '1',
            title: 'Mobile Banking App Launch',
            description: 'Launch our new fintech app for Nigeria market',
            status: 'active',
            targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            productType: 'mobile app',
            progress: 65,
        },
        {
            _id: '2',
            title: 'E-commerce Platform Expansion',
            description: 'Expand to Ghana, Kenya, and Uganda markets',
            status: 'planning',
            targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            productType: 'web platform',
            progress: 25,
        },
        {
            _id: '3',
            title: 'AI Chat Assistant',
            description: 'Launch AI-powered customer support tool',
            status: 'active',
            targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            productType: 'SaaS',
            progress: 80,
        },
        {
            _id: '4',
            title: 'Supply Chain Dashboard',
            description: 'B2B logistics tracking solution',
            status: 'completed',
            targetDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            productType: 'enterprise software',
            progress: 100,
        },
        {
            _id: '5',
            title: 'Social Commerce Integration',
            description: 'Add shopping features to social platforms',
            status: 'planning',
            targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            productType: 'feature',
            progress: 10,
        },
    ];

    const stats = [
        { label: 'Total Launches', value: mockLaunches.length, color: 'bg-blue-100 text-blue-800' },
        { label: 'Active', value: mockLaunches.filter((l) => l.status === 'active').length, color: 'bg-green-100 text-green-800' },
        { label: 'Planning', value: mockLaunches.filter((l) => l.status === 'planning').length, color: 'bg-yellow-100 text-yellow-800' },
        { label: 'Completed', value: mockLaunches.filter((l) => l.status === 'completed').length, color: 'bg-purple-100 text-purple-800' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name || 'Founder'}! 🚀</h1>
                    <p className="text-gray-600 mt-2">Manage your product launches and track progress</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="card">
                            <div className={`inline-block ${stat.color} rounded-lg p-3 mb-4`}>
                                <span className="text-2xl font-bold">{stat.value}</span>
                            </div>
                            <p className="text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link to="/launches/new" className="card hover:shadow-lg transition-shadow text-center">
                            <div className="text-4xl mb-2">📋</div>
                            <h3 className="font-bold text-gray-900">New Launch</h3>
                            <p className="text-sm text-gray-600">Create a new product launch</p>
                        </Link>
                        <Link to="/partners" className="card hover:shadow-lg transition-shadow text-center">
                            <div className="text-4xl mb-2">🤝</div>
                            <h3 className="font-bold text-gray-900">Find Partners</h3>
                            <p className="text-sm text-gray-600">Collaborate with experts</p>
                        </Link>
                        <Link to="/analytics" className="card hover:shadow-lg transition-shadow text-center">
                            <div className="text-4xl mb-2">📊</div>
                            <h3 className="font-bold text-gray-900">View Analytics</h3>
                            <p className="text-sm text-gray-600">Track your progress</p>
                        </Link>
                    </div>
                </div>

                {/* Recent Launches */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Recent Launches</h2>
                        <Link to="/launches" className="text-primary-600 hover:text-primary-700 font-medium">
                            View All →
                        </Link>
                    </div>

                    {mockLaunches.length > 0 ? (
                        <div className="space-y-4">
                            {mockLaunches.slice(0, 5).map((launch) => (
                                <Link key={launch._id} to={`/launches/${launch._id}`}>
                                    <div className="card hover:shadow-lg transition-shadow">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900">{launch.title}</h3>
                                                <p className="text-gray-600 text-sm mt-1">{launch.description}</p>
                                            </div>
                                            <span className={`badge whitespace-nowrap ml-4 ${launch.status === 'active' ? 'bg-green-100 text-green-800' :
                                                launch.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-purple-100 text-purple-800'
                                                }`}>
                                                {launch.status}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                            <div
                                                className="bg-primary-600 h-2 rounded-full"
                                                style={{ width: `${launch.progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-600">
                                            <span>{launch.progress}% complete</span>
                                            <span>Target: {launch.targetDate.toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center py-8">
                            <p className="text-gray-600 mb-4">No launches yet. Start your first launch!</p>
                            <Link to="/launches/new" className="btn-primary">
                                Create Launch
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
