'use client';

import { useState } from 'react';

const sampleQuestions = [
  {
    question: 'What is photosynthesis?',
    answer: 'Process by which plants make food using sunlight.',
  },
  {
    question: 'Which gas do plants absorb?',
    answer: 'Carbon dioxide.',
  },
  {
    question: 'What is chlorophyll?',
    answer: 'Green pigment found in plants.',
  },
];

const GEMINI_API_KEY = 'AIzaSyDf12aD3DxM6we20bSUmViEjaiM5SquuTg';

export default function AIQuestionGenerator() {
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [questionType, setQuestionType] = useState('MCQ Questions');

  const generateQuestions = async () => {
    if (!inputText) return;

    setLoading(true);

    try {
      const prompt = `Generate ${questionType} from this content:\n\n${inputText}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      const questions = aiText
        .split('\n')
        .filter((item) => item.trim() !== '')
        .map((item) => ({
          question: item,
          answer: 'AI Generated Answer',
        }));

      setGeneratedQuestions(questions);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto py-12">
        <h1 className="text-5xl font-black mb-4">
          AI Question Generator
        </h1>

        <p className="text-slate-400 mb-8">
          Paste notes or study material and generate AI questions instantly.
        </p>

        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={8}
            placeholder="Paste your study material here..."
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 outline-none resize-none mb-5"
          />

          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none mb-5"
          >
            <option>MCQ Questions</option>
            <option>Short Answer Questions</option>
            <option>Long Questions</option>
            <option>True / False</option>
          </select>

          <button
            onClick={generateQuestions}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-2xl text-lg"
          >
            {loading ? 'Generating...' : 'Generate Questions'}
          </button>

          <div className="mt-8 space-y-4">
            {(generatedQuestions.length > 0
              ? generatedQuestions
              : sampleQuestions
            ).map((item, index) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-4"
              >
                <p className="font-semibold mb-2">
                  Q{index + 1}. {item.question}
                </p>

                <p className="text-slate-400 text-sm">
                  Answer: {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
