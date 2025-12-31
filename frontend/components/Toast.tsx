import React, { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 5000, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Small delay to trigger animation
        const timerIn = setTimeout(() => setIsVisible(true), 10);

        const timerOut = setTimeout(() => {
            setIsVisible(false);
            // Wait for animation to finish before removing from DOM
            setTimeout(onClose, 300);
        }, duration);

        return () => {
            clearTimeout(timerIn);
            clearTimeout(timerOut);
        };
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} className="text-green-500" />;
            case 'error':
                return <AlertCircle size={20} className="text-red-500" />;
            default:
                return <Info size={20} className="text-blue-500" />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success': return 'border-green-500/50';
            case 'error': return 'border-red-500/50';
            default: return 'border-blue-500/50';
        }
    };

    return (
        <div
            className={`
        w-full flex items-start gap-3 p-4 
        bg-slate-900/95 backdrop-blur-md border ${getBorderColor()} rounded-xl shadow-2xl 
        transition-all duration-300 transform
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
            role="alert"
        >
            <div className="mt-0.5 shrink-0">
                {getIcon()}
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">{message}</p>
            </div>
            <button
                onClick={handleClose}
                className="text-slate-500 hover:text-slate-300 transition-colors p-0.5 rounded-full hover:bg-slate-800"
                aria-label="Close"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
