
export type UpscaleFactor = 2 | 4 | 8;

export type UpscalingGoal = 'balanced' | 'details' | 'smoothness';

export type UpscaleMode = 'standard' | 'pro';

export interface PreprocessingOptions {
  noiseReduction: boolean;
  autoContrast: boolean;
}

export type UpscaleEngine = 'generative' | 'fidelity';

export type JobStatus = 'queued' | 'processing' | 'completed' | 'error';

export interface Job {
  id: string;
  file: File;
  originalPreview: string;
  upscaledImage: string | null;
  status: JobStatus;
  error: string | null;
}
