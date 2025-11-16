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

// Function to parse set details from narrative (Warm-Up Set, Working Set 1, etc.)
const parseSetDetails = (lines) => {
  const setDetails = [];
  for (let line of lines) {
    const trimmed = line.trim();

    // Match "Warm-Up Set - 10 reps @20X1 - Easy"
    const warmupMatch = trimmed.match(/^Warm-Up Set\s*-\s*(\d+[\+]*)\s+reps?\s+@([\dXx]+)\s*-?\s*(.*)$/i);
    if (warmupMatch) {
      setDetails.push({
        type: 'Warm-up',
        reps: warmupMatch[1],
        tempo: warmupMatch[2],
        rpe: warmupMatch[3].trim() || ''
      });
      continue;
    }

    // Match "Working Set 1 - 12 reps @33X1 - RPE 7"
    const workingMatch = trimmed.match(/^Working Set\s+(\d+)\s*-\s*(\d+[\+]*|Max)\s+reps?\s+@([\dXx]+)\s*(?:-\s*)?(?:RPE\s+)?(.*)$/i);
    if (workingMatch) {
      setDetails.push({
        type: `Set ${workingMatch[1]}`,
        reps: workingMatch[2],
        tempo: workingMatch[3],
        rpe: workingMatch[4].replace(/^\(aim for.*?\)/, '').trim()
      });
      continue;
    }
  }
  return setDetails;
};

// Function to parse structured exercise data from workout text
const parseExerciseData = (lines) => {
  const exercises = [];
  let currentExercise = null;

  for (let line of lines) {
    const trimmed = line.trim();

    // Match "Exercise:" or "Exercise 1:", "Exercise 2:", etc.
    const exerciseMatch = trimmed.match(/^Exercise(?:\s+(\d+))?\s*:\s*(.+)$/);
    if (exerciseMatch) {
      if (currentExercise) {
        exercises.push(currentExercise);
      }
      currentExercise = {
        number: exerciseMatch[1] || '',
        name: exerciseMatch[2].trim(),
        reps: '',
        tempo: '',
        sets: ''
      };
      continue;
    }

    if (currentExercise) {
      const repsMatch = trimmed.match(/^Reps:\s*(.+)$/);
      if (repsMatch) {
        currentExercise.reps = repsMatch[1].trim();
        continue;
      }

      const tempoMatch = trimmed.match(/^Tempo:\s*(.+)$/);
      if (tempoMatch) {
        currentExercise.tempo = tempoMatch[1].trim();
        continue;
      }

      const setsMatch = trimmed.match(/^Sets:\s*(.+)$/);
      if (setsMatch) {
        currentExercise.sets = setsMatch[1].trim();
        continue;
      }
    }
  }

  if (currentExercise) {
    exercises.push(currentExercise);
  }

  return exercises;
};

// Function to extract rest periods from narrative text
const extractRestPeriods = (lines) => {
  const restPeriods = [];
  for (let line of lines) {
    const restMatch = line.match(/- rest\s+(.+?)(?:\s+and back to \d+)?$/i);
    if (restMatch) {
      restPeriods.push(restMatch[1].trim());
    }
  }
  return restPeriods;
};

// Function to extract progression notes
const extractProgressionNotes = (lines) => {
  for (let line of lines) {
    const noteMatch = line.match(/^Progression Note:\s*(.+)$/);
    if (noteMatch) {
      return noteMatch[1].trim();
    }
  }
  return '';
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

// Parse numbered list exercises (like in warmup/cooldown)
const parseNumberedExercises = (lines) => {
  const exercises = [];
  for (let line of lines) {
    // Match patterns like "1) BW Walking Lunge; 6-8 reps/side @20X0"
    const match = line.match(/^(\d+)\)\s+([^;@]+?)(?:;\s*)?(\d+[\-\d]*)?(?:\s+reps?(?:\/side)?)?(?:\s*@\s*([\dXx]+))?/i);
    if (match) {
      exercises.push({
        name: match[2].trim(),
        sets: [{
          type: '',
          reps: match[3] || '',
          tempo: match[4] || '',
          rpe: ''
        }]
      });
    }
  }
  return exercises;
};

