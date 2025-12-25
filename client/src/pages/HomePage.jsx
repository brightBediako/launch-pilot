import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function HomePage() {
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                        Launch Your Product, <span className="text-primary-600">Faster</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        AI-powered launch planning and management for African markets. Plan, execute, and scale your product launches with ease.
                    </p>
                    {!isAuthenticated && (
                        <div className="flex gap-4 justify-center">
                            <Link to="/register" className="btn-primary text-lg px-8 py-3">
                                Get Started Free
                            </Link>
                            <Link to="/login" className="btn-outline text-lg px-8 py-3">
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mt-20">
                    <div className="card text-center">
                        <div className="text-4xl mb-4">🤖</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Planning</h3>
                        <p className="text-gray-600">Get intelligent launch plans and strategies powered by advanced AI</p>
                    </div>
                    <div className="card text-center">
                        <div className="text-4xl mb-4">📝</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Content Generation</h3>
                        <p className="text-gray-600">Automatically generate launch copy, social posts, and marketing materials</p>
                    </div>
                    <div className="card text-center">
                        <div className="text-4xl mb-4">🤝</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Partners</h3>
                        <p className="text-gray-600">Connect with vetted marketing, design, and development experts</p>
                    </div>
                    <div className="card text-center">
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics & Tracking</h3>
                        <p className="text-gray-600">Monitor your launch performance with real-time analytics</p>
                    </div>
                    <div className="card text-center">
                        <div className="text-4xl mb-4">⏰</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Task Management</h3>
                        <p className="text-gray-600">Organize and collaborate on launch tasks with your team</p>
                    </div>
                    <div className="card text-center">
                        <div className="text-4xl mb-4">🌍</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">African Markets</h3>
                        <p className="text-gray-600">Built specifically for Nigeria, Ghana, Kenya, and more</p>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Loved by Founders Across Africa</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="card">
                        <div className="flex items-center mb-4">
                            <span className="text-2xl mr-2">⭐⭐⭐⭐⭐</span>
                        </div>
                        <p className="text-gray-700 mb-4">"LaunchPilot saved us weeks of planning. The AI-powered insights were invaluable for our product launch in Nigeria."</p>
                        <div className="font-bold text-gray-900">Amara Okafor</div>
                        <div className="text-sm text-gray-600">Founder, TechStart NG</div>
                    </div>
                    <div className="card">
                        <div className="flex items-center mb-4">
                            <span className="text-2xl mr-2">⭐⭐⭐⭐⭐</span>
                        </div>
                        <p className="text-gray-700 mb-4">"The partner marketplace connected us with amazing designers and developers. Game changer for our launch in Ghana."</p>
                        <div className="font-bold text-gray-900">Kwesi Mensah</div>
                        <div className="text-sm text-gray-600">CEO, Digital Innovations GH</div>
                    </div>
                    <div className="card">
                        <div className="flex items-center mb-4">
                            <span className="text-2xl mr-2">⭐⭐⭐⭐⭐</span>
                        </div>
                        <p className="text-gray-700 mb-4">"The analytics dashboard gives us real-time insights into our launch performance across East Africa. Highly recommended!"</p>
                        <div className="font-bold text-gray-900">Grace Kipchoge</div>
                        <div className="text-sm text-gray-600">Product Manager, InnovateLabs KE</div>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-gray-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Choose the plan that's right for your launch. All plans include AI-powered insights and partner access.</p>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="border border-gray-700 rounded-lg p-8">
                            <h3 className="text-xl font-bold mb-2">Starter</h3>
                            <div className="text-3xl font-bold mb-4">Free</div>
                            <div className="space-y-3 mb-6 text-gray-300">
                                <div>✓ 1 Active Launch</div>
                                <div>✓ Basic Analytics</div>
                                <div>✓ Partner Directory</div>
                                <div>✗ AI Planning</div>
                            </div>
                            <button className="btn-outline w-full text-white">Get Started</button>
                        </div>
                        <div className="border-2 border-primary-500 rounded-lg p-8 relative">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-500 px-4 py-1 rounded-full text-sm font-bold">Popular</div>
                            <h3 className="text-xl font-bold mb-2">Pro</h3>
                            <div className="text-3xl font-bold mb-4">₦29,999<span className="text-lg text-gray-400">/month</span></div>
                            <div className="space-y-3 mb-6 text-gray-300">
                                <div>✓ Unlimited Launches</div>
                                <div>✓ Advanced Analytics</div>
                                <div>✓ AI Planning & Content</div>
                                <div>✓ Priority Partner Access</div>
                            </div>
                            <button className="btn-primary w-full">Start Free Trial</button>
                        </div>
                        <div className="border border-gray-700 rounded-lg p-8">
                            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                            <div className="text-3xl font-bold mb-4">Custom</div>
                            <div className="space-y-3 mb-6 text-gray-300">
                                <div>✓ Everything in Pro</div>
                                <div>✓ Dedicated Manager</div>
                                <div>✓ Custom Integrations</div>
                                <div>✓ Team Training</div>
                            </div>
                            <button className="btn-outline w-full text-white">Contact Sales</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            {!isAuthenticated && (
                <div className="bg-primary-600 text-white py-16">
                    <div className="max-w-4xl mx-auto text-center px-4">
                        <h2 className="text-4xl font-bold mb-4">Ready to launch your next big thing?</h2>
                        <p className="text-lg mb-8">Join thousands of founders using LaunchPilot to succeed</p>
                        <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block">
                            Start Free Trial
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
