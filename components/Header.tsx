
import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import { LanguageSelector } from './LanguageSelector';

export const Header: React.FC = () => {
  const { t } = useI18n();

  return (
    <header className="w-full max-w-7xl mx-auto text-center mb-8 sm:mb-12 relative">
       <div className="absolute top-0 right-0 p-2">
        <LanguageSelector />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 pt-12 sm:pt-0">
        {t('headerTitle')}
      </h1>
      <p className="mt-3 text-lg text-slate-400 max-w-2xl mx-auto">
        {t('headerSubtitle')}
      </p>
    </header>
  );
};