
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageResultViewer } from './components/ImageResultViewer';
import { LoadingState } from './components/LoadingState';
import { upscaleImage } from './services/geminiService';
import type { UpscaleFactor, UpscalingGoal, PreprocessingOptions, UpscaleMode } from './types';
import { ControlPanel } from './components/ControlPanel';
import { useI18n } from './contexts/I18nContext';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const App: React.FC = () => {
  const { t } = useI18n();
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [upscaleFactor, setUpscaleFactor] = useState<UpscaleFactor>(4);
  const [upscalingGoal, setUpscalingGoal] = useState<UpscalingGoal>('balanced');
  const [upscaleMode, setUpscaleMode] = useState<UpscaleMode>('standard');
  const [preprocessingOptions, setPreprocessingOptions] = useState<PreprocessingOptions>({
    noiseReduction: false,
    autoContrast: false,
  });

  const handleImageUpload = (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(t('errorFileSize', MAX_FILE_SIZE_MB));
        return;
    }
    setOriginalImage(file);
    setUpscaledImage(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleReset = () => {
    setOriginalImage(null);
    setOriginalImagePreview(null);
    setUpscaledImage(null);
    setError(null);
    setIsLoading(false);
  };

  const preprocessImage = (file: File, options: PreprocessingOptions): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error('Could not get canvas context'));
                }

                canvas.width = img.width;
                canvas.height = img.height;
                
                let filterString = '';
                if (options.noiseReduction) {
                    // A very slight blur can act as a simple denoise filter
                    filterString += 'blur(0.4px) ';
                }
                if (options.autoContrast) {
                    // A simple contrast boost
                    filterString += 'contrast(1.15) ';
                }
                
                ctx.filter = filterString.trim();
                ctx.drawImage(img, 0, 0);
                
                // Resolve with the new data URL
                resolve(canvas.toDataURL(file.type));
            };
            img.onerror = reject;
            img.src = event.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  };

  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpscale = useCallback(async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setUpscaledImage(null);

    try {
      const needsPreprocessing = preprocessingOptions.noiseReduction || preprocessingOptions.autoContrast;
      const imageDataUrl = needsPreprocessing
        ? await preprocessImage(originalImage, preprocessingOptions)
        : await fileToDataURL(originalImage);

      const base64Image = imageDataUrl.split(',')[1];
      if (!base64Image) {
          setError(t('errorProcessImage'));
          setIsLoading(false);
          return;
      }
      
      const enhancedImageBase64 = await upscaleImage(base64Image, originalImage.type, upscaleFactor, upscalingGoal, upscaleMode);
      setUpscaledImage(`data:image/png;base64,${enhancedImageBase64}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : t('errorUnknown'));
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, upscaleFactor, upscalingGoal, upscaleMode, preprocessingOptions, t]);


  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-7xl mx-auto flex-grow flex flex-col items-center">
        {!originalImagePreview ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="w-full flex flex-col items-center gap-8">
            <ControlPanel
              onUpscale={handleUpscale}
              onReset={handleReset}
              upscaleFactor={upscaleFactor}
              setUpscaleFactor={setUpscaleFactor}
              upscalingGoal={upscalingGoal}
              setUpscalingGoal={setUpscalingGoal}
              preprocessingOptions={preprocessingOptions}
              setPreprocessingOptions={setPreprocessingOptions}
              upscaleMode={upscaleMode}
              setUpscaleMode={setUpscaleMode}
              isLoading={isLoading}
            />
            
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative w-full max-w-4xl text-center" role="alert">
                <strong className="font-bold">{t('errorPrefix')}</strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {isLoading ? (
              <LoadingState />
            ) : (
              <ImageResultViewer 
                originalImage={originalImagePreview} 
                upscaledImage={upscaledImage} 
              />
            )}
          </div>
        )}
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm mt-8">
        <p>{t('footerText')}</p>
      </footer>
    </div>
  );
};

export default App;