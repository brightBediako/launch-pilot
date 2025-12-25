import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function TopBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-blue-600 text-white py-3 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">🎉</span>
                        <div>
                            <p className="font-semibold">Limited Time Offer: Get 50% off Pro Plan</p>
                            <p className="text-sm text-primary-100">Use code: LAUNCH50 at checkout. Valid until Dec 31, 2025</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="ml-4 p-1 hover:bg-primary-700 rounded-lg transition-colors flex-shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
