import React from 'react';
import { Sun, Palette, Zap, Sliders, Film, Crop } from 'lucide-react';
import { EditorCategory } from '../types';

interface CategoryNavProps {
  selected: EditorCategory;
  onSelect: (category: EditorCategory) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ selected, onSelect }) => {
  const categories = [
    { id: EditorCategory.PRESETS, icon: Film, label: '胶片' },
    { id: EditorCategory.LIGHT, icon: Sun, label: '光效' },
    { id: EditorCategory.COLOR, icon: Palette, label: '色彩' },
    { id: EditorCategory.GEOMETRY, icon: Crop, label: '构图' },
    { id: EditorCategory.DETAIL, icon: Zap, label: '细节' },
    { id: EditorCategory.EFFECTS, icon: Sliders, label: '特效' },
  ];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-2 px-4 mb-4">
      {categories.map((cat) => {
        const isSelected = selected === cat.id;
        const Icon = cat.icon;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex flex-col items-center min-w-[64px] gap-1.5 cursor-pointer transition-all duration-300 group outline-none rounded-xl py-2
              ${isSelected ? 'bg-white/40 shadow-sm' : 'hover:bg-white/20'}
            `}
          >
            <div className={`p-2 rounded-full transition-all duration-300 ${isSelected ? 'text-black scale-110' : 'text-gray-500 group-hover:text-gray-800'}`}>
               <Icon size={22} strokeWidth={isSelected ? 2.5 : 1.5} />
            </div>
            <span className={`text-[10px] font-medium tracking-wide ${isSelected ? 'text-black' : 'text-gray-500'}`}>
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryNav;