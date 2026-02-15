import React, { useState, useEffect } from 'react';
import { uiStore } from '../store/uiStore';

export default function GlobalLoader() {
    const [loading, setLoading] = useState(uiStore.getState().isLoading);

    useEffect(() => {
        return uiStore.subscribe((state) => setLoading(state.isLoading));
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all animate-fadeIn">
            <div className="relative">
                {/* Samurai Pulsing Loader */}
                <div className="w-20 h-20 rounded-full border-b-2 border-kallpa-gold animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-kallpa-gold rounded-full opacity-20 animate-ping"></div>
                </div>
            </div>
        </div>
    );
}
