import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function LaunchDetailPage() {
    const { id } = useParams();
    const [showAddTask, setShowAddTask] = useState(false);

    // Mock launch detail data
    const launch = {
        _id: id || '1',
        title: 'Mobile Banking App Launch',
        description: 'Secure mobile banking solution for Nigerian market with AI fraud detection',
        status: 'active',
        targetDate: new Date(2025, 0, 31),
        productType: 'mobile app',
        budget: '₦500,000',
        progress: 65,
        team: [
            { name: 'Amara Okafor', role: 'Product Manager', avatar: '👩' },
            { name: 'Chisom Ejiro', role: 'Lead Developer', avatar: '👨' },
            { name: 'Grace Adeyemi', role: 'Designer', avatar: '👩' },
        ],
        tasks: [
            { id: 1, title: 'Finalize app design mockups', status: 'completed', dueDate: new Date(2024, 11, 15), assignee: 'Grace' },
            { id: 2, title: 'Set up development environment', status: 'completed', dueDate: new Date(2024, 11, 20), assignee: 'Chisom' },
            { id: 3, title: 'Implement authentication system', status: 'in-progress', dueDate: new Date(2025, 0, 5), assignee: 'Chisom' },
            { id: 4, title: 'Build AI fraud detection module', status: 'in-progress', dueDate: new Date(2025, 0, 10), assignee: 'Chisom' },
            { id: 5, title: 'Create marketing materials', status: 'not-started', dueDate: new Date(2025, 0, 15), assignee: 'Amara' },
            { id: 6, title: 'Beta testing with selected users', status: 'not-started', dueDate: new Date(2025, 0, 20), assignee: 'Amara' },
            { id: 7, title: 'Public app launch', status: 'not-started', dueDate: new Date(2025, 0, 31), assignee: 'Amara' },
        ],
        timeline: [
            { date: new Date(2024, 10, 1), event: 'Project kickoff and team formation', icon: '🚀' },
            { date: new Date(2024, 11, 15), event: 'Design mockups completed', icon: '🎨' },
            { date: new Date(2024, 11, 20), event: 'Development environment ready', icon: '💻' },
            { date: new Date(2025, 0, 5), event: 'Authentication system implemented', icon: '🔐' },
            { date: new Date(2025, 0, 10), event: 'AI module integration completed', icon: '🤖' },
            { date: new Date(2025, 0, 20), event: 'Beta testing phase starts', icon: '🧪' },
            { date: new Date(2025, 0, 31), event: 'Public launch', icon: '🎉' },
        ],
        contentDrafts: [
            { id: 1, title: 'App Store Description', type: 'app-store', status: 'completed', lastUpdated: new Date() },
            { id: 2, title: 'Launch Press Release', type: 'press-release', status: 'in-progress', lastUpdated: new Date() },
            { id: 3, title: 'Social Media Campaign Posts', type: 'social-media', status: 'draft', lastUpdated: new Date() },
        ],
    };

    const getTaskStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in-progress': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTaskStatusIcon = (status) => {
        switch (status) {
            case 'completed': return '✅';
            case 'in-progress': return '⏳';
            default: return '⭕';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back button */}
                <Link to="/launches" className="text-primary-600 hover:text-primary-700 font-medium mb-6 inline-block">
                    ← Back to Launches
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">{launch.title}</h1>
                            <p className="text-gray-600 mt-2">{launch.description}</p>
                        </div>
                        <span className={`badge text-lg px-4 py-2 ${launch.status === 'active' ? 'bg-green-100 text-green-800' :
                            launch.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-purple-100 text-purple-800'
                            }`}>
                            {launch.status.toUpperCase()}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                            className="bg-primary-600 h-3 rounded-full transition-all"
                            style={{ width: `${launch.progress}%` }}
                        ></div>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{launch.progress}% Complete</p>
                </div>

                {/* Key Info */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="card">
                        <p className="text-gray-500 text-sm">Target Date</p>
                        <p className="font-bold text-gray-900 text-lg">{launch.targetDate.toLocaleDateString()}</p>
                    </div>
                    <div className="card">
                        <p className="text-gray-500 text-sm">Product Type</p>
                        <p className="font-bold text-gray-900 text-lg capitalize">{launch.productType}</p>
                    </div>
                    <div className="card">
                        <p className="text-gray-500 text-sm">Budget</p>
                        <p className="font-bold text-gray-900 text-lg">{launch.budget}</p>
                    </div>
                    <div className="card">
                        <p className="text-gray-500 text-sm">Team Size</p>
                        <p className="font-bold text-gray-900 text-lg">{launch.team.length} members</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Tasks Section */}
                    <div className="lg:col-span-2">
                        {/* Tasks */}
                        <div className="card mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
                                <button
                                    onClick={() => setShowAddTask(!showAddTask)}
                                    className="btn-primary text-sm"
                                >
                                    + Add Task
                                </button>
                            </div>

                            {showAddTask && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <input type="text" placeholder="Task title..." className="input-field w-full mb-2" />
                                    <input type="date" className="input-field w-full mb-2" />
                                    <button className="btn-primary text-sm mr-2">Add Task</button>
                                    <button
                                        onClick={() => setShowAddTask(false)}
                                        className="btn-outline text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}

                            <div className="space-y-3">
                                {launch.tasks.map((task) => (
                                    <div key={task.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <span className="text-xl">{getTaskStatusIcon(task.status)}</span>
                                        <div className="flex-1">
                                            <h4 className={`font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                                {task.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Due: {task.dueDate.toLocaleDateString()} • Assigned to: {task.assignee}
                                            </p>
                                        </div>
                                        <span className={`badge text-xs whitespace-nowrap ${getTaskStatusColor(task.status)}`}>
                                            {task.status.replace('-', ' ')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Task Summary */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-sm text-blue-600 font-semibold">Completed</p>
                                        <p className="text-2xl font-bold text-blue-900">{launch.tasks.filter(t => t.status === 'completed').length}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-yellow-600 font-semibold">In Progress</p>
                                        <p className="text-2xl font-bold text-yellow-900">{launch.tasks.filter(t => t.status === 'in-progress').length}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold">Pending</p>
                                        <p className="text-2xl font-bold text-gray-900">{launch.tasks.filter(t => t.status === 'not-started').length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="card">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Timeline</h2>
                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute left-4 top-0 bottom-0 w-1 bg-primary-300"></div>

                                {/* Timeline events */}
                                <div className="space-y-6">
                                    {launch.timeline.map((item, idx) => (
                                        <div key={idx} className="relative pl-16">
                                            {/* Timeline dot */}
                                            <div className="absolute left-0 w-9 h-9 bg-white border-4 border-primary-600 rounded-full flex items-center justify-center text-lg">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{item.event}</p>
                                                <p className="text-sm text-gray-600">{item.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        {/* Team */}
                        <div className="card mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Team</h3>
                            <div className="space-y-4">
                                {launch.team.map((member, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <span className="text-2xl">{member.avatar}</span>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
                                            <p className="text-xs text-gray-600">{member.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Content Drafts */}
                        <div className="card">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Content Drafts</h3>
                            <div className="space-y-3">
                                {launch.contentDrafts.map((draft) => (
                                    <div key={draft.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-semibold text-gray-900 text-sm">{draft.title}</p>
                                            <span className={`badge text-xs ${draft.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                draft.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {draft.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600">Last updated: {draft.lastUpdated.toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
