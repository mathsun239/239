import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { CharDetail } from '../types';
import { analyzeCharacter } from '../services/geminiService';

interface CharModalProps {
  char: string | null;
  onClose: () => void;
}

const CharModal: React.FC<CharModalProps> = ({ char, onClose }) => {
  const [data, setData] = useState<CharDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (char) {
      setLoading(true);
      setData(null);
      analyzeCharacter(char)
        .then(setData)
        .catch(() => setData(null)) // Handle error gracefully
        .finally(() => setLoading(false));
    }
  }, [char]);

  if (!char) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-rose-50 p-4 flex justify-between items-center border-b border-rose-100">
          <h3 className="font-bold text-rose-800">한자 상세 정보</h3>
          <button onClick={onClose} className="text-rose-400 hover:text-rose-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="animate-spin text-rose-500 mb-2" size={32} />
              <p className="text-slate-500 text-sm">AI가 한자를 분석 중입니다...</p>
            </div>
          ) : data ? (
            <div>
              <div className="flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-6xl font-sc font-bold text-slate-800 mb-2 bg-slate-50 border-2 border-slate-100 rounded-xl w-24 h-24 flex items-center justify-center mx-auto">
                    {data.char}
                  </div>
                  <div className="text-rose-600 font-bold text-xl">{data.pinyin}</div>
                  <div className="text-slate-600">{data.meaning}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">관련 단어</h4>
                <div className="space-y-2">
                  {data.relatedWords.map((rw, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="font-sc font-bold text-lg text-slate-700">{rw.word}</div>
                      <div className="text-right">
                        <div className="text-sm text-rose-600 font-medium">{rw.pinyin}</div>
                        <div className="text-xs text-slate-500">{rw.meaning}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
             <div className="text-center py-8 text-slate-500">정보를 불러오지 못했습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharModal;
