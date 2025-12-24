export default function AnalyticsPage() {
    // Key metrics data
    const metrics = [
        { label: 'Total Page Views', value: '12,534', change: '+8%', trend: 'up', icon: '👁️' },
        { label: 'Email Signups', value: '456', change: '+12%', trend: 'up', icon: '📧' },
        { label: 'Conversion Rate', value: '3.6%', change: '+0.5%', trend: 'up', icon: '📈' },
        { label: 'Avg. Time on Page', value: '4:32', change: '+1:05', trend: 'up', icon: '⏱️' },
    ];

    // Daily traffic data (last 7 days)
    const trafficData = [
        { day: 'Mon', views: 1200, signups: 45, conversions: 35 },
        { day: 'Tue', views: 1900, signups: 65, conversions: 52 },
        { day: 'Wed', views: 1100, signups: 40, conversions: 30 },
        { day: 'Thu', views: 2500, signups: 95, conversions: 78 },
        { day: 'Fri', views: 2800, signups: 120, conversions: 95 },
        { day: 'Sat', views: 2100, signups: 85, conversions: 68 },
        { day: 'Sun', views: 1800, signups: 70, conversions: 55 },
    ];

    // Traffic sources
    const trafficSources = [
        { name: 'Direct', value: 2500, percentage: 35, color: 'bg-blue-500' },
        { name: 'Social Media', value: 1800, percentage: 25, color: 'bg-purple-500' },
        { name: 'Search Engines', value: 1600, percentage: 22, color: 'bg-green-500' },
        { name: 'Email', value: 900, percentage: 12, color: 'bg-orange-500' },
        { name: 'Referral', value: 400, percentage: 6, color: 'bg-pink-500' },
    ];

    // Geographic data
    const geoData = [
        { country: 'Nigeria', views: 4200, signups: 156, bounce: '32%' },
        { country: 'Ghana', views: 2100, signups: 78, bounce: '35%' },
        { country: 'Kenya', views: 1800, signups: 68, bounce: '38%' },
        { country: 'South Africa', views: 2200, signups: 82, bounce: '30%' },
        { country: 'Uganda', views: 1100, signups: 42, bounce: '40%' },
    ];

    // Device breakdown
    const deviceData = [
        { device: 'Mobile', percentage: 62, users: 7800 },
        { device: 'Desktop', percentage: 28, users: 3500 },
        { device: 'Tablet', percentage: 10, users: 1200 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-gray-600 mt-2">Track your launch performance and user engagement</p>
                </div>

                {/* Key Metrics */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {metrics.map((metric, idx) => (
                        <div key={idx} className="card">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-3xl">{metric.icon}</span>
                                <span className={`text-sm font-semibold ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                    {metric.change}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Traffic Over Time Chart */}
                    <div className="card">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Traffic Over Time (Last 7 Days)</h3>
                        <div className="space-y-4">
                            {trafficData.map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">{item.day}</span>
                                        <span className="text-sm font-bold text-gray-900">{item.views} views</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-primary-600 h-2 rounded-full"
                                            style={{ width: `${(item.views / 2800) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Traffic Sources */}
                    <div className="card">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Traffic Sources</h3>
                        <div className="space-y-5">
                            {trafficSources.map((source, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-700">{source.name}</span>
                                        <span className="text-sm font-bold text-gray-900">{source.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className={`${source.color} h-3 rounded-full`}
                                            style={{ width: `${source.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Geographic Data */}
                <div className="card mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Performance by Region</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Country</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Page Views</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Signups</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Bounce Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {geoData.map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-900">{row.country}</td>
                                        <td className="text-right py-3 px-4 text-gray-700">{row.views.toLocaleString()}</td>
                                        <td className="text-right py-3 px-4 text-gray-700">{row.signups}</td>
                                        <td className="text-right py-3 px-4 text-gray-700">{row.bounce}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Device Breakdown */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="card">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Device Breakdown</h3>
                        <div className="space-y-6">
                            {deviceData.map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-900">{item.device}</span>
                                        <span className="text-sm font-bold text-primary-600">{item.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-primary-600 h-3 rounded-full"
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">{item.users.toLocaleString()} users</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Key Insights</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm font-semibold text-blue-900">📈 Peak Traffic</p>
                                <p className="text-sm text-blue-800 mt-1">Friday saw the highest traffic with 2,800+ views</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm font-semibold text-green-900">📱 Mobile First</p>
                                <p className="text-sm text-green-800 mt-1">62% of traffic comes from mobile devices</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <p className="text-sm font-semibold text-purple-900">🌍 Nigeria Leader</p>
                                <p className="text-sm text-purple-800 mt-1">Nigeria accounts for 35% of total traffic</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                <p className="text-sm font-semibold text-orange-900">💰 Conversion</p>
                                <p className="text-sm text-orange-800 mt-1">3.6% conversion rate, up 0.5% from last period</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
