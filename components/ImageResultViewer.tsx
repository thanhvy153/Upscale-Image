
import React from 'react';

interface ImageResultViewerProps {
  originalImage: string | null;
  upscaledImage: string | null;
}

const ImageView: React.FC<{ src: string | null; title: string; isUpscaled?: boolean; }> = ({ src, title, isUpscaled = false }) => {
  return (
    <div className="flex-1 w-full flex flex-col items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
      <h3 className="text-xl font-bold text-slate-300">{title}</h3>
      <div className="w-full aspect-square bg-slate-900/50 rounded-lg flex items-center justify-center overflow-hidden">
        {src ? (
          <img src={src} alt={title} className="w-full h-full object-contain" />
        ) : (
          <div className="text-slate-500 text-center p-4">
            {isUpscaled ? 'Your enhanced image will appear here.' : 'Image preview not available.'}
          </div>
        )}
      </div>
    </div>
  );
};

export const ImageResultViewer: React.FC<ImageResultViewerProps> = ({ originalImage, upscaledImage }) => {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
      <ImageView src={originalImage} title="Original" />
      <div className="flex-1 w-full flex flex-col items-center gap-4">
        {upscaledImage ? (
          <div className="w-full flex flex-col items-center gap-4 animate-fade-in">
            <ImageView src={upscaledImage} title="Upscaled" isUpscaled />
            <a
              href={upscaledImage}
              download="upscaled-image.png"
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-colors"
            >
              <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download Upscaled Image
            </a>
          </div>
        ) : (
           <ImageView src={null} title="Upscaled" isUpscaled />
        )}
      </div>
    </div>
  );
};