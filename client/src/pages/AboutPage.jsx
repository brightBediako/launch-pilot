import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    const team = [
        { name: 'Amara Okafor', role: 'Founder & CEO', bio: 'Serial entrepreneur with 10+ years in tech', avatar: '👩‍💼' },
        { name: 'Chisom Ejiro', role: 'CTO', bio: 'Full-stack engineer passionate about African tech', avatar: '👨‍💻' },
        { name: 'Grace Adeyemi', role: 'Head of Product', bio: 'Product strategist focused on user experience', avatar: '👩‍💼' },
        { name: 'David Mensah', role: 'VP Marketing', bio: 'Growth hacker with expertise in African markets', avatar: '👨‍💼' },
    ];

    const values = [
        {
            title: 'Innovation',
            description: 'We leverage cutting-edge AI and technology to solve real problems for African entrepreneurs',
            icon: '💡',
        },
        {
            title: 'Accessibility',
            description: 'Making world-class product launch tools affordable and accessible to everyone',
            icon: '🌍',
        },
        {
            title: 'Community',
            description: 'Building a thriving community of founders and experts across Africa',
            icon: '🤝',
        },
        {
            title: 'Excellence',
            description: 'Committed to delivering the highest quality product and service',
            icon: '⭐',
        },
    ];

    const milestones = [
        { year: '2024', event: 'LaunchPilot founded in Lagos, Nigeria' },
        { year: '2024', event: 'Launched MVP with 51 API endpoints' },
        { year: '2025', event: 'Expanded to 5 African markets' },
        { year: '2025', event: 'Reached 1000+ active users' },
        { year: '2025', event: 'Secured Series A funding' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold mb-4">About LaunchPilot</h1>
                    <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                        Empowering African entrepreneurs to launch products faster with AI-powered insights and expert collaboration
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
                        <p className="text-lg text-gray-700 mb-4">
                            LaunchPilot was founded with a simple belief: African entrepreneurs deserve access to the same world-class tools and expertise as their counterparts in Silicon Valley.
                        </p>
                        <p className="text-lg text-gray-700 mb-4">
                            We're building an AI-powered platform that combines intelligent planning, expert collaboration, and real-time analytics to help founders launch products faster and smarter.
                        </p>
                        <p className="text-lg text-gray-700">
                            Our goal is to become the go-to platform for product launches across Africa, creating thousands of success stories and job opportunities.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-primary-100 to-blue-100 rounded-lg p-12 text-center">
                        <div className="text-6xl mb-4">🚀</div>
                        <p className="text-xl font-bold text-gray-900">Launching the future of African tech</p>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, idx) => (
                            <div key={idx} className="card text-center">
                                <div className="text-5xl mb-4">{value.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-700">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Meet the Team</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, idx) => (
                        <div key={idx} className="card text-center">
                            <div className="text-6xl mb-4">{member.avatar}</div>
                            <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                            <p className="text-primary-600 font-semibold mb-2">{member.role}</p>
                            <p className="text-gray-700 text-sm">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Journey</h2>
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-200"></div>

                        {/* Timeline items */}
                        <div className="space-y-12">
                            {milestones.map((milestone, idx) => (
                                <div key={idx} className={`flex ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center gap-8`}>
                                    {/* Timeline dot */}
                                    <div className="hidden md:flex w-1/2 justify-end">
                                        {idx % 2 === 0 && (
                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-primary-600">{milestone.year}</div>
                                                <p className="text-gray-700">{milestone.event}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Dot */}
                                    <div className="hidden md:block w-8 h-8 bg-primary-600 rounded-full border-4 border-white"></div>

                                    {/* Content */}
                                    <div className="md:hidden w-full card">
                                        <div className="text-3xl font-bold text-primary-600 mb-2">{milestone.year}</div>
                                        <p className="text-gray-700">{milestone.event}</p>
                                    </div>

                                    {/* Right side for desktop */}
                                    <div className="hidden md:block w-1/2">
                                        {idx % 2 === 1 && (
                                            <div>
                                                <div className="text-3xl font-bold text-primary-600">{milestone.year}</div>
                                                <p className="text-gray-700">{milestone.event}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-primary-600 text-white py-20">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold mb-4">Ready to be part of our story?</h2>
                    <p className="text-xl text-primary-100 mb-8">
                        Join thousands of African entrepreneurs launching their products with LaunchPilot
                    </p>
                    <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block">
                        Get Started Free
                    </Link>
                </div>
            </div>
        </div>
    );
}
