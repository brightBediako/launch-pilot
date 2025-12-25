import React, { useState } from 'react';

export default function FAQPage() {
    const [expandedId, setExpandedId] = useState(null);

    const faqs = [
        {
            id: 1,
            category: 'Getting Started',
            question: 'How do I get started with LaunchPilot?',
            answer: 'Simply sign up for a free account, fill in your product details, and you\'ll immediately get access to our AI-powered planning tools, partner marketplace, and analytics dashboard. No credit card required for the starter plan.',
        },
        {
            id: 2,
            category: 'Getting Started',
            question: 'Is there a free trial?',
            answer: 'Yes! Our Starter plan is completely free with support for 1 active launch, basic analytics, and access to our partner directory. Upgrade to Pro anytime to unlock unlimited launches and AI-powered features.',
        },
        {
            id: 3,
            category: 'Getting Started',
            question: 'What payment methods do you accept?',
            answer: 'We accept all major payment methods including credit cards (Visa, Mastercard), mobile money (MTN, Airtel, Vodafone), and bank transfers. Payment processing is handled securely through multiple payment gateways optimized for African markets.',
        },
        {
            id: 4,
            category: 'Features',
            question: 'How does the AI planning work?',
            answer: 'Our AI analyzes your product details, target market, and timeline to generate a comprehensive launch plan including phases, task recommendations, risk analysis, and budget allocation. The plan is fully customizable to match your specific needs.',
        },
        {
            id: 5,
            category: 'Features',
            question: 'Can I collaborate with my team?',
            answer: 'Absolutely! You can invite team members, assign tasks, set deadlines, and track progress in real-time. Our collaborative features are designed to keep everyone aligned and accountable.',
        },
        {
            id: 6,
            category: 'Features',
            question: 'What analytics are available?',
            answer: 'Our analytics dashboard provides real-time tracking of launch metrics including page views, signups, conversion rates, traffic sources, geographic performance, and device breakdowns. You can also set custom goals and KPIs.',
        },
        {
            id: 7,
            category: 'Partners',
            question: 'How do I find and hire partners?',
            answer: 'Browse our verified partner marketplace by service category (Marketing, Design, Development, etc.). Each partner has detailed profiles, ratings, reviews, and hourly rates. You can contact them directly or through our platform.',
        },
        {
            id: 8,
            category: 'Partners',
            question: 'Are the partners verified?',
            answer: 'Yes, all partners go through our verification process to ensure quality and reliability. We check their credentials, portfolios, and customer reviews. Partners with high ratings (4.5+) get priority visibility.',
        },
        {
            id: 9,
            category: 'Partners',
            question: 'What if I\'m not satisfied with a partner?',
            answer: 'We have a satisfaction guarantee. If you\'re not happy with a partner\'s work, you can request a replacement or refund through our dispute resolution process. We take quality seriously.',
        },
        {
            id: 10,
            category: 'Technical',
            question: 'What markets does LaunchPilot support?',
            answer: 'We currently support launches in Nigeria, Ghana, Kenya, South Africa, and Uganda. Each market has localized features including currency support (NGN, GHS, KES, ZAR, UGX), timezone awareness, and market-specific partner networks.',
        },
        {
            id: 11,
            category: 'Technical',
            question: 'Is my data secure?',
            answer: 'We use enterprise-grade encryption (SSL/TLS), secure API tokens, and follow GDPR and African data protection standards. Your data is stored securely and never shared without your consent.',
        },
        {
            id: 12,
            category: 'Technical',
            question: 'Can I export my launch data?',
            answer: 'Yes! You can export all your launch data, analytics, tasks, and reports in multiple formats (PDF, CSV, Excel). You always have full control over your data.',
        },
        {
            id: 13,
            category: 'Support',
            question: 'How do I contact support?',
            answer: 'You can reach our support team via email (support@launchpilot.com), live chat in the app, or through our help center. We aim to respond within 24 hours.',
        },
        {
            id: 14,
            category: 'Support',
            question: 'Do you offer training or onboarding?',
            answer: 'Yes! We provide video tutorials, comprehensive documentation, and live webinars. Pro and Enterprise plans include dedicated onboarding and training sessions.',
        },
        {
            id: 15,
            category: 'Pricing',
            question: 'Can I cancel my subscription anytime?',
            answer: 'Yes, you can cancel anytime with no penalties. You\'ll have access until the end of your billing cycle. If you cancel, we\'d love to hear your feedback to help us improve.',
        },
    ];

    const categories = ['All', ...new Set(faqs.map(faq => faq.category))];
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredFaqs = selectedCategory === 'All'
        ? faqs
        : faqs.filter(faq => faq.category === selectedCategory);

    const toggleExpanded = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
                    <p className="text-xl text-primary-100">
                        Find answers to common questions about LaunchPilot
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Category Filter */}
                <div className="mb-8 flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {filteredFaqs.map((faq) => (
                        <div
                            key={faq.id}
                            className="card hover:shadow-md transition-shadow"
                        >
                            <button
                                onClick={() => toggleExpanded(faq.id)}
                                className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50"
                            >
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-primary-600 mb-1">
                                        {faq.category}
                                    </p>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {faq.question}
                                    </h3>
                                </div>
                                <span
                                    className={`text-2xl text-primary-600 transform transition-transform flex-shrink-0 ml-4 ${expandedId === faq.id ? 'rotate-45' : ''
                                        }`}
                                >
                                    +
                                </span>
                            </button>

                            {/* Expanded Content */}
                            {expandedId === faq.id && (
                                <div className="px-6 pb-6 border-t border-gray-200">
                                    <p className="text-gray-700 leading-relaxed mt-4">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Results count */}
                <p className="text-center text-gray-600 mt-8">
                    Showing {filteredFaqs.length} of {faqs.length} questions
                </p>
            </div>

            {/* Contact Section */}
            <div className="bg-white border-t border-gray-200 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Didn't find your answer?
                    </h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Our support team is here to help. Reach out anytime!
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <a href="mailto:support@launchpilot.com" className="btn-primary">
                            📧 Email Support
                        </a>
                        <button className="btn-outline">
                            💬 Live Chat
                        </button>
                    </div>
                </div>
            </div>

            {/* Common Issues */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Troubleshooting
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="card">
                        <div className="text-4xl mb-4">🔐</div>
                        <h3 className="font-bold text-gray-900 mb-2">Login Issues</h3>
                        <p className="text-gray-700 text-sm">Reset your password or check your email verification status</p>
                    </div>
                    <div className="card">
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="font-bold text-gray-900 mb-2">Analytics Not Loading</h3>
                        <p className="text-gray-700 text-sm">Clear your browser cache or try a different browser</p>
                    </div>
                    <div className="card">
                        <div className="text-4xl mb-4">💳</div>
                        <h3 className="font-bold text-gray-900 mb-2">Payment Issues</h3>
                        <p className="text-gray-700 text-sm">Verify your payment method and contact your bank if needed</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
