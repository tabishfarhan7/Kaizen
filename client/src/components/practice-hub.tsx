import React, { useState, useEffect, useRef } from 'react';
import { Play, Send, ChevronRight, ChevronDown, List as ListIcon, FileText, CheckCircle2, XCircle, Clock, Settings, Maximize2, TerminalSquare, RotateCcw, Moon, Sun, Code2, BookOpen, ArrowLeft } from 'lucide-react';
import Editor from '@monaco-editor/react';

// --- CODING IDE DATA ---
type Difficulty = 'Easy' | 'Medium' | 'Hard';

type Question = {
  id: number;
  title: string;
  difficulty: Difficulty;
  acceptance: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
};

const QUESTION_TITLES = [
  "Two Sum", "Add Two Numbers", "Longest Substring Without Repeating Characters", 
  "Median of Two Sorted Arrays", "Longest Palindromic Substring", "Zigzag Conversion", 
  "Reverse Integer", "String to Integer (atoi)", "Palindrome Number", "Regular Expression Matching",
  "Container With Most Water", "Integer to Roman", "Roman to Integer", "Longest Common Prefix", 
  "3Sum", "3Sum Closest", "Letter Combinations of a Phone Number", "4Sum", 
  "Remove Nth Node From End of List", "Valid Parentheses", "Merge Two Sorted Lists"
];

