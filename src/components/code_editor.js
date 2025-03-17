'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { toast } from 'react-toastify';
import axios from 'axios';

const languageOptions = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'csharp', name: 'C#' },
  { id: 'cpp', name: 'C++' },
];

const defaultCode = {
  javascript: '// Write your JavaScript code here\n\nfunction solution() {\n  // Your code here\n  \n  return result;\n}\n',
  python: '# Write your Python code here\n\ndef solution():\n    # Your code here\n    \n    return result\n',
  java: '// Write your Java code here\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}',
  csharp: '// Write your C# code here\n\nusing System;\n\npublic class Solution {\n    public static void Main() {\n        // Your code here\n    }\n}',
  cpp: '// Write your C++ code here\n\n#include <iostream>\n\nint main() {\n    // Your code here\n    \n    return 0;\n}',
};

export default function CodeEditor({ exerciseId, initialCode, testCases, onSubmissionComplete }) {
  const [code, setCode] = useState(initialCode || defaultCode.javascript);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset code when language changes
  useEffect(() => {
    if (!initialCode) {
      setCode(defaultCode[language]);
    }
  }, [language, initialCode]);

  // Handle editor value change
  const handleEditorChange = (value) => {
    setCode(value);
  };

  // Run code (test locally in browser for JavaScript)
  const runCode = async () => {
    setIsRunning(true);
    setOutput('');

    try {
      if (language === 'javascript') {
        // For JS, we can run it in the browser
        const consoleOutput = [];
        const originalConsoleLog = console.log;

        // Override console.log temporarily
        console.log = (...args) => {
          consoleOutput.push(args.join(' '));
          originalConsoleLog(...args);
        };

        try {
          // Execute the code (with safety precautions)
          // This is simplified - in a real app, you'd want more sandboxing
          const result = new Function(`
            try {
              ${code}
              return { success: true, result: (typeof solution === 'function' ? solution() : 'No solution function found') };
            } catch (error) {
              return { success: false, error: error.toString() };
            }
          `)();

          if (result.success) {
            consoleOutput.push(`Result: ${JSON.stringify(result.result)}`);
          } else {
            consoleOutput.push(`Error: ${result.error}`);
          }
        } catch (error) {
          consoleOutput.push(`Execution Error: ${error.toString()}`);
        } finally {
          // Restore original console.log
          console.log = originalConsoleLog;
        }

        setOutput(consoleOutput.join('\n'));
      } else {
        // For other languages, we'd need a backend execution environment
        const response = await axios.post('/api/practice/run', {
          language,
          code,
        });
        setOutput(response.data.output);
      }
    } catch (error) {
      console.error('Error running code:', error);
      setOutput(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Submit solution for evaluation
  const submitSolution = async () => {
    if (!exerciseId) {
      toast.error('Cannot submit - missing exercise information');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`/api/practice/submissions`, {
        exerciseId,
        code,
        language,
      });

      const result = response.data;

      setOutput(`Submission Result:\n${
        result.passed 
          ? '✅ All tests passed!' 
          : `❌ Some tests failed.\n${result.feedback}`
      }`);

      toast.success('Solution submitted successfully');

      if (onSubmissionComplete) {
        onSubmissionComplete(result);
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      toast.error('Failed to submit solution');
      setOutput(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Editor Settings */}
      <div className="bg-gray-800 text-white p-3 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="language" className="mr-2 text-sm">
              Language:
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
            >
              {languageOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="theme" className="mr-2 text-sm">
              Theme:
            </label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
            >
              <option value="vs-dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={runCode}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm disabled:opacity-50"
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          <button
            onClick={submitSolution}
            disabled={isSubmitting || !exerciseId}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Solution'}
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 min-h-[400px]">
        <Editor
          height="100%"
          language={language}
          value={code}
          theme={theme}
          onChange={handleEditorChange}
          options={{
            fontSize: 14,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {/* Output Console */}
      <div className="bg-black text-white p-3 h-48 overflow-auto">
        <div className="text-gray-400 text-sm mb-2">Output:</div>
        <pre className="font-mono text-sm whitespace-pre-wrap">{output || 'Run your code to see output here'}</pre>
      </div>
    </div>
  );
}