
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';

interface ImageResultViewerProps {
  originalImage: string | null;
  upscaledImage: string | null;
}

export const ImageResultViewer: React.FC<ImageResultViewerProps> = ({ originalImage, upscaledImage }) => {
  const { t } = useI18n();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  }, [isDragging, handleMove]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);


  if (!originalImage) {
    return null;
  }

  const hasUpscaledImage = !!upscaledImage;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-4">
      <div 
        ref={containerRef}
        className="w-full aspect-square relative select-none overflow-hidden rounded-xl bg-slate-900/50 border border-slate-700"
      >
        {/* Original Image (Bottom Layer) */}
        <img
          src={originalImage}
          alt={t('originalImageTitle')}
          className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
        />

        {hasUpscaledImage ? (
          <>
            {/* Upscaled Image (Top Layer, clipped) */}
            <div
              className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={upscaledImage}
                alt={t('upscaledImageTitle')}
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-cyan-400/80 cursor-ew-resize"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
              onMouseDown={handleMouseDown}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-cyan-400/80 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                </svg>
              </div>
            </div>
          </>
        ) : (
          // Placeholder when upscaled image is not available yet
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
            <h3 className="text-xl font-bold text-slate-300">{t('upscaledImageTitle')}</h3>
            <p className="text-slate-400 mt-2">{t('upscaledPlaceholder')}</p>
          </div>
        )}
      </div>

      {hasUpscaledImage && (
        <a
          href={upscaledImage}
          download="upscaled-image.png"
          className="w-full max-w-sm inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-colors animate-fade-in"
        >
          <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {t('downloadButton')}
        </a>
      )}
    </div>
  );
};
