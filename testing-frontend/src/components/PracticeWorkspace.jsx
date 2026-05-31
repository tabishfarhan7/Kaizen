import { useEffect, useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';

const difficultyStyles = {
  easy: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  hard: 'bg-rose-50 text-rose-700 ring-rose-200',
};

function DifficultyBadge({ difficulty }) {
  const normalized = String(difficulty || 'Medium').toLowerCase();

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${
        difficultyStyles[normalized] || difficultyStyles.medium
      }`}
    >
      {difficulty || 'Medium'}
    </span>
  );
}

function normalizeAnswer(value) {
  return String(value || '').trim().toLowerCase();
}

function getOptionState(option, selectedOption, correctAnswer) {
  if (!selectedOption) return 'idle';

  const isSelected = normalizeAnswer(option) === normalizeAnswer(selectedOption);
  const isCorrect = normalizeAnswer(option) === normalizeAnswer(correctAnswer);

  if (isCorrect) return 'correct';
  if (isSelected) return 'wrong';
  return 'muted';
}

function MCQAssessment({ mcqs }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [answeredIds, setAnsweredIds] = useState(new Set());

  const currentQuestion = mcqs[currentIndex];
  const questionKey = currentQuestion?.id || `${currentIndex}-${currentQuestion?.questionText || ''}`;

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption('');
    setScore(0);
    setAnsweredIds(new Set());
  }, [mcqs]);

  if (!mcqs.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <h3 className="text-lg font-bold text-gray-950">No MCQs returned yet</h3>
        <p className="mt-2 text-sm text-gray-600">Select a company with MCQ data to begin the assessment.</p>
      </div>
    );
  }

  const handleSelect = (option) => {
    if (selectedOption) return;

    setSelectedOption(option);

    if (normalizeAnswer(option) === normalizeAnswer(currentQuestion.correctAnswer) && !answeredIds.has(questionKey)) {
      setScore((current) => current + 1);
    }

    setAnsweredIds((current) => new Set(current).add(questionKey));
  };

  const goNext = () => {
    setSelectedOption('');
    setCurrentIndex((current) => Math.min(current + 1, mcqs.length - 1));
  };

  const isLastQuestion = currentIndex === mcqs.length - 1;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            Question {currentIndex + 1} of {mcqs.length}
          </p>
          <h3 className="mt-1 text-xl font-bold text-gray-950">MCQ Assessment</h3>
        </div>
        <div className="flex items-center gap-3">
          <DifficultyBadge difficulty={currentQuestion.difficulty} />
          <span className="rounded-full bg-gray-950 px-3 py-1.5 text-sm font-bold text-white">
            Score: {score}/{mcqs.length}
          </span>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <p className="text-lg font-semibold leading-7 text-gray-950">{currentQuestion.questionText}</p>

        <div className="grid gap-3">
          {(currentQuestion.options || []).map((option) => {
            const optionState = getOptionState(option, selectedOption, currentQuestion.correctAnswer);
            const stateClass =
              optionState === 'correct'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-100'
                : optionState === 'wrong'
                  ? 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-100'
                  : optionState === 'muted'
                    ? 'border-gray-200 bg-gray-50 text-gray-500'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-teal-500 hover:bg-teal-50';

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                disabled={Boolean(selectedOption)}
                className={`rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${stateClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selectedOption ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-bold text-gray-950">Explanation</p>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              {currentQuestion.explanation || 'No explanation was provided for this question.'}
            </p>
          </div>
        ) : null}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={goNext}
            disabled={!selectedOption || isLastQuestion}
            className="rounded-lg bg-gray-950 px-4 py-2 text-sm font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isLastQuestion ? 'Assessment Complete' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CodingChallenges({ codingChallenges }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editorValue, setEditorValue] = useState('');

  const selectedChallenge = codingChallenges[selectedIndex];

  useEffect(() => {
    setSelectedIndex(0);
  }, [codingChallenges]);

  useEffect(() => {
    setEditorValue(selectedChallenge?.starterCode || '// Start coding here\n');
  }, [selectedChallenge]);

  if (!codingChallenges.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <h3 className="text-lg font-bold text-gray-950">No coding challenges returned yet</h3>
        <p className="mt-2 text-sm text-gray-600">Select a company with challenge data to open the editor workspace.</p>
      </div>
    );
  }

  const runCode = () => {
    console.log('Running code for challenge:', selectedChallenge.title, editorValue);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 p-3">
        <select
          value={selectedIndex}
          onChange={(event) => setSelectedIndex(Number(event.target.value))}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 md:max-w-md"
        >
          {codingChallenges.map((challenge, index) => (
            <option key={challenge.id || challenge.title || index} value={index}>
              {challenge.title || `Challenge ${index + 1}`}
            </option>
          ))}
        </select>
      </div>

      <div className="grid min-h-[640px] lg:grid-cols-[minmax(320px,0.9fr)_minmax(420px,1.1fr)]">
        <div className="space-y-5 border-b border-gray-200 p-5 lg:border-b-0 lg:border-r">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <DifficultyBadge difficulty={selectedChallenge.difficulty} />
              {(selectedChallenge.tags || []).map((tag) => (
                <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-2xl font-bold text-gray-950">{selectedChallenge.title}</h3>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-500">Problem</h4>
            <div className="whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-7 text-gray-800">
              {selectedChallenge.description || 'No challenge description provided.'}
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-500">Test Cases</h4>
            <div className="space-y-3">
              {(selectedChallenge.testCases || []).length ? (
                selectedChallenge.testCases.map((testCase, index) => (
                  <div key={`${testCase.input}-${index}`} className="rounded-lg border border-gray-200 bg-white p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Case {index + 1}</p>
                    <div className="grid gap-3 text-sm">
                      <div>
                        <p className="mb-1 font-semibold text-gray-700">Input</p>
                        <pre className="overflow-auto rounded-md bg-gray-950 p-3 text-xs text-gray-100">
                          {String(testCase.input ?? '')}
                        </pre>
                      </div>
                      <div>
                        <p className="mb-1 font-semibold text-gray-700">Expected</p>
                        <pre className="overflow-auto rounded-md bg-gray-950 p-3 text-xs text-gray-100">
                          {String(testCase.expected ?? '')}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                  No test cases provided.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col bg-gray-950">
          <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
            <span className="text-sm font-bold text-gray-100">solution.js</span>
            <span className="rounded-full bg-gray-800 px-2.5 py-1 text-xs font-semibold text-gray-300">JavaScript</span>
          </div>

          <div className="h-[500px]">
            <Editor
              height="500px"
              defaultLanguage="javascript"
              language="javascript"
              theme="vs-dark"
              value={editorValue}
              onChange={(value) => setEditorValue(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          </div>

          <div className="flex justify-end border-t border-gray-800 bg-gray-900 p-4">
            <button
              type="button"
              onClick={runCode}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700"
            >
              Run Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PracticeWorkspace({ mcqs = [], codingChallenges = [] }) {
  const [activeTab, setActiveTab] = useState('mcq');

  const tabs = useMemo(
    () => [
      { id: 'mcq', label: 'MCQ Assessment', count: mcqs.length },
      { id: 'coding', label: 'Coding Challenges', count: codingChallenges.length },
    ],
    [mcqs.length, codingChallenges.length]
  );

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 border-b border-gray-200 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-950">Company-Specific Workspace</h2>
          <p className="text-sm text-gray-600">Practice questions and coding drills for the selected company.</p>
        </div>

        <div className="grid grid-cols-2 rounded-lg bg-gray-100 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-md px-4 py-2 text-sm font-bold transition ${
                activeTab === tab.id ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-600 hover:text-gray-950'
              }`}
            >
              {tab.label} <span className="ml-1 text-xs text-gray-500">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'mcq' ? (
        <MCQAssessment mcqs={mcqs} />
      ) : (
        <CodingChallenges codingChallenges={codingChallenges} />
      )}
    </section>
  );
}