const formatSection = (sectionLetter, header, content) => {
  let result = `\n## ${header}\n\n`;

  // Parse structured data
  const exercises = parseExerciseData(content);
  const setDetails = parseSetDetails(content);
  const restPeriods = extractRestPeriods(content);
  const progressionNote = extractProgressionNotes(content);

  // Get narrative content (everything before structured data)
  const narrativeLines = [];
  let foundStructuredData = false;
  for (let line of content) {
    if (line.match(/^(Exercise(?:\s+\d+)?|Warm-Up Set|Working Set)\s*:/)) {
      foundStructuredData = true;
      break;
    }
    if (!foundStructuredData && line.trim() && !line.match(/^(Progression Note:|Reps:|Tempo:|Sets:|Warm-Up Set|Working Set)/)) {
      narrativeLines.push(line);
    }
  }

  // For Section A, format specially (Training Focus)
  if (sectionLetter === 'A') {
    // Extract training focus line
    const focusMatch = content.join('\n').match(/Training Focus:\s*(.+)/);
    if (focusMatch) {
      result += `**Training Focus:** ${focusMatch[1]}\n\n`;
    } else {
      result += content.filter(line => !line.match(/^(Exercise|Reps|Tempo|Sets):/)).join('\n') + '\n';
    }
    return result;
  }

  // Add progression note if exists
  if (progressionNote) {
    result += `${progressionNote}\n\n`;
  }

  // Add timing info if present (like "Every 2:30 x 4 Working Sets")
  const timingLines = narrativeLines.filter(line => line.match(/^Every\s+/i));
  if (timingLines.length > 0 && exercises.length > 0) {
    result += timingLines.join('\n') + '\n\n';
  }

  // Create tables based on section type
  if (exercises.length > 0 && setDetails.length > 0) {
    // Strength sections with detailed set information
    if (exercises.length === 1) {
      result += createDetailedExerciseTable(exercises[0], setDetails);
    } else {
      // Multiple exercises - separate tables
      exercises.forEach((exercise, index) => {
        if (index > 0) result += '\n';
        const exerciseRest = restPeriods[index] || '';
        // For multi-exercise sections, use simple format
        result += createSimpleExerciseTable([exercise], [exerciseRest]);
      });
    }
  } else if (exercises.length > 0) {
    // Exercises without detailed set info
    exercises.forEach((exercise, index) => {
      if (index > 0) result += '\n';
      const exerciseRest = restPeriods[index] || '';
      result += createSimpleExerciseTable([exercise], [exerciseRest]);
    });
  } else {
    // Try parsing numbered exercises (for warmup/cooldown)
    const numberedExercises = parseNumberedExercises(narrativeLines);
    if (numberedExercises.length > 0) {
      // Show other narrative text first
      const otherLines = narrativeLines.filter(line => !line.match(/^\d+\)/));
      if (otherLines.length > 0) {
        result += otherLines.join('\n') + '\n\n';
      }
      result += createWarmupCooldownTable(numberedExercises);
    } else {
      // No structured exercise data - show narrative content
      result += content.filter(line => !line.match(/^(Exercise|Reps|Tempo|Sets):/)).join('\n') + '\n';
    }
  }

  return result;
};

// Function to create detailed table with individual set columns (for strength sections)
const createDetailedExerciseTable = (exercise, setDetails) => {
  if (!exercise || setDetails.length === 0) return '';

  // Build header
  let header = '| Exercise |';
  let separator = '|----------|';

  setDetails.forEach(set => {
    header += ` ${set.type} |`;
    separator += '------|';
  });

  header += ' Tempo | RPE |\n';
  separator += '-------|-----|\n';

  // Build row
  let row = `| ${exercise.name} |`;

  setDetails.forEach(set => {
    row += ` ${set.reps} reps |`;
  });

  // Tempo (use first set's tempo, they should all be the same)
  const tempo = setDetails[0]?.tempo || '';
  row += ` ${tempo} |`;

  // RPE (combine all RPE values)
  const rpeValues = setDetails.map(set => set.rpe || '-').join(', ');
  row += ` ${rpeValues} |\n`;

  return header + separator + row + '\n';
};

// Function to create simple table for multi-exercise sections
const createSimpleExerciseTable = (exercises, restPeriods) => {
  if (exercises.length === 0) return '';

  let markdown = '| Exercise | Sets | Reps | Tempo | Rest |\n';
  markdown += '|----------|------|------|-------|------|\n';

  exercises.forEach((exercise, index) => {
    const name = exercise.name || '';
    const sets = exercise.sets || '';
    const reps = exercise.reps || '';
    const tempo = exercise.tempo || '';
    const rest = restPeriods[index] || '';

    markdown += `| ${name} | ${sets} | ${reps} | ${tempo} | ${rest} |\n`;
  });

  return markdown + '\n';
};

// Function to create table for warmup/cooldown exercises
const createWarmupCooldownTable = (exercises) => {
  if (exercises.length === 0) return '';

  let markdown = '| Exercise | Reps | Tempo |\n';
  markdown += '|----------|------|-------|\n';

  exercises.forEach(exercise => {
    const name = exercise.name || '';
    const reps = exercise.sets[0]?.reps || '';
    const tempo = exercise.sets[0]?.tempo || '';

    markdown += `| ${name} | ${reps} | ${tempo} |\n`;
  });

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