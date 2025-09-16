
import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Analyzing image pixels...",
    "Applying deep learning models...",
    "Enhancing fine details...",
    "Reconstructing high-resolution version...",
    "Almost there, finalizing the masterpiece..."
];

export const LoadingState: React.FC = () => {
    const [message, setMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(prev => {
                const currentIndex = loadingMessages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % loadingMessages.length;
                return loadingMessages[nextIndex];
            });
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center p-8 bg-slate-800/30 rounded-2xl shadow-xl border border-slate-700 min-h-[400px]">
            <div className="flex flex-col items-center text-center">
                 <svg className="animate-spin h-12 w-12 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h3 className="mt-6 text-2xl font-bold text-slate-200">AI is enhancing your image...</h3>
                <p className="mt-2 text-slate-400 transition-opacity duration-500 ease-in-out">{message}</p>
            </div>
        </div>
    );
};
