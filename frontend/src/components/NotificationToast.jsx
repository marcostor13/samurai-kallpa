import React, { useState, useEffect } from 'react';
import { uiStore } from '../store/uiStore';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function NotificationToast() {
    const [notification, setNotification] = useState(uiStore.getState().notification);

    useEffect(() => {
        return uiStore.subscribe((state) => setNotification(state.notification));
    }, []);

    if (!notification) return null;

    const isSuccess = notification.type === 'success';

    return (
        <div className="fixed bottom-8 right-8 z-[10000] animate-slideInRight">
            <div className={`flex items-center gap-4 p-4 rounded-lg border shadow-2xl backdrop-blur-md ${
                isSuccess 
                ? 'bg-kallpa-teal/20 border-kallpa-teal text-kallpa-teal' 
                : 'bg-red-500/20 border-red-500 text-red-200'
            }`}>
                {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <p className="font-display text-xs tracking-wider uppercase">{notification.message}</p>
                <button onClick={() => uiStore.hideNotification()} className="ml-2 hover:opacity-70 transition-opacity">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
