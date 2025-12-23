import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { WordEntry, CharDetail } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const modelName = 'gemini-3-flash-preview';

export const searchChineseWords = async (query: string): Promise<Omit<WordEntry, 'id' | 'dateAdded'>[]> => {
  if (!query) return [];

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Search for Chinese words matching the query: "${query}". 
      The query might be in Korean (meaning) or Pinyin. 
      Provide 3 to 5 most relevant results.
      For each result, provide the Simplified Chinese, Pinyin, Korean Meaning, and one simple example sentence with its Korean translation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              simplified: { type: Type.STRING, description: "Simplified Chinese characters" },
              pinyin: { type: Type.STRING, description: "Pinyin with tone marks" },
              meaning: { type: Type.STRING, description: "Meaning in Korean" },
              example: { type: Type.STRING, description: "A simple example sentence in Chinese" },
              exampleMeaning: { type: Type.STRING, description: "Korean translation of the example sentence" }
            },
            required: ["simplified", "pinyin", "meaning", "example", "exampleMeaning"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Error searching words:", error);
    throw error;
  }
};

export const analyzeCharacter = async (char: string): Promise<CharDetail> => {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Analyze the Chinese character: "${char}".
      Provide its Pinyin, main Korean meaning, and 3 common related words containing this character.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            char: { type: Type.STRING },
            pinyin: { type: Type.STRING },
            meaning: { type: Type.STRING, description: "Main meaning in Korean" },
            relatedWords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  pinyin: { type: Type.STRING },
                  meaning: { type: Type.STRING }
                },
                required: ["word", "pinyin", "meaning"]
              }
            }
          },
          required: ["char", "pinyin", "meaning", "relatedWords"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing character:", error);
    throw error;
  }
};
