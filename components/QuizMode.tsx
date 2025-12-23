import React, { useState, useEffect } from 'react';
import { WordEntry } from '../types';
import WordCard from './WordCard';
import { ArrowRight, RefreshCw, Trophy } from 'lucide-react';

interface QuizModeProps {
  words: WordEntry[];
  onCharClick: (char: string) => void;
  onComplete: () => void;
}

const QuizMode: React.FC<QuizModeProps> = ({ words, onCharClick, onComplete }) => {
  const [queue, setQueue] = useState<WordEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // Shuffle and pick up to 10 words
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    setQueue(shuffled.slice(0, 10));
    setCurrentIndex(0);
    setFinished(false);
  }, [words]);

  const handleNext = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setFinished(true);
      onComplete(); // Log progress
    }
  };

  const handleRetry = () => {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    setQueue(shuffled.slice(0, 10));
    setCurrentIndex(0);
    setFinished(false);
    setShowAnswer(false);
  };

  if (words.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">단어장이 비어있습니다. 단어를 먼저 추가해주세요!</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-6">
          <Trophy size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">학습 완료!</h2>
        <p className="text-slate-600 mb-8">{queue.length}개의 단어를 복습했습니다.</p>
        <button 
          onClick={handleRetry}
          className="flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-full font-medium hover:bg-rose-700 transition-colors"
        >
          <RefreshCw size={20} />
          다시 하기
        </button>
      </div>
    );
  }

  const currentWord = queue[currentIndex];
  if (!currentWord) return null;

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="mb-6 flex justify-between items-center text-slate-500 text-sm">
        <span>퀴즈 진행 중</span>
        <span>{currentIndex + 1} / {queue.length}</span>
      </div>

      <div className="mb-8">
        <WordCard 
          word={currentWord} 
          onCharClick={onCharClick} 
          minimal={false}
          showMeaning={showAnswer}
        />
      </div>

      <div className="flex gap-4">
        {!showAnswer ? (
          <button 
            onClick={() => setShowAnswer(true)}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
          >
            정답 확인
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="w-full bg-rose-600 text-white py-4 rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2 active:scale-95"
          >
            다음 단어 <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizMode;
