import React, { useState, useEffect } from 'react';
import { Download, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

// Function to format raw workout text into beautiful markdown with tables
const formatWorkoutAsMarkdown = (rawText) => {
  if (!rawText) return '';
  
  let markdown = '';
  const lines = rawText.split('\n');
  
  let currentSection = '';
  let sectionLetter = '';
  let sectionContent = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Detect section headers (A), B), C), etc.)
    const sectionMatch = trimmed.match(/^([A-G])\)\s+(.*)/);
    if (sectionMatch) {
      // Save previous section if exists
      if (currentSection) {
        markdown += formatSection(sectionLetter, currentSection, sectionContent);
        sectionContent = [];
      }
      sectionLetter = sectionMatch[1];
      currentSection = trimmed;
    } else if (trimmed === '-----' || trimmed === '') {
      // Empty line - add to content
      if (currentSection) {
        sectionContent.push('');
      }
    } else if (currentSection) {
      sectionContent.push(trimmed);
    }
  }
  
  // Save last section
  if (currentSection) {
    markdown += formatSection(sectionLetter, currentSection, sectionContent);
  }
  
  return markdown;
};

const formatSection = (sectionLetter, header, content) => {
  let result = `\n## ${header}\n\n`;
  
  // Determine section type and format accordingly
  if (sectionLetter === 'C' || sectionLetter === 'D') {
    // Strength Intensity sections - create detailed tables
    result += formatStrengthTable(content);
  } else if (sectionLetter === 'E') {
    // Strength Balance - create exercise table
    result += formatBalanceTable(content);
  } else if (sectionLetter === 'F') {
    // Finisher - create finisher table
    result += formatFinisherTable(content);
  } else if (sectionLetter === 'B') {
    // Warmup - format as list
    result += formatWarmup(content);
  } else {
    // Other sections - format as text
    result += formatBasicContent(content);
  }
  
  return result;
};

const formatStrengthTable = (content) => {
  let markdown = '| Set | Reps | Tempo | RPE/Notes |\n|-----|------|-------|----------|\n';
  
  for (let line of content) {
    if (!line.trim()) continue;
    
    // Look for set information
    if (line.includes('@') || line.includes('reps') || line.includes('Set')) {
      const setMatch = line.match(/(Warm-Up|Working)\s+Set\s*-?\s*(\d+[\-\+]*)?.*?(\d+)\s+reps?\s+@\s+([\dXx]+).*?(RPE\s+[\d\.]*)?(.*)?/i);
      
      if (setMatch) {
        const setName = setMatch[1] || 'Set';
        const reps = setMatch[3] || '10';
        const tempo = setMatch[4] || '20X1';
        const rpe = setMatch[5] || setMatch[6] || 'Easy';
        
        markdown += `| ${setName} | ${reps} | ${tempo} | ${rpe} |\n`;
      } else if (line.match(/\d+\s+@\s+[\dXx]+/) || line.match(/reps/i)) {
        // Try simpler parsing
        const parts = line.split(/\s+@\s+/);
        if (parts.length >= 1) {
          const repMatch = line.match(/(\d+)\s+(?:reps?)?/i);
          const tempoMatch = line.match(/@\s+([\dXx]+)/i);
          const rpeMatch = line.match(/(RPE\s+[\d\.]+|Easy|Max)/i);
          
          const reps = repMatch ? repMatch[1] : '10';
          const tempo = tempoMatch ? tempoMatch[1] : '20X1';
          const rpe = rpeMatch ? rpeMatch[1] : '';
          
          markdown += `| Set | ${reps} | ${tempo} | ${rpe} |\n`;
        }
      }
    }
  }
  
  return markdown + '\n';
};

const formatBalanceTable = (content) => {
  let markdown = '| Exercise | Reps | Rest |\n|----------|------|------|\n';
  let exercises = [];
  
  for (let line of content) {
    if (!line.trim()) continue;
    
    // Look for numbered exercises (1. Exercise name; reps)
    const exerciseMatch = line.match(/^\d+\.\s+(.*?);?\s*(\d+[\-\d]*)\s+reps?/i);
    if (exerciseMatch) {
      exercises.push({
        name: exerciseMatch[1].trim(),
        reps: exerciseMatch[2]
      });
    } else if (line.match(/^\d+\.\s+/)) {
      const name = line.replace(/^\d+\.\s+/, '').trim();
      exercises.push({ name });
    } else if (line.includes('rest')) {
      if (exercises.length > 0) {
        const restMatch = line.match(/rest\s+([\d\-\s]+)/i);
        if (restMatch) {
          exercises[exercises.length - 1].rest = restMatch[1].trim();
        }
      }
    }
  }
  
  exercises.forEach(ex => {
    markdown += `| ${ex.name} | ${ex.reps || '6-8'} | ${ex.rest || '30-90 sec'} |\n`;
  });
  
  return markdown + '\n';
};

const formatFinisherTable = (content) => {
  let markdown = '| Exercise | Reps | Tempo | Rest |\n|----------|------|-------|------|\n';
  let exercises = [];
  
  for (let line of content) {
    if (!line.trim()) continue;
    
    // Look for numbered exercises with full details
    const match = line.match(/^\d+\.\s+(.*?);?\s*(\d+[\-\d]*)\s+reps?\s+@([\dXx]+)?(.*)?/i);
    if (match) {
      exercises.push({
        name: match[1].trim(),
        reps: match[2],
        tempo: match[3] || '20X0',
        rest: ''
      });
    } else if (line.match(/^\d+\.\s+/)) {
      const name = line.replace(/^\d+\.\s+/, '').split(/;|@/)[0].trim();
      exercises.push({ name, reps: '', tempo: '', rest: '' });
    } else if (line.includes('rest')) {
      if (exercises.length > 0) {
        const restMatch = line.match(/rest\s+([\d\-\s]+)/i);
        if (restMatch) {
          exercises[exercises.length - 1].rest = restMatch[1].trim();
        }
      }
    }
  }
  
  exercises.forEach(ex => {
    markdown += `| ${ex.name} | ${ex.reps || ''} | ${ex.tempo || ''} | ${ex.rest || ''} |\n`;
  });
  
  return markdown + '\n';
};

const formatWarmup = (content) => {
  let markdown = '';
  
  for (let line of content) {
    if (!line.trim()) {
      markdown += '\n';
      continue;
    }
    
    // Format as list
    if (line.match(/^\d+\.\s+/)) {
      markdown += `${line}\n`;
    } else {
      markdown += `${line}\n`;
    }
  }
  
  return markdown + '\n';
};

const formatBasicContent = (content) => {
  let markdown = '';
  
  for (let line of content) {
    if (!line.trim()) {
      markdown += '\n';
    } else {
      markdown += `${line}\n`;
    }
  }
  
  return markdown + '\n';
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
      const workoutContent = workoutData[week]?.[day];
      
      setWorkout({
        week,
        day,
        content: workoutContent || `Week ${week}, Day ${day} - Workout not found`,
        date: today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
      });
      
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
              <button
                onClick={downloadWorkout}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-lg flex items-center gap-2 shadow-md transition whitespace-nowrap"
              >
                <Download size={20} />
                Download
              </button>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={markdownComponents}
                remarkPlugins={[remarkGfm]}
              >
                {formatWorkoutAsMarkdown(workout.content)}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}