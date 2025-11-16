import React, { useState, useEffect } from 'react';
import { Download, Loader } from 'lucide-react';

export default function Home() {
  const [today, setToday] = useState(new Date());
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(false);

  const workoutData = {
    1: {
      1: "LIFT 5x Sept/Oct - Week 1 - Day 1\n\nA) Daily Focus Notes: Tempo Detail\n\"On your bench press today, really lock in the slow lower. Count to 2 on the way down. This builds strength and keeps your shoulders safe. Slowing things down gives your muscles more time under tension and makes your joints more stable. If you rush, you miss out on a lot of the benefits.\"\n\nShort on Time? Remove Finisher.\n\nB) Warmup: 2 min Cardio of Choice + 2-3 Sets\n1) DB ER on Knee; 8-10 reps/side\n2) Bench Dips; 10-15 reps\n\nC) Strength Intensity 1 (14 min): Barbell Bench Press\nEvery 2:30 x 4 Working Sets\nWarm-Up Set - 10 reps @ 20X1 - Easy\nWorking Set 1 - 10 @ 20X1 - RPE 7\nWorking Set 2 - 8 @ 20X1 - RPE 8\nWorking Set 3 - 6 @ 20X1 - RPE 9\nWorking Set 4 - Drop back to your Set 1 and perform Max UB reps @20X1 (Aim for 10+ reps)\n\nD) Strength Intensity 2 (10 min): Supinated Bent Over Row\nEvery 2:30 x 3 working sets\nWarm-Up Set - 10 reps @20X1 - Easy\nWorking Set 1 - 15 @20X1 - RPE 7\nWorking Set 2 - 15 @20X1 - same weight\nWorking Set 3 - 15 @20X1 - same weight\nKeep weight the same for all sets today, the RPE will increase as fatigue accumulates.\n\nE) Strength Balance (14 min): 3 sets\n1. Supinated Strict Pullup; 6-8 reps - rest 30 sec\n2. Low Incline 1 1/4 Dumbbell Bench Press; 6-8 reps - rest 90 sec and back to 1.\nLoading Note: Aim for each set to be close to failure.\n\nF) Finisher (10-12 min): 2-3 sets\n1. DB Pullover; 10-12 reps @30X0 - rest 30 sec\n2. Hand on Bench Narrow Grip Pushup; 10-12 reps @20X0 - rest 60-90 sec and back to 1.\nLoading Note: Aim for each set to be close to failure.\n\nG) Cooldown (5 min): 1-2 sets\n1) Scorpion Chest Stretch; 30 sec/side\n2) Supinated Passive Hang; 30 sec\n3) Single Arm Prayer Stretch; 30 sec/side\n\nTotal Time: ~60-65 minutes",
      2: "Week 1 Day 2 content",
      3: "Week 1 Day 3 content",
      4: "Week 1 Day 4 content",
      5: "Week 1 Day 5 content",
      6: "Week 1 Day 6 content",
      7: "Week 1 Day 7 content",
    },
    2: { 1: "Week 2", 2: "Week 2", 3: "Week 2", 4: "Week 2", 5: "Week 2", 6: "Week 2", 7: "Week 2" },
    3: { 1: "Week 3", 2: "Week 3", 3: "Week 3", 4: "Week 3", 5: "Week 3", 6: "Week 3", 7: "Week 3" },
    4: { 1: "Week 4", 2: "Week 4", 3: "Week 4", 4: "Week 4", 5: "Week 4", 6: "Week 4", 7: "Week 4" },
    5: { 1: "Week 5", 2: "Week 5", 3: "Week 5", 4: "Week 5", 5: "Week 5", 6: "Week 5", 7: "Week 5" },
    6: { 1: "Week 6", 2: "Week 6", 3: "Week 6", 4: "Week 6", 5: "Week 6", 6: "Week 6", 7: "Week 6" },
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setToday(newDate);
  };

  const calculateCyclePosition = () => {
    const cycleStart = new Date(2025, 9, 6);
    const daysSince = Math.floor((today - cycleStart) / (1000 * 60 * 60 * 24));
    const weekInCycle = (Math.floor(daysSince / 7) % 6) + 1;
    const dayOfWeek = today.getDay();
    const dayOfCycle = dayOfWeek === 0 ? 7 : dayOfWeek;
    return { week: weekInCycle, day: dayOfCycle };
  };

  const generateWorkout = () => {
    setLoading(true);
    setTimeout(() => {
      const { week, day } = calculateCyclePosition();
      const workoutContent = workoutData[week]?.[day];
      if (workoutContent && !workoutContent.includes('[')) {
        setWorkout({
          week,
          day,
          content: workoutContent,
          date: today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        });
      } else {
        setWorkout({
          week,
          day,
          content: `Week ${week}, Day ${day} - Full database coming soon.`,
          date: today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        });
      }
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    generateWorkout();
  }, [today]);

  const { week: currentWeek, day: currentDay } = calculateCyclePosition();
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
          <p className="text-gray-600">Your daily workout in one click</p>
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
            <div className="whitespace-pre-wrap text-gray-700 font-mono text-sm leading-relaxed max-h-96 overflow-y-auto">
              {workout.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}