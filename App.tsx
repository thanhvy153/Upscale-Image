
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { upscaleImage } from './services/geminiService';
import type { UpscaleFactor, UpscalingGoal, PreprocessingOptions, UpscaleMode, UpscaleEngine, Job, JobStatus } from './types';
import { ControlPanel } from './components/ControlPanel';
import { useI18n } from './contexts/I18nContext';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  const { t } = useI18n();
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const getStatusChipColor = (status: JobStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'processing': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'error': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'queued':
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const handleDownload = async (format: 'png' | 'jpeg') => {
    if (!job.upscaledImage || isDownloading) return;
    setIsDownloading(format);

    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Failed to load upscaled image for processing.'));
        image.src = job.upscaledImage!;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      ctx.drawImage(img, 0, 0);

      let finalBlob: Blob | null = null;
      const fileExtension = format;

      if (format === 'jpeg') {
        const TARGET_SIZE_BYTES = 40 * 1024 * 1024; // 40 MB
        const MIN_QUALITY = 0.70;
        let currentQuality = 0.95;

        // Smart Size Controller: Iteratively find the best quality under the size limit
        while (true) {
          const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', currentQuality));
          if (!blob) {
            console.error('Failed to create blob at quality:', currentQuality);
            break;
          }

          finalBlob = blob;
          if (blob.size <= TARGET_SIZE_BYTES || currentQuality <= MIN_QUALITY) {
            // Stop if we are under budget or have reached the minimum quality
            break;
          }
          currentQuality -= 0.05;
        }
      } else { // format === 'png'
        finalBlob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      }

      if (finalBlob) {
        const url = URL.createObjectURL(finalBlob);
        const a = document.createElement('a');
        a.href = url;
        const baseName = job.file.name.split('.').slice(0, -1).join('.');
        a.download = `upscaled-${baseName}.${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        throw new Error('Failed to create image blob for download.');
      }
    } catch (err) {
      console.error("Download failed:", err);
      // In a larger app, we would propagate this error to the UI
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 flex flex-col gap-4">
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-start gap-3">
          <img src={job.originalPreview} alt={job.file.name} className="w-16 h-16 rounded-md object-cover bg-slate-900" />
          <div>
            <p className="text-sm font-semibold text-slate-200 break-all">{job.file.name}</p>
            <p className="text-xs text-slate-400">{Math.round(job.file.size / 1024)} KB</p>
          </div>
        </div>
        <div className={`text-xs font-bold px-2 py-1 rounded-full border whitespace-nowrap ${getStatusChipColor(job.status)}`}>
          {t(`jobStatus${job.status.charAt(0).toUpperCase() + job.status.slice(1)}` as any)}
        </div>
      </div>

      {job.status === 'processing' && (
        <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
          <div className="bg-cyan-500 h-2.5 rounded-full animate-pulse" style={{width: '100%'}}></div>
        </div>
      )}

      {job.status === 'completed' && job.upscaledImage && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col items-center">
              <img src={job.originalPreview} alt={t('originalImageTitle')} className="w-full h-auto rounded-lg object-contain" />
              <p className="text-xs mt-1 text-slate-400 font-semibold">{t('originalImageTitle')}</p>
            </div>
            <div className="flex flex-col items-center">
              <img src={job.upscaledImage} alt={t('upscaledImageTitle')} className="w-full h-auto rounded-lg object-contain" />
              <p className="text-xs mt-1 text-slate-400 font-semibold">{t('upscaledImageTitle')}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              onClick={() => handleDownload('jpeg')} 
              disabled={!!isDownloading}
              className="w-full text-sm inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-colors disabled:bg-cyan-800 disabled:cursor-not-allowed">
              {isDownloading === 'jpeg' ? t('compressing') : t('downloadOptimizedJPG')}
            </button>
            <button 
              onClick={() => handleDownload('png')} 
              disabled={!!isDownloading}
              className="w-full text-sm inline-flex items-center justify-center px-4 py-2 border border-slate-600 font-medium rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 transition-colors disabled:bg-slate-800 disabled:cursor-not-allowed">
              {isDownloading === 'png' ? t('preparing') : t('downloadMaxQualityPNG')}
            </button>
          </div>
        </div>
      )}

      {job.status === 'error' && job.error && (
        <div className="bg-red-900/50 border border-red-700/50 text-red-200 px-3 py-2 rounded-lg text-sm" role="alert">
          <strong className="font-bold">{t('errorPrefix')}</strong>
          <span>{job.error}</span>
        </div>
      )}
    </div>
  );
};

const BatchProcessor: React.FC<{ jobs: Job[] }> = ({ jobs }) => {
  const { t } = useI18n();
  return (
    <div className="w-full max-w-5xl flex flex-col gap-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-200">{t('batchQueueTitle')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {jobs.map(job => <JobCard key={job.id} job={job} />)}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { t } = useI18n();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Settings state
  const [upscaleFactor, setUpscaleFactor] = useState<UpscaleFactor>(4);
  const [upscalingGoal, setUpscalingGoal] = useState<UpscalingGoal>('balanced');
  const [upscaleMode, setUpscaleMode] = useState<UpscaleMode>('standard');
  const [upscaleEngine, setUpscaleEngine] = useState<UpscaleEngine>('generative');
  const [colorEnhancement, setColorEnhancement] = useState<boolean>(true);
  const [preprocessingOptions, setPreprocessingOptions] = useState<PreprocessingOptions>({
    noiseReduction: false,
    autoContrast: false,
  });

  const handleImageUpload = (files: FileList) => {
    setError(null);
    const newJobs: Job[] = [];
    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(t('errorFileSize', MAX_FILE_SIZE_MB));
        continue;
      }
      newJobs.push({
        id: crypto.randomUUID(),
        file,
        originalPreview: URL.createObjectURL(file),
        upscaledImage: null,
        status: 'queued',
        error: null,
      });
    }
    setJobs(prevJobs => [...prevJobs, ...newJobs]);
  };
  
  const handleClearQueue = () => {
    jobs.forEach(job => URL.revokeObjectURL(job.originalPreview));
    setJobs([]);
    setError(null);
    setIsBatchProcessing(false);
  };

  const preprocessImage = (file: File, options: PreprocessingOptions): Promise<string> => {
      return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              if (!ctx) return reject(new Error('Could not get canvas context'));

              canvas.width = img.width;
              canvas.height = img.height;
              let filterString = '';
              if (options.noiseReduction) filterString += 'blur(0.4px) ';
              if (options.autoContrast) filterString += 'contrast(1.15) ';
              ctx.filter = filterString.trim();
              ctx.drawImage(img, 0, 0);
              resolve(canvas.toDataURL(file.type));
          };
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
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

  const applyColorEnhancement = (dataUrl: string): Promise<string> => {
      return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              if (!ctx) return reject(new Error('Could not get canvas context'));
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.filter = 'saturate(1.2) contrast(1.1) brightness(1.05)';
              ctx.drawImage(img, 0, 0);
              resolve(canvas.toDataURL('image/png'));
          };
          img.onerror = (err) => reject(new Error('Failed to load image for enhancement.'));
          img.src = dataUrl;
      });
  };

  const clientSideUpscale = (file: File, factor: UpscaleFactor): Promise<string> => {
      return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
              const newWidth = img.width * factor;
              const newHeight = img.height * factor;
              const canvas = document.createElement('canvas');
              canvas.width = newWidth;
              canvas.height = newHeight;
              const ctx = canvas.getContext('2d');
              if (!ctx) return reject(new Error('Could not get canvas context'));
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(img, 0, 0, newWidth, newHeight);
              const finalCanvas = document.createElement('canvas');
              finalCanvas.width = newWidth;
              finalCanvas.height = newHeight;
              const finalCtx = finalCanvas.getContext('2d');
              if (!finalCtx) return reject(new Error('Could not get canvas context for filtering'));
              finalCtx.filter = 'contrast(1.05)';
              finalCtx.drawImage(canvas, 0, 0);
              resolve(finalCanvas.toDataURL(file.type));
          };
          img.onerror = () => reject(new Error('Image could not be loaded for client-side upscaling.'));
          img.src = URL.createObjectURL(file);
      });
  };

  const handleStartBatch = useCallback(async () => {
    setIsBatchProcessing(true);
    setError(null);

    const jobsToProcess = jobs.filter(j => j.status === 'queued' || j.status === 'error');

    for (const job of jobsToProcess) {
      try {
        setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'processing', error: null } : j));
        
        let finalImageSrc: string;

        if (upscaleEngine === 'fidelity') {
            finalImageSrc = await clientSideUpscale(job.file, upscaleFactor);
        } else {
            const needsPreprocessing = preprocessingOptions.noiseReduction || preprocessingOptions.autoContrast;
            const imageDataUrl = needsPreprocessing
              ? await preprocessImage(job.file, preprocessingOptions)
              : await fileToDataURL(job.file);

            const base64Image = imageDataUrl.split(',')[1];
            if (!base64Image) throw new Error(t('errorProcessImage'));
            
            const enhancedImageBase64 = await upscaleImage(base64Image, job.file.type, upscaleFactor, upscalingGoal, upscaleMode);
            let upscaledSrc = `data:image/png;base64,${enhancedImageBase64}`;

            if (colorEnhancement) {
              upscaledSrc = await applyColorEnhancement(upscaledSrc);
            }
            finalImageSrc = upscaledSrc;
        }

        setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'completed', upscaledImage: finalImageSrc } : j));

      } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : t('errorUnknown');
        setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'error', error: message } : j));
      }
    }

    setIsBatchProcessing(false);
  }, [jobs, upscaleFactor, upscalingGoal, upscaleMode, preprocessingOptions, colorEnhancement, t, upscaleEngine]);

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-7xl mx-auto flex-grow flex flex-col items-center gap-8">
        {jobs.length === 0 ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <>
            <ControlPanel
              onStartBatch={handleStartBatch}
              onClearQueue={handleClearQueue}
              upscaleFactor={upscaleFactor}
              setUpscaleFactor={setUpscaleFactor}
              upscalingGoal={upscalingGoal}
              setUpscalingGoal={setUpscalingGoal}
              preprocessingOptions={preprocessingOptions}
              setPreprocessingOptions={setPreprocessingOptions}
              upscaleMode={upscaleMode}
              setUpscaleMode={setUpscaleMode}
              colorEnhancement={colorEnhancement}
              setColorEnhancement={setColorEnhancement}
              isLoading={isBatchProcessing}
              upscaleEngine={upscaleEngine}
              setUpscaleEngine={setUpscaleEngine}
            />
            <BatchProcessor jobs={jobs} />
          </>
        )}
        
        {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative w-full max-w-4xl text-center mt-4" role="alert">
              <strong className="font-bold">{t('errorPrefix')}</strong>
              <span className="block sm:inline">{error}</span>
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
