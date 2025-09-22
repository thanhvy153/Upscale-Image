
import React, { useCallback, useState } from 'react';
import { useI18n } from '../contexts/I18nContext';

interface ImageUploaderProps {
  onImageUpload: (files: FileList) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageUpload(e.target.files);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImageUpload(e.dataTransfer.files);
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-2xl shadow-xl border border-slate-700 animate-fade-in">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors duration-300 ${isDragging ? 'border-cyan-400 bg-slate-700/50' : 'border-slate-600'}`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          multiple
        />
        <label htmlFor="file-upload" className="text-center cursor-pointer p-4">
          <svg className="mx-auto h-12 w-12 text-slate-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-4 text-lg font-semibold text-cyan-400">{t('uploaderPrompt')}</p>
          <p className="text-sm text-slate-400 mt-1">{t('uploaderFormats')}</p>
        </label>
      </div>
    </div>
  );
};
