import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LaunchNewPage() {
    const navigate = useNavigate();
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const [showGeneratedPlan, setShowGeneratedPlan] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        productType: 'saas',
        targetMarket: 'nigeria',
        budget: '',
        targetDate: '',
        team: 1,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGeneratePlan = async () => {
        if (!formData.title || !formData.description) {
            alert('Please fill in title and description');
            return;
        }

        setIsGeneratingPlan(true);
        // Simulate AI plan generation
        setTimeout(() => {
            setIsGeneratingPlan(false);
            setShowGeneratedPlan(true);
        }, 2000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Creating launch:', formData);
        // Redirect to launches page
        navigate('/launches');
    };

    const generatedPlan = {
        phases: [
            { name: 'Planning', duration: '2 weeks', tasks: 12 },
            { name: 'Development', duration: '6 weeks', tasks: 25 },
            { name: 'Testing', duration: '2 weeks', tasks: 8 },
            { name: 'Marketing', duration: '3 weeks', tasks: 15 },
            { name: 'Launch', duration: '1 week', tasks: 10 },
        ],
        budget: { planning: 50000, development: 300000, testing: 80000, marketing: 150000, launch: 100000 },
        risks: [
            'Market timing delays',
            'Technical integration challenges',
            'Team resource constraints',
        ],
        recommendations: [
            'Partner with local market experts',
            'Conduct early beta testing with users',
            'Allocate 20% budget for contingencies',
            'Schedule weekly progress reviews',
        ],
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back button */}
                <Link to="/launches" className="text-primary-600 hover:text-primary-700 font-medium mb-6 inline-block">
                    ← Back to Launches
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Create New Launch</h1>
                    <p className="text-gray-600 mt-2">Plan and configure your product launch with AI-powered insights</p>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="card">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Launch Details</h2>

                            {/* Title */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Product/Launch Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Mobile Banking App Launch"
                                    className="input-field w-full"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your product and launch goals..."
                                    className="input-field w-full h-24 resize-none"
                                    required
                                ></textarea>
                            </div>

                            {/* Product Type */}
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Product Type *
                                    </label>
                                    <select
                                        name="productType"
                                        value={formData.productType}
                                        onChange={handleChange}
                                        className="input-field w-full"
                                    >
                                        <option value="saas">SaaS</option>
                                        <option value="mobile">Mobile App</option>
                                        <option value="web">Web Platform</option>
                                        <option value="feature">Feature</option>
                                        <option value="hardware">Hardware</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Target Market *
                                    </label>
                                    <select
                                        name="targetMarket"
                                        value={formData.targetMarket}
                                        onChange={handleChange}
                                        className="input-field w-full"
                                    >
                                        <option value="nigeria">Nigeria</option>
                                        <option value="ghana">Ghana</option>
                                        <option value="kenya">Kenya</option>
                                        <option value="south-africa">South Africa</option>
                                        <option value="multi">Multi-Market</option>
                                    </select>
                                </div>
                            </div>

                            {/* Budget and Date */}
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Budget (₦)
                                    </label>
                                    <input
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        placeholder="e.g., 500000"
                                        className="input-field w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Target Launch Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="targetDate"
                                        value={formData.targetDate}
                                        onChange={handleChange}
                                        className="input-field w-full"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Team Size */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Expected Team Size
                                </label>
                                <input
                                    type="number"
                                    name="team"
                                    value={formData.team}
                                    onChange={handleChange}
                                    min="1"
                                    className="input-field w-full"
                                />
                                <p className="text-sm text-gray-600 mt-1">Number of team members involved in the launch</p>
                            </div>

                            {/* AI Plan Generation Button */}
                            <button
                                type="button"
                                onClick={handleGeneratePlan}
                                disabled={isGeneratingPlan}
                                className="w-full bg-gradient-to-r from-purple-600 to-primary-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow mb-6 disabled:opacity-50"
                            >
                                {isGeneratingPlan ? '🤖 Generating AI Launch Plan...' : '🤖 Generate AI Launch Plan'}
                            </button>
                        </div>
                    </div>

                    {/* Sidebar - Generated Plan or Submit */}
                    <div>
                        {showGeneratedPlan ? (
                            <div className="card sticky top-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">📋 AI-Generated Plan</h3>

                                {/* Phases */}
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Launch Phases</h4>
                                    <div className="space-y-2">
                                        {generatedPlan.phases.map((phase, idx) => (
                                            <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                                                <p className="font-semibold text-gray-900 text-sm">{phase.name}</p>
                                                <p className="text-xs text-gray-600">{phase.duration} • {phase.tasks} tasks</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Recommendations</h4>
                                    <ul className="space-y-2 text-sm">
                                        {generatedPlan.recommendations.map((rec, idx) => (
                                            <li key={idx} className="text-gray-700 flex items-start gap-2">
                                                <span className="text-primary-600 flex-shrink-0">✓</span>
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Warning */}
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
                                    <p className="text-xs font-semibold text-yellow-900 mb-1">⚠️ Key Risks</p>
                                    <ul className="text-xs text-yellow-800 space-y-1">
                                        {generatedPlan.risks.map((risk, idx) => (
                                            <li key={idx}>• {risk}</li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowGeneratedPlan(false)}
                                    className="btn-outline w-full text-sm mb-2"
                                >
                                    Regenerate Plan
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary w-full"
                                >
                                    Create Launch
                                </button>
                            </div>
                        ) : (
                            <div className="card sticky top-8">
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">🎯</div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Generate AI Plan</h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Fill in the details and click "Generate AI Launch Plan" to get AI-powered recommendations for your launch.
                                    </p>
                                    <div className="space-y-2 text-sm text-left">
                                        <p className="font-semibold text-gray-900">This will help you:</p>
                                        <ul className="space-y-1 text-gray-700">
                                            <li>✓ Define clear launch phases</li>
                                            <li>✓ Identify key risks</li>
                                            <li>✓ Get expert recommendations</li>
                                            <li>✓ Budget allocation tips</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
