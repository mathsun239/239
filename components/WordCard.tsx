import React from 'react';
import { WordEntry } from '../types';
import { Volume2, Plus, Check } from 'lucide-react';

interface WordCardProps {
  word: Omit<WordEntry, 'id' | 'dateAdded'>;
  onAdd?: () => void;
  isAdded?: boolean;
  onCharClick: (char: string) => void;
  minimal?: boolean; // For quiz or compact view
  showMeaning?: boolean; // For quiz reveal
}

const WordCard: React.FC<WordCardProps> = ({ 
  word, 
  onAdd, 
  isAdded = false, 
  onCharClick, 
  minimal = false,
  showMeaning = true 
}) => {
  
  const speak = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all ${minimal ? 'text-center' : ''}`}>
      <div className={`flex ${minimal ? 'flex-col items-center gap-4' : 'justify-between items-start'}`}>
        <div>
          <div className="flex items-baseline gap-3 mb-1">
            <h3 className="text-3xl font-sc font-bold text-slate-800 cursor-pointer">
              {word.simplified.split('').map((char, idx) => (
                <span 
                  key={idx} 
                  onClick={() => onCharClick(char)}
                  className="hover:text-rose-600 hover:bg-rose-50 rounded px-0.5 transition-colors"
                >
                  {char}
                </span>
              ))}
            </h3>
            {showMeaning && (
              <span className="text-lg text-rose-600 font-medium">{word.pinyin}</span>
            )}
            <button 
              onClick={(e) => speak(word.simplified, e)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <Volume2 size={18} />
            </button>
          </div>
          
          {showMeaning && (
            <p className="text-slate-600 font-medium text-lg">{word.meaning}</p>
          )}
        </div>

        {onAdd && (
          <button 
            onClick={onAdd}
            disabled={isAdded}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isAdded 
                ? 'bg-green-100 text-green-700 cursor-default' 
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
          >
            {isAdded ? <Check size={16} /> : <Plus size={16} />}
            {isAdded ? '추가됨' : '단어장에 추가'}
          </button>
        )}
      </div>

      {!minimal && showMeaning && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-slate-700 mb-1 font-sc text-lg">{word.example}</p>
          <p className="text-slate-500 text-sm">{word.exampleMeaning}</p>
        </div>
      )}
    </div>
  );
};

export default WordCard;
