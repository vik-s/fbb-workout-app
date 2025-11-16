import React, { useState, useEffect } from 'react';
import { Download, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// IMPORTANT: All workouts are strictly loaded from workouts.json
// This is the single source of truth for all workout data
import workoutData from '../workouts.json';

// Custom markdown components for beautiful styling
const markdownComponents = {
  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-4" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-gray-800 mt-5 mb-3 border-b-2 border-indigo-200 pb-2" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-gray-700 mt-4 mb-2" {...props} />,
  p: ({ node, ...props }) => <p className="text-gray-700 mb-3 leading-relaxed" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
  em: ({ node, ...props }) => <em className="italic text-gray-600" {...props} />,
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto my-6 rounded-lg shadow-md">
      <table className="w-full border-collapse bg-white" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700" {...props} />,
  tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-200" {...props} />,
  th: ({ node, ...props }) => <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider" {...props} />,
  td: ({ node, ...props }) => <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap" {...props} />,
  tr: ({ node, ...props }) => <tr className="hover:bg-indigo-50 transition-colors duration-150" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-4" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-4" {...props} />,
  li: ({ node, ...props }) => <li className="text-gray-700" {...props} />,
  hr: ({ node, ...props }) => <hr className="my-6 border-t-2 border-gray-300" {...props} />,
};

// Simple function to clean up workout text for display
const cleanWorkoutText = (text) => {
  // Remove lines that start with "Exercise:", "Reps:", "Tempo:", "Sets:"
  const lines = text.split('\n');
  const cleanedLines = lines.filter(line => {
    const trimmed = line.trim();
    return !trimmed.match(/^(Exercise(?:\s+\d+)?|Reps|Tempo|Sets)\s*:/);
  });
  return cleanedLines.join('\n');
};

// Function to format raw workout text as clean text (no tables)
const formatWorkoutAsMarkdown = (rawText) => {
  if (!rawText) return '';

  // Simply clean the text and return it
  return cleanWorkoutText(rawText);
};

export default function Home() {
  const [today, setToday] = useState(new Date());
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setToday(newDate);
  };

  const calculateCyclePosition = (date) => {
    const cycleStart = new Date(2025, 9, 6);
    const daysSince = Math.floor((date - cycleStart) / (1000 * 60 * 60 * 24));
    const weekInCycle = (Math.floor(daysSince / 7) % 6) + 1;
    const dayOfWeek = date.getDay();
    const dayOfCycle = dayOfWeek === 0 ? 7 : dayOfWeek;
    return { week: weekInCycle, day: dayOfCycle };
  };

  const generateWorkout = () => {
    setLoading(true);

    setTimeout(() => {
      const { week, day } = calculateCyclePosition(today);

      // STRICT: Only retrieve workouts from workouts.json
      // No dynamic generation or hardcoded workouts - JSON is the single source of truth
      const workoutContent = workoutData[week]?.[day];

      // Validate that the workout exists in workouts.json
      if (!workoutContent) {
        setWorkout({
          week,
          day,
          content: null,
          date: today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
          notFound: true
        });
      } else {
        setWorkout({
          week,
          day,
          content: workoutContent,
          date: today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
          notFound: false
        });
      }

      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    generateWorkout();
  }, [today]);

  const { week: currentWeek, day: currentDay } = calculateCyclePosition(today);
  const dayNames = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const downloadWorkout = () => {
    if (!workout) return;
    
    const text = `# ${workout.date}\n## Week ${workout.week}, Day ${workout.day}\n${formatWorkoutAsMarkdown(workout.content)}`;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', `workout-${workout.date.replace(/\s+/g, '-')}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">FBB Workout Generator</h1>
          <p className="text-gray-600">Your daily workout for any date</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500 font-semibold">TODAY</p>
              <p className="text-lg font-bold text-gray-800">
                {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">CYCLE WEEK</p>
              <p className="text-lg font-bold text-indigo-600">{currentWeek}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">DAY</p>
              <p className="text-lg font-bold text-gray-800">{dayNames[currentDay]}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block mb-2">
            <span className="text-sm font-semibold text-gray-700">Select Date</span>
          </label>
          <input
            type="date"
            value={today.toISOString().split('T')[0]}
            onChange={handleDateChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <button
          onClick={generateWorkout}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition text-lg mb-6 flex items-center justify-center gap-2 shadow-md"
        >
          {loading && <Loader size={20} className="animate-spin" />}
          {loading ? 'Loading...' : 'Generate Today\'s Workout'}
        </button>

        {workout && (
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-10">
            <div className="flex justify-between items-start mb-6 pb-6 border-b-3 border-indigo-200">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{workout.date}</h2>
                <p className="text-indigo-600 font-semibold">Week {workout.week} - Day {workout.day}</p>
              </div>
              {!workout.notFound && (
                <button
                  onClick={downloadWorkout}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-lg flex items-center gap-2 shadow-md transition whitespace-nowrap"
                >
                  <Download size={20} />
                  Download
                </button>
              )}
            </div>

            <div className="prose prose-sm max-w-none">
              {workout.notFound ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
                  <div className="flex items-center mb-2">
                    <svg className="h-6 w-6 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    <h3 className="text-lg font-semibold text-yellow-800">Workout Not Available</h3>
                  </div>
                  <p className="text-yellow-700">
                    No workout found in workouts.json for Week {workout.week}, Day {workout.day}.
                  </p>
                  <p className="text-yellow-600 text-sm mt-2">
                    Note: All workouts are strictly loaded from workouts.json. Please ensure the workout data exists for this date.
                  </p>
                </div>
              ) : (
                <ReactMarkdown
                  components={markdownComponents}
                  remarkPlugins={[remarkGfm]}
                >
                  {formatWorkoutAsMarkdown(workout.content)}
                </ReactMarkdown>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}