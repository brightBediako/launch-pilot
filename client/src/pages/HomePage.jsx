import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

export default function HomePage() {
    const { isAuthenticated } = useAuthStore();
    const [isScrolled, setIsScrolled] = useState(false);
    const [animateElements, setAnimateElements] = useState(false);

    useEffect(() => {
        setAnimateElements(true);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50">
            {/* Enhanced Hero Section */}
            <div className="relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-4000"></div>
                </div>

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="text-center">
                        {/* Badge */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-200 bg-white/80 backdrop-blur-md mb-6 transition-all duration-700 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <Sparkles size={16} className="text-primary-600" />
                            <span className="text-sm font-medium text-gray-700">AI-Powered Launch Planning</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight transition-all duration-700 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary-600 to-blue-600">
                                Launch Your Product,
                            </span>
                            <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
                                Faster & Smarter
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className={`text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 transition-all duration-700 delay-150 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            AI-powered launch planning and management built specifically for African markets. Plan, execute, and scale your product launches with precision. From ideation to market dominance.
                        </p>

                        {/* CTA Buttons */}
                        {!isAuthenticated && (
                            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <Link
                                    to="/register"
                                    className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl hover:from-primary-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
                                >
                                    Get Started Free
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-primary-600 bg-white border-2 border-primary-200 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-all duration-300"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}

                        {/* Feature Pills */}
                        <div className={`flex flex-wrap justify-center gap-3 mt-16 transition-all duration-700 delay-500 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-gray-200 hover:border-primary-300 transition-all">
                                <Zap size={16} className="text-yellow-500" />
                                <span className="text-sm text-gray-700">Instant AI Plans</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-gray-200 hover:border-primary-300 transition-all">
                                <span className="text-sm text-gray-700">🌍 5 African Markets</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-gray-200 hover:border-primary-300 transition-all">
                                <span className="text-sm text-gray-700">📊 Real-time Analytics</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-gray-200 hover:border-primary-300 transition-all">
                                <span className="text-sm text-gray-700">🤝 Expert Network</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image/Mockup */}
                    <div className={`mt-16 md:mt-24 transition-all duration-700 delay-700 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="relative">
                            {/* Decorative elements */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary-200 to-blue-200 rounded-2xl blur-3xl opacity-20"></div>

                            {/* Mock Dashboard */}
                            <div className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
                                    {/* Launch Card */}
                                    <div className="md:col-span-2 bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-6 border border-primary-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-gray-900">Product Q1 Launch</h3>
                                            <span className="text-sm font-bold text-white bg-gradient-to-r from-primary-500 to-blue-500 px-3 py-1 rounded-full">70% Ready</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                            <div className="bg-gradient-to-r from-primary-500 to-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                                        </div>
                                        <p className="text-sm text-gray-600">AI suggests 12 optimization tasks remaining</p>
                                    </div>

                                    {/* Stats Card */}
                                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100">
                                        <div className="text-3xl font-bold text-orange-600 mb-1">47</div>
                                        <p className="text-sm text-gray-600">Tasks Completed</p>
                                        <div className="mt-4 text-xs text-orange-600">↑ 15% this week</div>
                                    </div>
                                </div>

                                {/* Additional Mock Data */}
                                <div className="grid grid-cols-3 gap-4 px-6 md:px-8 pb-6 md:pb-8">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary-600">12</div>
                                        <p className="text-xs text-gray-600 mt-1">AI Suggestions</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">8</div>
                                        <p className="text-xs text-gray-600 mt-1">Partners Found</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">24h</div>
                                        <p className="text-xs text-gray-600 mt-1">Until Launch</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
            {
                !isAuthenticated && (
                    <div className="bg-primary-600 text-white py-16">
                        <div className="max-w-4xl mx-auto text-center px-4">
                            <h2 className="text-4xl font-bold mb-4">Ready to launch your next big thing?</h2>
                            <p className="text-lg mb-8">Join thousands of founders using LaunchPilot to succeed</p>
                            <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block">
                                Start Free Trial
                            </Link>
                        </div>
                    </div>
                )
            }

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-white font-bold mb-4">LaunchPilot</h3>
                            <p className="text-sm">AI-powered launch platform for African entrepreneurs</p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/" className="hover:text-white">Features</Link></li>
                                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                                <li><a href="#" className="hover:text-white">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                                <li><a href="#" className="hover:text-white">Blog</a></li>
                                <li><a href="#" className="hover:text-white">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-sm">
                        <p>&copy; 2025 LaunchPilot. All rights reserved. Built for African entrepreneurs.</p>
                    </div>
                </div>
            </footer>
        </div >
    );
}
