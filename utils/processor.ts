import { AdjustmentValues } from '../types';

export const drawToCanvas = (
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  adjustments: AdjustmentValues
) => {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  // Ensure dimensions match
  if (canvas.width !== image.naturalWidth || canvas.height !== image.naturalHeight) {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
  }

  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);
  ctx.save();

  // 0. Geometry (Rotation)
  if (adjustments.rotate !== 0) {
    // Translate to center
    ctx.translate(width / 2, height / 2);
    
    // Rotate
    const rad = (adjustments.rotate * Math.PI) / 180;
    ctx.rotate(rad);

    // Scale to fill (simple heuristic to hide black edges on small rotations)
    const scale = 1 + Math.abs(Math.sin(rad)) * 0.8; 
    ctx.scale(scale, scale);

    // Translate back
    ctx.translate(-width / 2, -height / 2);
  }

  // 1. Basic Filters using ctx.filter
  const brightness = 100 + adjustments.exposure;
  const contrast = 100 + adjustments.contrast;
  const saturate = 100 + adjustments.saturation;
  const blur = adjustments.blur;
  
  // Sepia used for partial warmth
  const sepia = adjustments.warmth > 0 ? adjustments.warmth * 0.5 : 0;

  let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blur}px) sepia(${sepia}%)`;
  
  // Simple Hue Rotate for tint (Green/Magenta axis approx)
  if (adjustments.tint !== 0) {
      filterString += ` hue-rotate(${adjustments.tint}deg)`;
  }

  ctx.filter = filterString;
  ctx.drawImage(image, 0, 0);
  
  ctx.restore(); 

  // 2. Advanced Overlays (Manually composited)
  
  // Warmth (Blue/Orange overlay method)
  if (adjustments.warmth !== 0) {
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = adjustments.warmth > 0 ? `rgba(255, 180, 0, ${adjustments.warmth / 200})` : `rgba(0, 100, 255, ${Math.abs(adjustments.warmth) / 200})`;
    ctx.fillRect(0, 0, width, height);
  }

  // Vignette
  if (adjustments.vignette > 0) {
    ctx.globalCompositeOperation = 'multiply';
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 
      Math.min(width, height) * 0.3, // Inner radius
      width / 2, height / 2, 
      Math.max(width, height) * 0.8 // Outer radius
    );
    const alpha = adjustments.vignette / 100;
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, `rgba(0,0,0,${alpha})`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  // Reset Composite
  ctx.globalCompositeOperation = 'source-over';
};