export interface AdjustmentValues {
  exposure: number;
  contrast: number;
  saturation: number;
  warmth: number;
  tint: number;
  blur: number;
  vignette: number;
  sharpness: number;
  rotate: number;
}

export enum EditorCategory {
  PRESETS = 'Presets',
  LIGHT = 'Light',
  COLOR = 'Color',
  DETAIL = 'Detail',
  GEOMETRY = 'Geometry',
  EFFECTS = 'Effects'
}

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  color: string; // CSS color for UI representation
  values: Partial<AdjustmentValues>;
}