import React from 'react';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  step?: number;
  resetValue?: number;
}

const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  min,
  max,
  onChange,
  step = 1,
  resetValue = 0
}) => {
  const isModified = value !== resetValue;

  // Calculate background fill width
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-6 group">
      <div className="flex justify-between items-center mb-3 px-1">
        <label className={`text-xs font-medium tracking-wide transition-colors ${isModified ? 'text-black' : 'text-gray-500 group-hover:text-gray-700'}`}>
          {label}
        </label>
        <span className={`text-xs font-mono tabular-nums ${isModified ? 'text-black font-semibold' : 'text-gray-400'}`}>
          {value > 0 && '+'}{value}{label.includes('旋转') ? '°' : ''}
        </span>
      </div>
      <div className="relative w-full flex items-center h-6">
         {/* Track Background */}
        <div className="absolute w-full h-1 bg-gray-400/20 rounded-full overflow-hidden">
            {/* Progress Fill (Only visible if non-center based, or handle center logic) */}
             <div
              className="h-full bg-black/80 absolute transition-all duration-75 rounded-full"
              style={{
                left: min < 0 ? '50%' : '0%',
                width: `${Math.abs(value - (min < 0 ? 0 : min)) / (max - min) * (min < 0 ? 200 : 100)}%`,
                transform: min < 0 && value < 0 ? 'translateX(-100%)' : 'none',
                opacity: isModified ? 1 : 0
              }}
             />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        {/* Visual Thumb */}
        <div
            className="pointer-events-none absolute h-5 w-5 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.2)] border border-black/5 rounded-full flex items-center justify-center transition-transform duration-75 z-0"
            style={{
                left: `calc(${percentage}% - 10px)`
            }}
        >
            {/* Small dot in center */}
            <div className={`w-1 h-1 rounded-full ${isModified ? 'bg-black' : 'bg-gray-300'}`} />
        </div>
      </div>
    </div>
  );
};

export default SliderControl;