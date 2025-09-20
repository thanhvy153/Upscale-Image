
import React from 'react';
import type { UpscaleFactor, UpscalingGoal, PreprocessingOptions, UpscaleMode } from '../types';
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
    upscaleMode: UpscaleMode;
    setUpscaleMode: (mode: UpscaleMode) => void;
    colorEnhancement: boolean;
    setColorEnhancement: (value: boolean) => void;
    isLoading: boolean;
}

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
        setPreprocessingOptions, upscaleMode, setUpscaleMode, 
        colorEnhancement, setColorEnhancement, isLoading 
    } = props;
    const { t } = useI18n();
    
    const factors: UpscaleFactor[] = [2, 4, 8];

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                <LabeledComponent label={t('upscaleFactor')}>
                    <div className="flex items-center gap-1 p-1 bg-slate-900/50 rounded-lg w-full">
                        {factors.map((factor) => (
                            <button key={factor} onClick={() => setUpscaleFactor(factor)}
                                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors w-full ${
                                    upscaleFactor === factor ? 'bg-slate-600 text-white' : 'bg-transparent text-slate-400 hover:bg-slate-700'
                                }`}>
                                {factor}x
                            </button>
                        ))}
                    </div>
                </LabeledComponent>

                <LabeledComponent label={t('upscalingGoal')}>
                    <div className="flex items-center gap-1 p-1 bg-slate-900/50 rounded-lg w-full">
                        {goals.map(({ id, label }) => (
                            <button key={id} onClick={() => setUpscalingGoal(id)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors w-full ${
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
                                className="w-4 h-4 text-cyan-600 bg-slate-700 border-slate-500 rounded focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-2" />
                            {t('noiseReduction')}
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                             <input type="checkbox" checked={preprocessingOptions.autoContrast} onChange={() => handlePreprocessingChange('autoContrast')}
                                className="w-4 h-4 text-cyan-600 bg-slate-700 border-slate-500 rounded focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-2" />
                            {t('autoContrast')}
                        </label>
                    </div>
                </LabeledComponent>

                <div className="flex flex-col gap-4 justify-center">
                    <LabeledComponent label={t('proMode')}>
                        <div className="flex items-center w-full" title={t('proModeTooltip')}>
                            <label htmlFor="pro-mode-toggle" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" id="pro-mode-toggle" className="sr-only" 
                                        checked={upscaleMode === 'pro'}
                                        onChange={() => setUpscaleMode(upscaleMode === 'standard' ? 'pro' : 'standard')}
                                    />
                                    <div className="block bg-slate-700 w-14 h-8 rounded-full"></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${upscaleMode === 'pro' ? 'translate-x-6 bg-gradient-to-r from-cyan-400 to-blue-500' : ''}`}></div>
                                </div>
                            </label>
                        </div>
                    </LabeledComponent>

                    <LabeledComponent label={t('colorEnhancement')}>
                        <div className="flex items-center w-full" title={t('colorEnhancementTooltip')}>
                            <label htmlFor="color-enhance-toggle" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" id="color-enhance-toggle" className="sr-only" 
                                        checked={colorEnhancement}
                                        onChange={() => setColorEnhancement(!colorEnhancement)}
                                    />
                                    <div className="block bg-slate-700 w-14 h-8 rounded-full"></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${colorEnhancement ? 'translate-x-6 bg-gradient-to-r from-cyan-400 to-blue-500' : ''}`}></div>
                                </div>
                            </label>
                        </div>
                    </LabeledComponent>
                </div>
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
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg">
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