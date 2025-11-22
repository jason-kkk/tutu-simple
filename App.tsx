import React, { useRef, useState } from 'react';
import { Upload, Check, Sparkles, RefreshCw, Wand2 } from 'lucide-react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import SliderControl from './components/SliderControl';
import BatchProcessor from './components/BatchProcessor';
import { useImageProcessor, DEFAULT_ADJUSTMENTS } from './hooks/useImageProcessor';
import { EditorCategory, FilterPreset, AdjustmentValues } from './types';

// Film Presets Definitions
const FILM_PRESETS: FilterPreset[] = [
  {
    id: 'none',
    name: '原图',
    description: 'Original',
    color: '#e5e7eb',
    values: DEFAULT_ADJUSTMENTS
  },
  {
    id: 'portra-400',
    name: 'Portra 400',
    description: '人像首选，通透肤色',
    color: '#fca5a5', 
    values: {
      exposure: 8,
      contrast: -5,
      saturation: 12,
      warmth: 10,
      tint: -6, 
      sharpness: 5
    }
  },
  {
    id: 'kodak-gold',
    name: 'Gold 200',
    description: '经典暖调，生活感',
    color: '#fbbf24',
    values: {
      exposure: 5,
      contrast: 8,
      saturation: 18,
      warmth: 20,
      tint: 0,
      vignette: 10
    }
  },
  {
    id: 'fuji-pro',
    name: 'Fuji 400H',
    description: '日系清凉，偏青绿',
    color: '#86efac',
    values: {
      exposure: 10,
      contrast: 5,
      saturation: 5,
      warmth: -5,
      tint: 12, 
    }
  },
  {
    id: 'cinestill',
    name: 'Cinestill 800',
    description: '电影夜景，冷调光晕',
    color: '#93c5fd',
    values: {
      exposure: 0,
      contrast: 15,
      saturation: -5,
      warmth: -15, 
      tint: -5,
      vignette: 20
    }
  },
  {
    id: 'ilford-bw',
    name: 'Ilford HP5',
    description: '经典黑白，高宽容度',
    color: '#525252', 
    values: {
      saturation: -100,
      contrast: 20,
      exposure: 5,
      vignette: 25,
      sharpness: 10
    }
  }
];

// Auto Portra Logic Definition
const AUTO_PORTRA_PRESET: FilterPreset = {
  id: 'auto-portra', 
  name: 'Portra Auto', 
  description: 'AI 智能胶片优化', 
  color: '#ff7e5f',
  values: { 
    exposure: 12, 
    contrast: -8, 
    saturation: 15, 
    warmth: 15, 
    tint: -8, 
    vignette: 8 
  }
};

