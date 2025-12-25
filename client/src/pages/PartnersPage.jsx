import React, { useState } from 'react';
import { usePartners } from '../hooks/useQueries';

export default function PartnersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedService, setSelectedService] = useState('');

    // Fetch partners from API using TanStack Query
    const { data: partners = [], isLoading, error } = usePartners({ service: selectedService || undefined });

    // Comprehensive partner data (fallback)
    const partnerData = [
        {
            id: 1,
            name: 'Digital Marketing Pro',
            services: ['Marketing', 'Social Media', 'Content'],
            rating: 4.8,
            reviews: 45,
            description: 'Expert digital marketing agency specializing in African market launches',
            location: 'Nigeria',
            hourlyRate: 'Starting at ₦15,000/hr',
            verified: true,
            image: '📱',
        },
        {
            id: 2,
            name: 'Design Studios',
            services: ['Design', 'Branding', 'UI/UX'],
            rating: 4.9,
            reviews: 32,
            description: 'Creative design agency with experience in multiple African markets',
            location: 'Ghana',
            hourlyRate: 'Starting at ₦12,000/hr',
            verified: true,
            image: '🎨',
        },
        {
            id: 3,
            name: 'Dev Solutions',
            services: ['Development', 'Web', 'Mobile'],
            rating: 4.7,
            reviews: 28,
            description: 'Full-stack development team for web and mobile applications',
            location: 'Kenya',
            hourlyRate: 'Starting at ₦20,000/hr',
            verified: true,
            image: '💻',
        },
        {
            id: 4,
            name: 'Growth Hackers United',
            services: ['Growth', 'Analytics', 'Product'],
            rating: 4.6,
            reviews: 39,
            description: 'Growth strategy and analytics for startup success',
            location: 'Multi-location',
            hourlyRate: 'Starting at ₦18,000/hr',
            verified: true,
            image: '📈',
        },
        {
            id: 5,
            name: 'Content Kings',
            services: ['Content', 'Copywriting', 'SEO'],
            rating: 4.9,
            reviews: 52,
            description: 'Professional content creators and copywriters for launch campaigns',
            location: 'South Africa',
            hourlyRate: 'Starting at ₦8,000/hr',
            verified: true,
            image: '✍️',
        },
        {
            id: 6,
            name: 'PR & Media Relations',
            services: ['PR', 'Media', 'Communications'],
            rating: 4.8,
            reviews: 41,
            description: 'Media relations and PR experts for product launches',
            location: 'Nigeria',
            hourlyRate: 'Starting at ₦25,000/hr',
            verified: true,
            image: '📢',
        },
        {
            id: 7,
            name: 'Video Production House',
            services: ['Video', 'Animation', 'Editing'],
            rating: 4.7,
            reviews: 36,
            description: 'Professional video production for marketing campaigns',
            location: 'Ghana',
            hourlyRate: 'Starting at ₦22,000/hr',
            verified: false,
            image: '🎬',
        },
        {
            id: 8,
            name: 'Data Analytics Hub',
            services: ['Analytics', 'Data', 'Reporting'],
            rating: 4.9,
            reviews: 29,
            description: 'Advanced analytics and data insights for launch performance',
            location: 'Kenya',
            hourlyRate: 'Starting at ₦16,000/hr',
            verified: true,
            image: '📊',
        },
        {
            id: 9,
            name: 'E-commerce Specialists',
            services: ['E-commerce', 'Payment', 'Logistics'],
            rating: 4.6,
            reviews: 34,
            description: 'E-commerce platform setup and optimization',
            location: 'Nigeria',
            hourlyRate: 'Starting at ₦14,000/hr',
            verified: true,
            image: '🛒',
        },
        {
            id: 10,
            name: 'Community Management',
            services: ['Community', 'Social', 'Engagement'],
            rating: 4.8,
            reviews: 47,
            description: 'Community building and engagement strategies',
            location: 'Multi-location',
            hourlyRate: 'Starting at ₦10,000/hr',
            verified: true,
            image: '👥',
        },
    ];

    const displayPartners = partners.length > 0 ? partners : partnerData;
    const services = ['Marketing', 'Design', 'Development', 'Content', 'PR', 'Analytics', 'Video', 'E-commerce'];

    // Filter partners
    const filteredPartners = displayPartners.filter((partner) => {
        const partnerName = partner.name || '';
        const partnerDesc = partner.description || '';
        const matchesSearch = partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partnerDesc.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesService = !selectedService || (partner.services && partner.services.includes(selectedService));
        return matchesSearch && matchesService;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Find Partners</h1>
                    <p className="text-gray-600 mt-2">Connect with verified experts to execute your launch</p>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Loading partners...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                        <p className="text-red-700">Failed to load partners. Using local data.</p>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
                    <input
                        type="text"
                        placeholder="Search partners by name or service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field w-full mb-4"
                    />
                    <div className="flex space-x-3 overflow-x-auto pb-2">
                        <button
                            onClick={() => setSelectedService('')}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${!selectedService ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All Services
                        </button>
                        {services.map((service) => {
                            const isSelected = selectedService === service;
                            const buttonClass = isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
                            return (
                                <button
                                    key={service}
                                    onClick={() => setSelectedService(isSelected ? '' : service)}
                                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${buttonClass}`}
                                >
                                    {service}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Partners Grid */}
                {filteredPartners.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPartners.map((partner) => (
                            <div key={partner.id} className="card hover:shadow-lg transition-shadow">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-bold text-gray-900">{partner.name}</h3>
                                            {partner.verified && (
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">✓ Verified</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600">{partner.location}</p>
                                    </div>
                                    <span className="text-4xl">{partner.image}</span>
                                </div>

                                {/* Description */}
                                <p className="text-gray-700 text-sm mb-4">{partner.description}</p>

                                {/* Rating */}
                                <div className="flex items-center mb-4">
                                    <span className="text-yellow-500 font-bold">⭐ {partner.rating}</span>
                                    <span className="text-gray-600 text-sm ml-2">({partner.reviews} reviews)</span>
                                </div>

                                {/* Services */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {partner.services.map((service) => (
                                        <span key={service} className="badge bg-primary-100 text-primary-800 text-xs">
                                            {service}
                                        </span>
                                    ))}
                                </div>

                                {/* Rate */}
                                <p className="text-sm font-semibold text-gray-900 mb-4">{partner.hourlyRate}</p>

                                {/* CTA */}
                                <button className="btn-primary w-full">View Profile</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card text-center py-12">
                        <p className="text-gray-600 mb-4">No partners found matching your criteria</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedService('');
                            }}
                            className="btn-primary"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Stats */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <div className="card text-center">
                        <div className="text-4xl font-bold text-primary-600 mb-2">{partnerData.length}+</div>
                        <p className="text-gray-600">Verified Partners</p>
                    </div>
                    <div className="card text-center">
                        <div className="text-4xl font-bold text-primary-600 mb-2">4.8⭐</div>
                        <p className="text-gray-600">Average Rating</p>
                    </div>
                    <div className="card text-center">
                        <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
                        <p className="text-gray-600">Successful Launches</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
