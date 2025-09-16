
import React from 'react';
import type { UpscaleFactor } from '../types';

interface ControlPanelProps {
    onUpscale: () => void;
    onReset: () => void;
    setUpscaleFactor: (factor: UpscaleFactor) => void;
    upscaleFactor: UpscaleFactor;
    isLoading: boolean;
}

const FactorButton: React.FC<{
    factor: UpscaleFactor;
    currentFactor: UpscaleFactor;
    setFactor: (factor: UpscaleFactor) => void;
}> = ({ factor, currentFactor, setFactor }) => (
    <button
        onClick={() => setFactor(factor)}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
            currentFactor === factor
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }`}
    >
        {factor}x
    </button>
);


export const ControlPanel: React.FC<ControlPanelProps> = ({ onUpscale, onReset, setUpscaleFactor, upscaleFactor, isLoading }) => {
    return (
        <div className="w-full max-w-4xl p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-300">Upscale Factor:</span>
                <div className="flex items-center gap-2">
                    <FactorButton factor={2} currentFactor={upscaleFactor} setFactor={setUpscaleFactor} />
                    <FactorButton factor={4} currentFactor={upscaleFactor} setFactor={setUpscaleFactor} />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={onReset}
                    disabled={isLoading}
                    className="px-5 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Upload New Image
                </button>
                <button
                    onClick={onUpscale}
                    disabled={isLoading}
                    className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-wait disabled:shadow-none transition-all"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : 'Enhance Image'}
                </button>
            </div>
        </div>
    );
}