const App: React.FC = () => {
  const { 
    canvasRef, 
    setImage, 
    adjustments, 
    updateAdjustment, 
    resetAdjustments,
    image,
    setAdjustments
  } = useImageProcessor();
  
  const [activePresetId, setActivePresetId] = useState<string>('none');
  const [selectedCategory, setSelectedCategory] = useState<EditorCategory>(EditorCategory.PRESETS);
  const [presetIntensity, setPresetIntensity] = useState<number>(100); // 0 to 100
  const [activePresetValues, setActivePresetValues] = useState<Partial<AdjustmentValues>>(DEFAULT_ADJUSTMENTS);
  const [isBatchMode, setIsBatchMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setImage(img);
      };
      img.src = url;
      resetAdjustments();
      setActivePresetId('none');
      setPresetIntensity(100);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'lumina-edit.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  // Apply Preset and store its "Target Values"
  const applyPreset = (preset: FilterPreset) => {
    setActivePresetId(preset.id);
    setActivePresetValues(preset.values);
    setPresetIntensity(100); // Reset intensity to 100% on new selection
    
    const merged = { ...DEFAULT_ADJUSTMENTS, ...preset.values };
    setAdjustments(merged);
  };

  // Dynamic intensity update
  const updatePresetIntensity = (intensity: number) => {
    setPresetIntensity(intensity);
    if (activePresetId === 'none') return;

    // Calculate intermediate values based on intensity
    const newAdjustments = { ...DEFAULT_ADJUSTMENTS };
    
    (Object.keys(DEFAULT_ADJUSTMENTS) as Array<keyof AdjustmentValues>).forEach(key => {
      const targetVal = activePresetValues[key] ?? DEFAULT_ADJUSTMENTS[key];
      const defaultVal = DEFAULT_ADJUSTMENTS[key];
      // Lerp: current = default + (target - default) * percent
      const diff = targetVal - defaultVal;
      newAdjustments[key] = defaultVal + (diff * (intensity / 100));
    });

    setAdjustments(newAdjustments);
  };

  const handleAutoStraighten = () => {
    // Simulate AI Detection: Random correction between -3 and 3 degrees
    const randomRotation = (Math.random() * 6) - 3; 
    updateAdjustment('rotate', parseFloat(randomRotation.toFixed(1)));
  };

  const renderContent = () => {
    switch (selectedCategory) {
      case EditorCategory.PRESETS:
        return (
          <div className="space-y-6">
             {/* Intensity Slider (Only visible if a preset is active) */}
            {activePresetId !== 'none' && (
              <div className="glass-panel p-4 rounded-xl animate-fade-in mb-4 border-l-4 border-black">
                <SliderControl 
                  label={`${activePresetId === 'auto-portra' ? 'AI 强度' : '滤镜强度'}`}
                  value={presetIntensity} 
                  min={0} 
                  max={100} 
                  onChange={updatePresetIntensity} 
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FILM_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`
                    relative flex items-center p-3 rounded-xl border text-left transition-all duration-300
                    ${activePresetId === preset.id 
                      ? 'bg-white/80 border-black shadow-lg scale-[1.02]' 
                      : 'bg-white/40 border-white/40 hover:bg-white/60 hover:shadow-md'
                    }
                  `}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex-shrink-0 mr-3 shadow-inner border border-black/5" 
                    style={{ backgroundColor: preset.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold truncate ${activePresetId === preset.id ? 'text-black' : 'text-gray-800'}`}>
                      {preset.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 truncate">
                      {preset.description}
                    </p>
                  </div>
                  {activePresetId === preset.id && (
                    <div className="absolute right-3 text-black bg-white rounded-full p-0.5 shadow-sm">
                      <Check size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      case EditorCategory.LIGHT:
        return (
          <div className="space-y-2">
            <SliderControl label="曝光度" value={adjustments.exposure} min={-100} max={100} onChange={(v) => updateAdjustment('exposure', v)} />
            <SliderControl label="对比度" value={adjustments.contrast} min={-100} max={100} onChange={(v) => updateAdjustment('contrast', v)} />
          </div>
        );
      case EditorCategory.COLOR:
        return (
          <div className="space-y-2">
            <SliderControl label="饱和度" value={adjustments.saturation} min={-100} max={100} onChange={(v) => updateAdjustment('saturation', v)} />
            <SliderControl label="色温" value={adjustments.warmth} min={-100} max={100} onChange={(v) => updateAdjustment('warmth', v)} />
            <SliderControl label="色调" value={adjustments.tint} min={-100} max={100} onChange={(v) => updateAdjustment('tint', v)} />
          </div>
        );
      case EditorCategory.GEOMETRY:
        return (
           <div className="space-y-6 animate-fade-in">
              <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-4 flex flex-col gap-3">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-2">
                      <Wand2 size={12} /> 智能构图
                    </span>
                 </div>
                 <button 
                  onClick={handleAutoStraighten}
                  className="w-full py-2 bg-white/80 hover:bg-white border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                 >
                   自动水平矫正
                 </button>
              </div>
              
              <div className="pt-2">
                <SliderControl label="旋转" value={adjustments.rotate} min={-45} max={45} step={0.1} onChange={(v) => updateAdjustment('rotate', v)} />
              </div>
           </div>
        );
      case EditorCategory.DETAIL:
        return (
            <div className="space-y-2">
             <SliderControl label="暗角" value={adjustments.vignette} min={0} max={100} onChange={(v) => updateAdjustment('vignette', v)} />
             <SliderControl label="清晰度" value={adjustments.sharpness} min={0} max={50} onChange={(v) => updateAdjustment('sharpness', v)} />
            </div>
        );
      case EditorCategory.EFFECTS:
        return (
          <div className="space-y-2">
            <SliderControl label="模糊" value={adjustments.blur} min={0} max={20} step={0.5} onChange={(v) => updateAdjustment('blur', v)} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 selection:bg-pink-200">
      <Header 
        hasImage={!!image} 
        isBatchMode={isBatchMode}
        onToggleBatchMode={() => setIsBatchMode(!isBatchMode)}
        onExport={handleExport} 
        onReset={() => {
          resetAdjustments();
          setActivePresetId('none');
          setPresetIntensity(100);
        }} 
        onUploadClick={triggerUpload}
      />

      <main className="flex-1 relative flex flex-col h-screen pt-20 lg:pt-0 overflow-hidden">
        
        {isBatchMode ? (
          <div className="w-full h-full animate-fade-in">
            <BatchProcessor />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row h-full">
            {/* Main Canvas Area */}
            <div className={`flex-1 flex items-center justify-center p-6 lg:p-12 relative transition-all duration-500 lg:pt-24`}>
              
              {!image && (
                <div className="max-w-md w-full text-center z-10">
                  <div 
                      onClick={triggerUpload}
                      className="glass-panel rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-white/80 hover:scale-[1.02] transition-all duration-300 group border-2 border-dashed border-gray-400/30"
                    >
                      <div className="bg-gradient-to-br from-rose-400 to-orange-400 p-5 rounded-full text-white mb-6 shadow-lg group-hover:shadow-xl group-hover:rotate-12 transition-all">
                        <Upload size={32} />
                      </div>
                      <h2 className="text-2xl font-bold mb-2 text-gray-800">上传照片</h2>
                      <p className="text-gray-500 mb-6 text-sm">支持 JPG, PNG 格式</p>
                      <span className="text-xs font-medium bg-gray-900 text-white px-4 py-2 rounded-full">从设备选择</span>
                  </div>
                </div>
              )}

              <div className={`relative shadow-2xl rounded-lg overflow-hidden max-w-full max-h-full transition-all duration-700 ${image ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'}`}>
                {/* Shadow container to mimic floating photo */}
                <div className="absolute inset-0 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] pointer-events-none"></div>
                <canvas 
                    ref={canvasRef} 
                    className="max-w-full max-h-[75vh] object-contain block relative z-10"
                />
              </div>
            </div>

            {/* Editor Sidebar */}
            {image && (
              <div className="w-full lg:w-[380px] z-20 flex flex-col lg:h-full lg:pt-24 bg-transparent pointer-events-none">
                <div className="flex-1 pointer-events-auto flex flex-col mx-4 lg:mr-6 lg:ml-0 mb-4 lg:mb-6 glass-panel rounded-3xl shadow-glass overflow-hidden border border-white/40">
                  
                  <div className="px-5 py-5 border-b border-gray-200/30">
                    <CategoryNav selected={selectedCategory} onSelect={setSelectedCategory} />
                  </div>

                  <div className="flex-1 overflow-y-auto px-5 py-6 no-scrollbar">
                    {renderContent()}
                  </div>

                  {/* Portra AI Quick Action */}
                  {selectedCategory !== EditorCategory.PRESETS && (
                    <div className="px-5 py-5 bg-white/30 backdrop-blur-sm border-t border-white/40">
                        <button onClick={() => applyPreset(AUTO_PORTRA_PRESET)} 
                          className={`w-full py-3 px-4 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-3 group relative overflow-hidden
                            ${activePresetId === 'auto-portra' ? 'bg-black text-white' : 'bg-white text-gray-800 hover:bg-gray-50'}
                          `}>
                            <div className={`absolute inset-0 opacity-20 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 transition-opacity ${activePresetId === 'auto-portra' ? 'opacity-100' : 'opacity-0'}`} />
                            
                            <div className="relative z-10 flex items-center gap-2">
                              <Sparkles size={14} className={activePresetId === 'auto-portra' ? 'text-yellow-200' : 'text-orange-500'} />
                              <span>Portra Auto 智能增强</span>
                            </div>
                            {activePresetId === 'auto-portra' && (
                              <RefreshCw size={14} className="relative z-10 ml-auto opacity-50" />
                            )}
                        </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
};

export default App;