
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageResultViewer } from './components/ImageResultViewer';
import { LoadingState } from './components/LoadingState';
import { upscaleImage } from './services/geminiService';
import type { UpscaleFactor } from './types';
import { ControlPanel } from './components/ControlPanel';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [upscaleFactor, setUpscaleFactor] = useState<UpscaleFactor>(2);

  const handleImageUpload = (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`File is too large. Please upload an image under ${MAX_FILE_SIZE_MB}MB.`);
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

  const handleUpscale = useCallback(async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setUpscaledImage(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(originalImage);
      reader.onload = async (event) => {
        const base64Image = (event.target?.result as string).split(',')[1];
        if (!base64Image) {
            setError('Could not process image. Please try another file.');
            setIsLoading(false);
            return;
        }
        
        const enhancedImageBase64 = await upscaleImage(base64Image, originalImage.type, upscaleFactor);
        setUpscaledImage(`data:image/png;base64,${enhancedImageBase64}`);
        setIsLoading(false);
      };
      reader.onerror = () => {
        setError('Failed to read the image file.');
        setIsLoading(false);
      };
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during upscaling.');
      setIsLoading(false);
    }
  }, [originalImage, upscaleFactor]);

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
              setUpscaleFactor={setUpscaleFactor}
              upscaleFactor={upscaleFactor}
              isLoading={isLoading}
            />
            
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative w-full max-w-4xl text-center" role="alert">
                <strong className="font-bold">Error: </strong>
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
        <p>Powered by Google Gemini. Designed for high-quality image enhancement.</p>
      </footer>
    </div>
  );
};

export default App;