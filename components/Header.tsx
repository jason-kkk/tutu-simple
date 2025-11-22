import React from 'react';
import { Download, Image as ImageIcon, Layers } from 'lucide-react';

interface HeaderProps {
  hasImage: boolean;
  isBatchMode: boolean;
  onToggleBatchMode: () => void;
  onExport: () => void;
  onReset: () => void;
  onUploadClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  hasImage, 
  isBatchMode,
  onToggleBatchMode,
  onExport, 
  onReset, 
  onUploadClick 
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-3 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3 cursor-default">
          <div className={`text-black/80 transition-transform ${isBatchMode ? 'rotate-180' : ''}`}>
             {isBatchMode ? <Layers size={24} /> : <ImageIcon size={24} />}
          </div>
          <span className="text-lg font-bold tracking-tight text-black/80 hidden sm:block font-sans">
            Lumina {isBatchMode && <span className="font-light opacity-60">| Batch</span>}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <button
             onClick={onToggleBatchMode}
             className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${isBatchMode ? 'bg-black text-white shadow-lg' : 'bg-black/5 text-gray-600 hover:bg-black/10'}`}
          >
            <Layers size={14} />
            {isBatchMode ? '返回单图' : '批量处理'}
          </button>

          {!isBatchMode && hasImage && (
            <>
               <div className="w-px h-4 bg-gray-300 mx-1" />
               <button
                onClick={onUploadClick}
                className="hidden md:flex items-center px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-black/5 rounded-full transition-colors"
              >
                打开图片
              </button>
              <button
                onClick={onReset}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black transition-all"
              >
                重置
              </button>
              <button
                onClick={onExport}
                className="flex items-center gap-2 bg-black text-white/90 px-5 py-2 rounded-full font-medium text-xs shadow-lg hover:scale-105 hover:shadow-xl transition-all transform active:scale-95"
              >
                <Download size={14} strokeWidth={2.5} />
                导出
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;