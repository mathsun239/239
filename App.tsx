import React, { useState, useEffect } from 'react';
import { Search, Book, GraduationCap, BarChart2, Loader2, Sparkles, PlusCircle } from 'lucide-react';
import { WordEntry, StudySession, ViewState } from './types';
import { searchChineseWords } from './services/geminiService';
import WordCard from './components/WordCard';
import CharModal from './components/CharModal';
import QuizMode from './components/QuizMode';
import Stats from './components/Stats';

function App() {
  // State
  const [view, setView] = useState<ViewState>('search');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Omit<WordEntry, 'id' | 'dateAdded'>[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [savedWords, setSavedWords] = useState<WordEntry[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const loadedWords = localStorage.getItem('hanyu_words');
    const loadedSessions = localStorage.getItem('hanyu_sessions');
    if (loadedWords) setSavedWords(JSON.parse(loadedWords));
    if (loadedSessions) setStudySessions(JSON.parse(loadedSessions));
  }, []);

  // Save to local storage whenever changed
  useEffect(() => {
    localStorage.setItem('hanyu_words', JSON.stringify(savedWords));
  }, [savedWords]);

  useEffect(() => {
    localStorage.setItem('hanyu_sessions', JSON.stringify(studySessions));
  }, [studySessions]);

  // Handlers
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    try {
      const results = await searchChineseWords(query);
      setSearchResults(results);
    } catch (error) {
      alert("검색 중 오류가 발생했습니다.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddWord = (word: Omit<WordEntry, 'id' | 'dateAdded'>) => {
    const newWord: WordEntry = {
      ...word,
      id: Date.now().toString(),
      dateAdded: Date.now()
    };
    setSavedWords(prev => [newWord, ...prev]);
  };

  const isWordAdded = (simplified: string) => {
    return savedWords.some(w => w.simplified === simplified);
  };

  const recordStudy = () => {
    const today = new Date().toISOString().split('T')[0];
    setStudySessions(prev => {
      const existing = prev.find(s => s.date === today);
      if (existing) {
        return prev.map(s => s.date === today ? { ...s, count: s.count + 1 } : s);
      } else {
        return [...prev, { date: today, count: 1 }];
      }
    });
  };

  // Render logic helpers
  const renderContent = () => {
    switch (view) {
      case 'search':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10 mt-10">
              <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
                <span className="text-rose-600">Hanyu</span> Mate <Sparkles className="text-yellow-400" />
              </h1>
              <p className="text-slate-500">당신의 AI 중국어 단어장</p>
            </div>

            <form onSubmit={handleSearch} className="mb-8 relative">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="단어, 발음(Pinyin), 또는 한국어 뜻을 입력하세요..." 
                className="w-full pl-6 pr-14 py-4 rounded-2xl border-2 border-slate-200 focus:border-rose-500 focus:outline-none shadow-sm text-lg transition-colors"
              />
              <button 
                type="submit" 
                disabled={isSearching}
                className="absolute right-3 top-3 p-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              </button>
            </form>

            <div className="space-y-4">
              {searchResults.map((word, idx) => (
                <WordCard 
                  key={idx} 
                  word={word} 
                  onAdd={() => handleAddWord(word)}
                  isAdded={isWordAdded(word.simplified)}
                  onCharClick={setSelectedChar}
                />
              ))}
              {searchResults.length === 0 && !isSearching && query && (
                 <div className="text-center text-slate-400 py-10">
                    검색 결과가 여기에 표시됩니다.
                 </div>
              )}
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Book className="text-rose-600" /> 내 단어장
              <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{savedWords.length}</span>
            </h2>
            {savedWords.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-slate-500 mb-4">아직 추가된 단어가 없습니다.</p>
                <button 
                  onClick={() => setView('search')}
                  className="text-rose-600 font-medium hover:underline flex items-center justify-center gap-1"
                >
                  <PlusCircle size={16} /> 단어 검색하러 가기
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedWords.map((word) => (
                  <WordCard 
                    key={word.id} 
                    word={word} 
                    onCharClick={setSelectedChar}
                  />
                ))}
              </div>
            )}
          </div>
        );
      case 'quiz':
        return (
          <QuizMode 
            words={savedWords} 
            onCharClick={setSelectedChar}
            onComplete={recordStudy}
          />
        );
      case 'stats':
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BarChart2 className="text-rose-600" /> 학습 기록
            </h2>
            <Stats sessions={studySessions} words={savedWords} />
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Main Content Area: Added pb-28 to ensure content isn't hidden behind the bottom nav */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8 pt-safe">
        {renderContent()}
      </main>

      {/* Navigation Bar (Mobile): Added pb-safe for iPhone Home Indicator */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 pb-safe flex justify-around items-center md:static md:hidden z-40">
        <NavButton active={view === 'search'} onClick={() => setView('search')} icon={<Search size={24} />} label="검색" />
        <NavButton active={view === 'list'} onClick={() => setView('list')} icon={<Book size={24} />} label="단어장" />
        <NavButton active={view === 'quiz'} onClick={() => setView('quiz')} icon={<GraduationCap size={24} />} label="퀴즈" />
        <NavButton active={view === 'stats'} onClick={() => setView('stats')} icon={<BarChart2 size={24} />} label="통계" />
      </nav>
      
      {/* Desktop Navigation (Header style) */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 justify-between items-center z-40">
        <div className="text-xl font-bold text-slate-800 flex items-center gap-2 cursor-pointer" onClick={() => setView('search')}>
           <span className="text-rose-600">Hanyu</span> Mate
        </div>
        <div className="flex gap-8">
            <DesktopNavLink active={view === 'search'} onClick={() => setView('search')} label="검색" />
            <DesktopNavLink active={view === 'list'} onClick={() => setView('list')} label="단어장" />
            <DesktopNavLink active={view === 'quiz'} onClick={() => setView('quiz')} label="퀴즈" />
            <DesktopNavLink active={view === 'stats'} onClick={() => setView('stats')} label="통계" />
        </div>
      </nav>
      
      {/* Spacer for Desktop Header */}
      <div className="hidden md:block h-16 w-full fixed top-0 -z-10"></div>

      {/* Character Modal */}
      <CharModal char={selectedChar} onClose={() => setSelectedChar(null)} />
    </div>
  );
}

// Sub-components for Nav
const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center gap-1 ${active ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const DesktopNavLink = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
    <button 
        onClick={onClick}
        className={`font-medium transition-colors ${active ? 'text-rose-600' : 'text-slate-500 hover:text-slate-800'}`}
    >
        {label}
    </button>
);

export default App;