const QUESTIONS: Question[] = QUESTION_TITLES.map((title, i) => ({
  id: i + 1,
  title,
  difficulty: i % 5 === 0 ? 'Hard' : i % 2 === 0 ? 'Easy' : 'Medium',
  acceptance: `${Math.floor(Math.random() * 40 + 30)}.${Math.floor(Math.random() * 9)}%`,
  description: `<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p><br/>
  <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p><br/>
  <p>You can return the answer in any order.</p>`,
  examples: [
    { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
    { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
  ]
}));

type Language = 'cpp' | 'java' | 'python' | 'javascript';

const BOILERPLATES: Record<Language, string> = {
  'cpp': 'class Solution {\npublic:\n    vector<int> solve(vector<int>& nums) {\n        // Write your C++ code here\n        return nums;\n    }\n};',
  'java': 'class Solution {\n    public int[] solve(int[] nums) {\n        // Write your Java code here\n        return nums;\n    }\n}',
  'python': 'class Solution:\n    def solve(self, nums: List[int]) -> List[int]:\n        # Write your Python code here\n        return nums',
  'javascript': '/**\n * @param {number[]} nums\n * @return {number[]}\n */\nvar solve = function(nums) {\n    // Write your JavaScript code here\n    return nums;\n};'
};

// --- MCQ ENGINE DATA ---
const MCQ_TOPICS = ['Operating Systems', 'Computer Networks', 'DBMS', 'OOP', 'DSA'];

type MCQ = {
  id: number;
  topic: string;
  question: string;
  options: string[];
  answer: number; // index
  explanation: string;
};

const MCQS: MCQ[] = [
  { id: 1, topic: 'Operating Systems', question: 'Which of the following is not an operating system?', options: ['Windows', 'Linux', 'Oracle', 'DOS'], answer: 2, explanation: 'Oracle is a Relational Database Management System (RDBMS), not an Operating System.' },
  { id: 2, topic: 'Operating Systems', question: 'What is the maximum length of the filename in DOS?', options: ['4', '5', '8', '12'], answer: 2, explanation: 'The maximum length is 8 characters, with a 3 character extension (8.3 filename).' },
  { id: 3, topic: 'Computer Networks', question: 'Which layer of the OSI model is responsible for routing?', options: ['Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer'], answer: 2, explanation: 'The Network layer is responsible for packet forwarding including routing through intermediate routers.' },
  { id: 4, topic: 'Computer Networks', question: 'What does TCP stand for?', options: ['Transmission Control Protocol', 'Transfer Control Protocol', 'Transmission Communication Protocol', 'Transfer Communication Protocol'], answer: 0, explanation: 'TCP stands for Transmission Control Protocol, a core protocol of the Internet Protocol Suite.' },
  { id: 5, topic: 'DBMS', question: 'Which of the following is not a type of database?', options: ['Hierarchical', 'Network', 'Distributed', 'Decentralized'], answer: 3, explanation: 'Decentralized is not a standard classical database model category like Hierarchical or Network.' },
  { id: 6, topic: 'DBMS', question: 'What does SQL stand for?', options: ['Structured Query Language', 'Strong Question Language', 'Structured Question Language', 'Strong Query Language'], answer: 0, explanation: 'SQL stands for Structured Query Language, used for managing relational databases.' },
  { id: 7, topic: 'OOP', question: 'Which of the following is not an OOP concept?', options: ['Encapsulation', 'Polymorphism', 'Exception', 'Abstraction'], answer: 2, explanation: 'Exception is a mechanism for error handling, not a core principle of Object-Oriented Programming.' },
  { id: 8, topic: 'OOP', question: 'What is it called when a class has multiple methods with the same name but different parameters?', options: ['Method Overriding', 'Method Overloading', 'Method Hiding', 'Method Shadowing'], answer: 1, explanation: 'Method Overloading allows multiple methods in the same class to share the same name if their parameters differ.' },
  { id: 9, topic: 'DSA', question: 'What is the time complexity of binary search?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], answer: 2, explanation: 'Binary search halves the search space at each step, resulting in O(log n) time complexity.' },
  { id: 10, topic: 'DSA', question: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Tree', 'Graph'], answer: 1, explanation: 'Stack uses Last-In-First-Out (LIFO) order.' }
];

// --- COMPONENTS ---

const CodingPracticeIDE: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeQuestionId, setActiveQuestionId] = useState(1);
  const [activeTab, setActiveTab] = useState<'Description' | 'ProblemList'>('Description');
  const [language, setLanguage] = useState<Language>('python');
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [runState, setRunState] = useState<'Idle' | 'Running' | 'Success' | 'Error'>('Idle');
  const [runOutput, setRunOutput] = useState<{ stdout: string, stderr: string, error: string | null } | null>(null);
  const [editorTheme, setEditorTheme] = useState<'light' | 'vs-dark'>('vs-dark');
  const [leftPaneWidth, setLeftPaneWidth] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let newPercentage = ((e.clientX - rect.left) / rect.width) * 100;
      if (newPercentage < 20) newPercentage = 20;
      if (newPercentage > 80) newPercentage = 80;
      setLeftPaneWidth(newPercentage);
    };
    
    const handleMouseUp = () => setIsDragging(false);
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const question = QUESTIONS.find(q => q.id === activeQuestionId)!;
  const currentCodeKey = `${activeQuestionId}-${language}`;
  const currentCode = codeMap[currentCodeKey] ?? BOILERPLATES[language];

  const handleCodeChange = (value: string | undefined) => {
    setCodeMap(prev => ({ ...prev, [currentCodeKey]: value || '' }));
  };

  const resetCode = () => {
    setCodeMap(prev => ({ ...prev, [currentCodeKey]: BOILERPLATES[language] }));
  };

  const handleRun = async () => {
    setConsoleOpen(true);
    setRunState('Running');
    setRunOutput(null);

    let backendLanguage = '';
    if (language === 'cpp') backendLanguage = 'C++';
    if (language === 'java') backendLanguage = 'Java';
    if (language === 'python') backendLanguage = 'Python';
    if (language === 'javascript') backendLanguage = 'JavaScript';

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: currentCode, language: backendLanguage })
      });

      const data = await response.json();
      setRunOutput(data);

      if (data.error || data.stderr) setRunState('Error');
      else setRunState('Success');
    } catch (err: any) {
      setRunOutput({ stdout: '', stderr: '', error: err.message || 'Execution failed' });
      setRunState('Error');
    }
  };

  const getDifficultyColor = (diff: Difficulty) => {
    if (diff === 'Easy') return 'text-emerald-500 bg-emerald-50';
    if (diff === 'Medium') return 'text-amber-500 bg-amber-50';
    return 'text-rose-500 bg-rose-50';
  };

  return (
    <div ref={containerRef} className="flex h-[calc(100vh-64px)] w-full bg-[#FAFAFA] overflow-hidden p-2 gap-2 select-none">
      
      {/* LEFT PANE */}
      <div className="flex flex-col bg-white border border-black/[0.04] rounded-2xl shadow-sm overflow-hidden select-text" style={{ width: `${leftPaneWidth}%` }}>
        <div className="h-12 flex items-center px-4 border-b border-black/[0.04] bg-[#FAFAFA] gap-4 select-none relative">
          <button onClick={onBack} className="flex items-center justify-center p-1.5 hover:bg-zinc-200 rounded-md transition-colors mr-2 text-zinc-500">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab('Description')}
            className={`flex items-center gap-2 text-sm font-semibold h-full border-b-2 px-2 transition-colors ${activeTab === 'Description' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
          >
            <FileText className="w-4 h-4" /> Description
          </button>
          <button 
            onClick={() => setActiveTab('ProblemList')}
            className={`flex items-center gap-2 text-sm font-semibold h-full border-b-2 px-2 transition-colors ${activeTab === 'ProblemList' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
          >
            <ListIcon className="w-4 h-4" /> Problem List
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'Description' ? (
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-zinc-900">{question.id}. {question.title}</h1>
              </div>
              <div className="flex items-center gap-3 mb-8">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>{question.difficulty}</span>
                <span className="text-xs font-medium text-zinc-500">Acceptance: {question.acceptance}</span>
              </div>
              <div className="text-zinc-700 leading-relaxed mb-8 prose prose-zinc" dangerouslySetInnerHTML={{ __html: question.description }} />
              <div className="space-y-6">
                {question.examples.map((ex, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="font-semibold text-zinc-900">Example {idx + 1}:</p>
                    <div className="bg-[#F4F4F5] p-4 rounded-xl border border-black/[0.04] font-mono text-sm space-y-1">
                      <p><span className="text-zinc-500 font-semibold">Input:</span> <span className="text-zinc-800">{ex.input}</span></p>
                      <p><span className="text-zinc-500 font-semibold">Output:</span> <span className="text-zinc-800">{ex.output}</span></p>
                      {ex.explanation && <p><span className="text-zinc-500 font-semibold">Explanation:</span> <span className="text-zinc-800">{ex.explanation}</span></p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1 cursor-default">
              {QUESTIONS.map(q => (
                <button
                  key={q.id}
                  onClick={() => { setActiveQuestionId(q.id); setActiveTab('Description'); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${q.id === activeQuestionId ? 'bg-zinc-100 border border-black/[0.04] shadow-sm' : 'hover:bg-zinc-50 border border-transparent'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400 font-medium w-6 text-left">{q.id}.</span>
                    <span className={`font-semibold ${q.id === activeQuestionId ? 'text-zinc-900' : 'text-zinc-700'}`}>{q.title}</span>
                  </div>
                  <span className={`text-xs font-bold ${q.difficulty === 'Easy' ? 'text-emerald-500' : q.difficulty === 'Medium' ? 'text-amber-500' : 'text-rose-500'}`}>{q.difficulty}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DRAG HANDLE */}
      <div 
        className="w-2 hover:w-2 hover:bg-blue-400 flex flex-col justify-center items-center cursor-col-resize transition-colors rounded-full -mx-1 z-10"
        onMouseDown={() => setIsDragging(true)}
      >
        <div className={`w-1 h-8 rounded-full ${isDragging ? 'bg-blue-500' : 'bg-zinc-300'}`} />
      </div>

      {/* RIGHT PANE */}
      <div className="flex flex-col gap-2" style={{ width: `calc(${100 - leftPaneWidth}% - 8px)` }}>
        <div className={`flex-1 flex flex-col border border-black/[0.04] rounded-2xl shadow-sm overflow-hidden relative ${editorTheme === 'vs-dark' ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
          <div className={`h-12 flex items-center justify-between px-4 border-b ${editorTheme === 'vs-dark' ? 'border-white/10 bg-[#252526] text-zinc-300' : 'border-black/[0.04] bg-[#FAFAFA] text-zinc-700'} select-none`}>
            <div className="flex items-center gap-2">
              <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="bg-transparent text-sm font-semibold outline-none cursor-pointer">
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditorTheme(editorTheme === 'light' ? 'vs-dark' : 'light')} className="p-1.5 rounded-md hover:bg-zinc-500/20 transition-colors" title="Toggle Theme">
                {editorTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
              <button onClick={resetCode} className="p-1.5 rounded-md hover:bg-zinc-500/20 transition-colors" title="Reset Code">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-md hover:bg-zinc-500/20 transition-colors" title="Settings">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 py-4 relative">
            <Editor
              height="100%" language={language} theme={editorTheme} value={currentCode} onChange={handleCodeChange}
              options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: "Menlo, Monaco, 'Courier New', monospace", lineHeight: 24, padding: { top: 16 }, scrollBeyondLastLine: false, roundedSelection: false, scrollbar: { vertical: 'visible', horizontal: 'visible' } }}
            />
          </div>
        </div>

        {/* CONSOLE */}
        <div className={`flex flex-col bg-white border border-black/[0.04] rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ease-in-out ${consoleOpen ? 'h-64' : 'h-14'} select-text`}>
          <div className="h-14 flex items-center justify-between px-4 bg-[#FAFAFA] border-b border-black/[0.04] flex-shrink-0 select-none">
            <button onClick={() => setConsoleOpen(!consoleOpen)} className="flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:text-zinc-900 transition-colors">
              <TerminalSquare className="w-4 h-4" /> Console <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${consoleOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className="flex items-center gap-3">
              <button onClick={handleRun} className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-1.5 rounded-full text-sm font-bold transition-all"><Play className="w-3.5 h-3.5" /> Run</button>
              <button onClick={handleRun} className="flex items-center gap-2 bg-zinc-900 hover:bg-black text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all"><Send className="w-3.5 h-3.5" /> Submit</button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-white font-mono text-sm">
            {runState === 'Idle' && <div className="h-full flex items-center justify-center text-zinc-400 select-none">Run your code to see output here.</div>}
            {runState === 'Running' && <div className="h-full flex items-center justify-center gap-3 text-zinc-600 font-semibold select-none"><Clock className="w-5 h-5 animate-spin" /> Judging...</div>}
            {runState === 'Success' && (
              <div className="space-y-4">
                <h3 className="text-emerald-500 font-bold text-lg flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Accepted</h3>
                <div className="flex items-center gap-4 text-zinc-500 select-none">
                  <span className="bg-zinc-100 px-3 py-1 rounded-lg">Runtime: {Math.floor(Math.random() * 40 + 20)} ms</span>
                  <span className="bg-zinc-100 px-3 py-1 rounded-lg">Memory: {(Math.random() * 10 + 10).toFixed(1)} MB</span>
                </div>
                <div className="space-y-2">
                  <p className="text-zinc-500 font-semibold">Standard Output:</p>
                  <div className="bg-zinc-50 p-3 rounded-lg border border-black/[0.04] whitespace-pre-wrap">{runOutput?.stdout || 'No output'}</div>
                  <p className="text-zinc-500 font-semibold mt-4">Test Case Comparison:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-rose-50/50 p-3 rounded-lg border border-rose-100"><span className="text-xs font-bold text-rose-500 uppercase block mb-1">Your Output</span><div className="text-rose-900">[]</div></div>
                    <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100"><span className="text-xs font-bold text-emerald-600 uppercase block mb-1">Expected Output</span><div className="text-emerald-900">[0, 1]</div></div>
                  </div>
                </div>
              </div>
            )}
            {runState === 'Error' && (
              <div className="space-y-4">
                <h3 className="text-rose-500 font-bold text-lg flex items-center gap-2"><XCircle className="w-5 h-5" /> Error / Crash</h3>
                <div className="space-y-2">
                  {runOutput?.stderr && <><p className="text-zinc-500 font-semibold">Standard Error:</p><div className="bg-rose-50/50 p-3 rounded-lg border border-rose-100 text-rose-900 whitespace-pre-wrap">{runOutput.stderr}</div></>}
                  {runOutput?.stdout && <><p className="text-zinc-500 font-semibold">Standard Output:</p><div className="bg-zinc-50 p-3 rounded-lg border border-black/[0.04] whitespace-pre-wrap">{runOutput.stdout}</div></>}
                  {runOutput?.error && !runOutput?.stderr && <><p className="text-zinc-500 font-semibold">Execution Error:</p><div className="bg-rose-50/50 p-3 rounded-lg border border-rose-100 text-rose-900 whitespace-pre-wrap">{runOutput.error}</div></>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const MCQPracticeEngine: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTopic, setActiveTopic] = useState<string>(MCQ_TOPICS[0]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  
  const topicQs = MCQS.filter(q => q.topic === activeTopic);

  const handleOptionSelect = (qId: number, optionIndex: number) => {
    if (answers[qId] !== undefined) return; // Prevent changing answer
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-[#FAFAFA] overflow-hidden p-2 gap-2">
      
      {/* LEFT PANE (Topics) */}
      <div className="w-64 flex flex-col bg-white border border-black/[0.04] rounded-2xl shadow-sm overflow-hidden flex-shrink-0">
        <div className="h-14 flex items-center px-4 border-b border-black/[0.04] bg-[#FAFAFA] gap-3 select-none">
          <button onClick={onBack} className="p-1.5 hover:bg-zinc-200 rounded-md transition-colors text-zinc-500">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="font-bold text-zinc-800">CS Topics</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {MCQ_TOPICS.map(topic => {
            const isActive = activeTopic === topic;
            return (
              <button
                key={topic}
                onClick={() => setActiveTopic(topic)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'}`}
              >
                {topic}
              </button>
            )
          })}
        </div>
      </div>

      {/* RIGHT PANE (Quiz) */}
      <div className="flex-1 flex flex-col bg-white border border-black/[0.04] rounded-2xl shadow-sm overflow-hidden relative">
        <div className="h-14 flex items-center px-6 border-b border-black/[0.04] bg-[#FAFAFA] shadow-sm z-10">
          <h1 className="text-lg font-bold text-zinc-900">{activeTopic} Questions</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-8 bg-[#FAFAFA]">
          <div className="max-w-3xl mx-auto space-y-8 pb-12">
            {topicQs.map((q, index) => {
              const selectedAnswer = answers[q.id];
              const isAnswered = selectedAnswer !== undefined;

              return (
                <div key={q.id} className="bg-white p-6 rounded-2xl border border-black/[0.06] shadow-sm">
                  <div className="flex gap-4 mb-6">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-zinc-100 text-zinc-600 font-bold rounded-full text-sm">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-bold text-zinc-900 mt-1 leading-snug">{q.question}</h3>
                  </div>
                  
                  <div className="space-y-3 pl-12">
                    {q.options.map((opt, optIdx) => {
                      let btnClass = "w-full text-left px-5 py-3 rounded-xl border font-medium text-[15px] transition-all ";
                      
                      if (!isAnswered) {
                        btnClass += "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50";
                      } else {
                        if (optIdx === q.answer) {
                          // Correct option
                          btnClass += "bg-emerald-50 border-emerald-200 text-emerald-800 ring-1 ring-emerald-200";
                        } else if (optIdx === selectedAnswer) {
                          // User selected wrong option
                          btnClass += "bg-rose-50 border-rose-200 text-rose-800";
                        } else {
                          // Other wrong options
                          btnClass += "bg-white border-zinc-100 text-zinc-400 opacity-50 cursor-not-allowed";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => handleOptionSelect(q.id, optIdx)}
                          className={btnClass}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div className={`mt-6 ml-12 p-5 rounded-xl border ${selectedAnswer === q.answer ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                      <h4 className={`font-bold flex items-center gap-2 ${selectedAnswer === q.answer ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {selectedAnswer === q.answer ? <CheckCircle2 className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                        {selectedAnswer === q.answer ? "Correct!" : "Incorrect"}
                      </h4>
                      <p className="mt-2 text-zinc-700 text-sm leading-relaxed">
                        <span className="font-semibold text-zinc-900">Explanation:</span> {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


export const PracticeHub: React.FC = () => {
  const [mode, setMode] = useState<'Selection' | 'Coding' | 'MCQ'>('Selection');

  if (mode === 'Coding') return <CodingPracticeIDE onBack={() => setMode('Selection')} />;
  if (mode === 'MCQ') return <MCQPracticeEngine onBack={() => setMode('Selection')} />;

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-[#FAFAFA] p-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-4 tracking-tight">Choose Your Path</h1>
          <p className="text-lg text-zinc-500">Sharpen your logic with algorithms, or master the core theoretical concepts.</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          
          <button 
            onClick={() => setMode('Coding')}
            className="group relative flex flex-col bg-white border border-black/[0.04] p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden text-left hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Code2 className="w-48 h-48 -mr-12 -mt-12" />
            </div>
            
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-zinc-900 mb-3">Coding Practice</h2>
            <p className="text-zinc-500 leading-relaxed mb-8 max-w-[90%]">
              Dive into our realistic IDE environment. Solve 50+ handpicked algorithmic challenges spanning Easy to Hard difficulty with a live executing compiler.
            </p>
            
            <div className="mt-auto flex items-center gap-2 text-sm font-bold text-zinc-900">
              Start Coding <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button 
            onClick={() => setMode('MCQ')}
            className="group relative flex flex-col bg-white border border-black/[0.04] p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden text-left hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <BookOpen className="w-48 h-48 -mr-12 -mt-12" />
            </div>
            
            <div className="w-16 h-16 bg-white border-2 border-zinc-200 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <BookOpen className="w-8 h-8 text-zinc-900" />
            </div>
            
            <h2 className="text-2xl font-bold text-zinc-900 mb-3">MCQ Practice</h2>
            <p className="text-zinc-500 leading-relaxed mb-8 max-w-[90%]">
              Test your theoretical foundations. Tackle hundreds of multiple-choice questions across OS, Networks, DBMS, Object-Oriented Programming, and DSA.
            </p>
            
            <div className="mt-auto flex items-center gap-2 text-sm font-bold text-zinc-900">
              Start Quiz <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};
