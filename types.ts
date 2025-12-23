export interface WordEntry {
  id: string;
  simplified: string;
  traditional?: string;
  pinyin: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
  dateAdded: number; // timestamp
}

export interface CharDetail {
  char: string;
  pinyin: string;
  meaning: string;
  relatedWords: {
    word: string;
    pinyin: string;
    meaning: string;
  }[];
}

export interface StudySession {
  date: string; // YYYY-MM-DD
  count: number;
}

export type ViewState = 'search' | 'list' | 'quiz' | 'stats';
