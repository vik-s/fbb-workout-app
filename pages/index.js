import React, { useState, useEffect } from 'react';
import { Download, Loader } from 'lucide-react';
import workoutData from '../workouts.json';

export default function Home() {
  const [today, setToday] = useState(new Date());
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setToday(newDate);
  };

  const calculateCyclePosition = (date) => {
    // October 6, 2025 was Week 1, Day 1
    const cycleStart = new Date(2025, 9, 6);
    const daysSince = Math.floor((date - cycleStart) / (1000 * 60 * 60 * 24));
    
    // Calculate which week in the 6-week cycle
    const weekInCycle = (Math.floor(daysSince / 7) % 6) + 1;
    
    // Calculate day of week (1=Monday, 7=Sunday)
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
    
    const text = `WORKOUT FOR ${workout.date}\nWeek ${workout.week}, Day ${workout.day}\n\n${workout.content}`;
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
          <p className="text-gray-600">Your daily workout for any date in one click</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">TODAY</p>
              <p className="text-lg font-semibold text-gray-800">
                {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">CYCLE WEEK</p>
              <p className="text-lg font-semibold text-indigo-600">{currentWeek}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">DAY</p>
              <p className="text-lg font-semibold text-gray-800">{dayNames[currentDay]}</p>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={generateWorkout}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition text-lg mb-6 flex items-center justify-center gap-2"
        >
          {loading && <Loader size={20} className="animate-spin" />}
          {loading ? 'Loading...' : 'Generate Today\'s Workout'}
        </button>

        {workout && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6 pb-6 border-b-2 border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{workout.date}</h2>
                <p className="text-gray-600">Week {workout.week}, Day {workout.day}</p>
              </div>
              <button
                onClick={downloadWorkout}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2"
              >
                <Download size={20} />
                Download
              </button>
            </div>
            
            <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed max-h-96 overflow-y-auto">
              {workout.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
