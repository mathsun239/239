import React from 'react';
import { StudySession, WordEntry } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Calendar, BookOpen, Flame } from 'lucide-react';

interface StatsProps {
  sessions: StudySession[];
  words: WordEntry[];
}

const Stats: React.FC<StatsProps> = ({ sessions, words }) => {
  // Aggregate sessions by date (last 7 days)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const chartData = getLast7Days().map(date => {
    const session = sessions.find(s => s.date === date);
    return {
      date: date.slice(5), // MM-DD
      count: session ? session.count : 0
    };
  });

  const totalWords = words.length;
  const uniqueStudyDays = new Set(sessions.map(s => s.date)).size;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">총 저장 단어</p>
            <p className="text-2xl font-bold text-slate-800">{totalWords}개</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">총 학습일</p>
            <p className="text-2xl font-bold text-slate-800">{uniqueStudyDays}일</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">최근 학습</p>
            <p className="text-2xl font-bold text-slate-800">
              {sessions.length > 0 ? sessions[sessions.length - 1].date.slice(5) : '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">최근 7일 학습량</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: '#f1f5f9'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#e11d48' : '#e2e8f0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Stats;
