
export type UpscaleFactor = 2 | 4 | 8;

export type UpscalingGoal = 'balanced' | 'details' | 'smoothness';

export interface PreprocessingOptions {
  noiseReduction: boolean;
  autoContrast: boolean;
}
