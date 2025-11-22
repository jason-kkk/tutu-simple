import { useEffect, useRef, useState, useCallback } from 'react';
import { AdjustmentValues } from '../types';
import { drawToCanvas } from '../utils/processor';

export const DEFAULT_ADJUSTMENTS: AdjustmentValues = {
  exposure: 0,
  contrast: 0,
  saturation: 0,
  warmth: 0,
  tint: 0,
  blur: 0,
  vignette: 0,
  sharpness: 0,
  rotate: 0,
};

export const useImageProcessor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [adjustments, setAdjustments] = useState<AdjustmentValues>(DEFAULT_ADJUSTMENTS);
  const [isProcessing, setIsProcessing] = useState(false);

  const updateAdjustment = useCallback((key: keyof AdjustmentValues, value: number) => {
    setAdjustments(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetAdjustments = useCallback(() => {
    setAdjustments(DEFAULT_ADJUSTMENTS);
  }, []);

  const processImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    setIsProcessing(true);

    requestAnimationFrame(() => {
      drawToCanvas(canvas, image, adjustments);
      setIsProcessing(false);
    });

  }, [image, adjustments]);

  useEffect(() => {
    processImage();
  }, [processImage]);

  return {
    canvasRef,
    setImage,
    adjustments,
    updateAdjustment,
    resetAdjustments,
    setAdjustments,
    image,
    isProcessing
  };
};