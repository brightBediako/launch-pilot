import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LaunchesPage() {
    const [statusFilter, setStatusFilter] = useState('');

    // Mock comprehensive launches data
    const mockLaunches = [
        {
            _id: '1',
            title: 'Mobile Banking App Launch',
            description: 'Secure mobile banking solution for Nigerian market with AI fraud detection',
            status: 'active',
            targetDate: new Date(2025, 0, 31),
            productType: 'mobile app',
            budget: '₦500,000',
            team: 3,
            progress: 65,
        },
        {
            _id: '2',
            title: 'E-commerce Platform Expansion',
            description: 'Multi-market expansion to Ghana, Kenya, and Uganda with localized features',
            status: 'planning',
            targetDate: new Date(2025, 2, 15),
            productType: 'web platform',
            budget: '₦1,200,000',
            team: 8,
            progress: 25,
        },
        {
            _id: '3',
            title: 'AI Chat Assistant',
            description: 'AI-powered customer support tool with multilingual support for African markets',
            status: 'active',
            targetDate: new Date(2025, 0, 9),
            productType: 'SaaS',
            budget: '₦300,000',
            team: 4,
            progress: 80,
        },
        {
            _id: '4',
            title: 'Supply Chain Dashboard',
            description: 'B2B logistics tracking solution for supply chain visibility',
            status: 'completed',
            targetDate: new Date(2024, 11, 15),
            productType: 'enterprise software',
            budget: '₦800,000',
            team: 5,
            progress: 100,
        },
        {
            _id: '5',
            title: 'Social Commerce Integration',
            description: 'Add shopping features to social platforms with payment integration',
            status: 'planning',
            targetDate: new Date(2025, 2, 28),
            productType: 'feature',
            budget: '₦250,000',
            team: 2,
            progress: 10,
        },
        {
            _id: '6',
            title: 'Payment Gateway Upgrade',
            description: 'Upgrade payment infrastructure to support more African payment methods',
            status: 'draft',
            targetDate: new Date(2025, 3, 15),
            productType: 'infrastructure',
            budget: '₦600,000',
            team: 6,
            progress: 5,
        },
        {
            _id: '7',
            title: 'Mobile App Redesign',
            description: 'Complete UI/UX overhaul for better user experience and retention',
            status: 'planning',
            targetDate: new Date(2025, 1, 28),
            productType: 'redesign',
            budget: '₦400,000',
            team: 4,
            progress: 15,
        },
        {
            _id: '8',
            title: 'Analytics Dashboard v2',
            description: 'Advanced analytics with predictive insights for business metrics',
            status: 'completed',
            targetDate: new Date(2024, 10, 30),
            productType: 'feature',
            budget: '₦350,000',
            team: 3,
            progress: 100,
        },
        {
            _id: '9',
            title: 'API Documentation Portal',
            description: 'Comprehensive API docs with interactive sandbox and code examples',
            status: 'active',
            targetDate: new Date(2025, 0, 20),
            productType: 'documentation',
            budget: '₦150,000',
            team: 2,
            progress: 70,
        },
        {
            _id: '10',
            title: 'WhatsApp Integration',
            description: 'Native WhatsApp Business API integration for customer engagement',
            status: 'planning',
            targetDate: new Date(2025, 2, 1),
            productType: 'integration',
            budget: '₦200,000',
            team: 2,
            progress: 20,
        },
    ];

    const statuses = ['draft', 'planning', 'active', 'completed', 'cancelled'];
    const filteredLaunches = statusFilter
        ? mockLaunches.filter((l) => l.status === statusFilter)
        : mockLaunches;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Launches</h1>
                        <p className="text-gray-600 mt-2">Manage all your product launches ({mockLaunches.length} total)</p>
                    </div>
                    <Link to="/launches/new" className="btn-primary">
                        + New Launch
                    </Link>
                </div>

                {/* Filters */}
                <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
                    <button
                        onClick={() => setStatusFilter('')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${statusFilter === ''
                            ? 'bg-primary-500 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        All ({mockLaunches.length})
                    </button>
                    {statuses.map((status) => {
                        const count = mockLaunches.filter(l => l.status === status).length;
                        return (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize whitespace-nowrap ${statusFilter === status
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {status} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Launches Grid */}
                {filteredLaunches.length > 0 ? (
                    <div className="grid gap-6">
                        {filteredLaunches.map((launch) => (
                            <Link key={launch._id} to={`/launches/${launch._id}`}>
                                <div className="card hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900">{launch.title}</h3>
                                            <p className="text-gray-600 mt-2 text-sm">{launch.description}</p>
                                        </div>
                                        <span className={`badge whitespace-nowrap ml-4 ${launch.status === 'active' ? 'bg-green-100 text-green-800' :
                                            launch.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                                                launch.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                                                    launch.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-red-100 text-red-800'
                                            }`}>
                                            {launch.status}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">Progress</span>
                                            <span className="text-sm font-bold text-primary-600">{launch.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-primary-600 h-2 rounded-full transition-all"
                                                style={{ width: `${launch.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="grid grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Target Date</p>
                                            <p className="font-semibold text-gray-900">{launch.targetDate.toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Type</p>
                                            <p className="font-semibold text-gray-900 capitalize">{launch.productType}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Budget</p>
                                            <p className="font-semibold text-gray-900">{launch.budget}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Team Size</p>
                                            <p className="font-semibold text-gray-900">{launch.team} members</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="card text-center py-12">
                        <p className="text-gray-600 mb-4">No launches found with this filter</p>
                        <button
                            onClick={() => setStatusFilter('')}
                            className="btn-primary"
                        >
                            View All Launches
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
