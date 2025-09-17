
import React from 'react';
import type { UpscaleFactor, UpscalingGoal, PreprocessingOptions } from '../types';
import { useI18n } from '../contexts/I18nContext';

interface ControlPanelProps {
    onUpscale: () => void;
    onReset: () => void;
    setUpscaleFactor: (factor: UpscaleFactor) => void;
    upscaleFactor: UpscaleFactor;
    upscalingGoal: UpscalingGoal;
    setUpscalingGoal: (goal: UpscalingGoal) => void;
    preprocessingOptions: PreprocessingOptions;
    setPreprocessingOptions: (options: PreprocessingOptions) => void;
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
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }`}
    >
        {factor}x
    </button>
);

const LabeledComponent: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex flex-col sm:flex-row items-center gap-3">
        <span className="font-semibold text-slate-300 shrink-0">{label}</span>
        {children}
    </div>
);

export const ControlPanel: React.FC<ControlPanelProps> = (props) => {
    const { 
        onUpscale, onReset, upscaleFactor, setUpscaleFactor,
        upscalingGoal, setUpscalingGoal, preprocessingOptions, 
        setPreprocessingOptions, isLoading 
    } = props;
    const { t } = useI18n();

    const goals: { id: UpscalingGoal; label: string }[] = [
        { id: 'balanced', label: t('goalBalanced') },
        { id: 'details', label: t('goalDetails') },
        { id: 'smoothness', label: t('goalSmoothness') },
    ];

    const handlePreprocessingChange = (option: keyof PreprocessingOptions) => {
        setPreprocessingOptions({
            ...preprocessingOptions,
            [option]: !preprocessingOptions[option],
        });
    };

    return (
        <div className="w-full max-w-5xl p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <LabeledComponent label={t('upscaleFactor')}>
                    <div className="flex items-center gap-2 p-1 bg-slate-900/50 rounded-lg">
                        <FactorButton factor={2} currentFactor={upscaleFactor} setFactor={setUpscaleFactor} />
                        <FactorButton factor={4} currentFactor={upscaleFactor} setFactor={setUpscaleFactor} />
                        <FactorButton factor={8} currentFactor={upscaleFactor} setFactor={setUpscaleFactor} />
                    </div>
                </LabeledComponent>

                <LabeledComponent label={t('upscalingGoal')}>
                    <div className="flex items-center gap-1 p-1 bg-slate-900/50 rounded-lg">
                        {goals.map(({ id, label }) => (
                            <button key={id} onClick={() => setUpscalingGoal(id)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                                    upscalingGoal === id ? 'bg-slate-600 text-white' : 'bg-transparent text-slate-400 hover:bg-slate-700'
                                }`}>
                                {label}
                            </button>
                        ))}
                    </div>
                </LabeledComponent>

                <LabeledComponent label={t('preprocessing')}>
                     <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                            <input type="checkbox" checked={preprocessingOptions.noiseReduction} onChange={() => handlePreprocessingChange('noiseReduction')}
                                className="w-4 h-4 text-cyan-600 bg-slate-700 border-slate-500 rounded focus:ring-cyan-500 focus:ring-2" />
                            {t('noiseReduction')}
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                             <input type="checkbox" checked={preprocessingOptions.autoContrast} onChange={() => handlePreprocessingChange('autoContrast')}
                                className="w-4 h-4 text-cyan-600 bg-slate-700 border-slate-500 rounded focus:ring-cyan-500 focus:ring-2" />
                            {t('autoContrast')}
                        </label>
                    </div>
                </LabeledComponent>
            </div>
            
            <div className="border-t border-slate-700 my-2"></div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 w-full">
                <button
                    onClick={onReset}
                    disabled={isLoading}
                    className="px-5 py-2.5 w-full sm:w-auto text-sm font-medium text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {t('uploadNewImage')}
                </button>
                <button
                    onClick={onUpscale}
                    disabled={isLoading}
                    className="relative inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-wait disabled:shadow-none transition-all"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('processing')}
                        </>
                    ) : t('enhanceImage')}
                </button>
            </div>
        </div>
    );
}
