import React, { useState, useEffect } from 'react';
import { Download, Loader } from 'lucide-react';

export default function WorkoutApp() {
  const [today, setToday] = useState(new Date());
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(false);

  // 6-week workout database embedded from PDFs
  // October 6, 2025 was Week 1, Day 1 of the cycle
  const workoutData = {
    1: {
      1: "LIFT 5x Sept/Oct - Week 1 - Day 1\n\nA) Daily Focus Notes: Tempo Detail\n\"On your bench press today, really lock in the slow lower. Count to 2 on the way down. This builds strength and keeps your shoulders safe. Slowing things down gives your muscles more time under tension and makes your joints more stable. If you rush, you miss out on a lot of the benefits.\"\n\nShort on Time? Remove Finisher.\n\nB) Warmup: 2 min Cardio of Choice + 2-3 Sets\n1) DB ER on Knee; 8-10 reps/side\n2) Bench Dips; 10-15 reps\n\nC) Strength Intensity 1 (14 min): Barbell Bench Press\nEvery 2:30 x 4 Working Sets\nWarm-Up Set - 10 reps @ 20X1 - Easy\nWorking Set 1 - 10 @ 20X1 - RPE 7\nWorking Set 2 - 8 @ 20X1 - RPE 8\nWorking Set 3 - 6 @ 20X1 - RPE 9\nWorking Set 4 - Drop back to your Set 1 and perform Max UB reps @20X1 (Aim for 10+ reps)\n\nD) Strength Intensity 2 (10 min): Supinated Bent Over Row\nEvery 2:30 x 3 working sets\nWarm-Up Set - 10 reps @20X1 - Easy\nWorking Set 1 - 15 @20X1 - RPE 7\nWorking Set 2 - 15 @20X1 - same weight\nWorking Set 3 - 15 @20X1 - same weight\nKeep weight the same for all sets today, the RPE will increase as fatigue accumulates.\n\nE) Strength Balance (14 min): 3 sets\n1. Supinated Strict Pullup; 6-8 reps - rest 30 sec\n2. Low Incline 1 1/4 Dumbbell Bench Press; 6-8 reps - rest 90 sec and back to 1.\nLoading Note: Aim for each set to be close to failure.\n\nF) Finisher (10-12 min): 2-3 sets\n1. DB Pullover; 10-12 reps @30X0 - rest 30 sec\n2. Hand on Bench Narrow Grip Pushup; 10-12 reps @20X0 - rest 60-90 sec and back to 1.\nLoading Note: Aim for each set to be close to failure.\n\nG) Cooldown (5 min): 1-2 sets\n1) Scorpion Chest Stretch; 30 sec/side\n2) Supinated Passive Hang; 30 sec\n3) Single Arm Prayer Stretch; 30 sec/side\n\nTotal Time: ~60-65 minutes",
      2: "LIFT 5x Sept/Oct - Week 1 - Day 2\n\nA) Daily Focus Notes: Setup Cue\n\"In Goodmornings, check that you feel your hamstrings stretch and load. If it's only your back, push your hips back more. Getting the right muscles working makes you stronger where it counts and keeps your spine safe.\"\n\nShort on Time? Remove Finisher or Strength Balance based on your individual goals.\n\nB) Warmup: 2 min Cardio of Choice + 2-3 Sets\n1) Wall Sit; 45-60 sec\n2) Shinbox Switch; 5 reps/side\n\nC) Strength Intensity 1 (14 min): Back Squat\nEvery 2:30 x 4 Working Sets\nWarm-Up Set - 10 reps @ 20X1 - Easy\nWorking Set 1 - 10 @ 20X1 - RPE 7\nWorking Set 2 - 8 @ 20X1 - RPE 8\nWorking Set 3 - 6 @ 20X1 - RPE 9\nWorking Set 4 - Drop back to your Set 1 and perform Max UB reps @20X1 (Aim for 10+ reps)\n\nD) Strength Intensity 2 (10 min): Barbell Goodmorning\nEvery 2:30 x 3 working sets\nWarm-Up Set - 10 reps @20X1 - Easy\nWorking Set 1 - 10 @20X1 - RPE 7\nWorking Set 2 - 10 @20X1 - same weight\nWorking Set 3 - 10 @20X1 - same weight\n\nE) Strength Balance (14 min): 3 sets\n1. Goblet Cossack Squat; 5-7 reps/side @30X0 - rest 60 sec\n2. Hand Support Dumbbell Suitcase Box Step Up; 5-7 reps/side @30X0 - rest 90 sec and back to 1.\nLoading Note: Perform 1 warmup set. Aim for RPE 7-8 on first and keep weight same.\n\nF) Finisher (10 min): 2-3 sets\n1. Weight Plate Turkish Sit Up; 6-8 reps @30X0 - rest 45 sec\n2. Tuck L Sit; 30 sec - rest 45 sec and back to 1.\nLoading Note: Aim for each set to be close to failure.\n\nG) Cooldown (5 min): 1-2 sets\n1) Half Kneeling Hip Flexor Stretch; 30 sec/side\n2) Butterfly Stretch; 30 sec\n3) Front Split Stretch; 30 sec/side\n\nTotal Time: ~60-65 minutes",
      3: "LIFT 5x Sept/Oct - Week 1 - Day 3\n\nA) Daily Focus Notes: Setup Tip\n\"When you Z Press today, lock your legs out and keep them flat. That forces your core to brace so you can learn great mechanics of the shoulders and core during pressing movements. Starting in a solid setup means less strain on your lower back and more strength built in the right places.\"\n\nShort on Time? Remove Finisher or Strength Balance based on your individual goals.\n\nB) Warmup: 2 min Cardio of Choice + 2-3 Sets\n1) DB Windmill; 5 reps/side\n2) Banded YTW; 5 reps in each position\n\nC) Strength Intensity 1 (12 min): 3 sets\n1. Barbell Z Press; 10 reps @21X1 - rest 30 sec\n2. Barbell Curl; 10 reps @30X0 - rest 90 sec and back to 1.\nLoading Note: Perform 1-2 warmup sets. Aim for each set to be close to failure.\n\nD) Strength Intensity 2 (12 min): 3 sets\n1. Dumbbell Lateral Raise; 10-12 reps @30X0 - rest 60 sec\n2. Back Supported Barbell French Press OR DB Overhead Tricep Extension; 8-10 reps @30X0 - rest 60 sec and back to 1.\nLoading Note: Aim for each set to be close to failure.\n\nE) Strength Balance (12-15 min): 3-4 sets\n1. Dumbbell Spider Curl; 10-12 @20X0 - rest 45 sec\n2. Cable Rope Tricep Pushdown OR DB Skullcrushers; 12-15 @20X0 - rest 45 sec and back to 1.\nLoading Note: Aim for each set to be close to failure.\n\nF) Finisher (10 min): 2-3 sets\n1. Seated Rear Delt Fly; 12-15 reps @20X0 - rest 30 sec\n2. Farmers Walk; 30m - rest 30 sec and back to 1.\nLoading Note: Aim for each set to be close to failure.\n\nG) Cooldown (5 min): 1-2 sets\n1) Seated Barbell Shoulder Extension Stretch; 30-60 sec\n2) Pretzel Stretch; 30 sec/side\n3) Pole Rhomboid Stretch; 30 sec\n\nTotal Time: ~50-60 minutes",
      4: "Active Recovery Day\n\nA) Active Recovery Work: 40 min total work\n\nPart 1: 20 min timer (continuous movement):\n250-300m Row or Jog\nthen stop and do:\n- 10 Alternating Low Switch Cossack Squats\n- 10 Side Plank Hip Taps/side\n*return to Row or Jog and repeat\n\nPart 2: 20 min timer (continuous movement):\n250-300m Row or Jog\nthen stop and do:\n- 10 Reverse Plank Bridge with Hip Lift (hold 15 sec on last rep)\n- 10 Tuck Ups (hold 15 sec on last rep)\n*return to Row or Jog and repeat\n\nB) PERSIST RECOVERY MOBILITY SESSION: Ankles and Wrists\n- Ankle Circles x 5 reps/direction\n- Weighted ankle stretch x 1 min/side\n- Heel Sit x 1 min\n- Toe Sit x 1 min\n- Hand to Hand wrist circles x 30 sec\n- Wrist Extension Stretch x 1 min\n- Wrist Flexion Stretch x 1 min\n- Wrist Isometrics x 3-5 reps with 5 sec hold\n- Quadruped Wrist Circles x 5-10 reps/direction\n\nTotal Time: ~50 minutes",
      5: "LIFT 5x Sept/Oct - Week 1 - Day 5\n\nA) Daily Focus Notes: Setup Tip\n\"On your Bulgarian split squats today, focus on your stance. Take a long enough step so your front shin stays vertical as you lower. A solid setup keeps your knee safe and ensures your quads and glutes are doing the heavy lifting.\"\n\nShort on Time? Remove Finisher.\n\nB) Warmup: 2 min Cardio of Choice + 2-3 Sets\n1) Single Arm KB Deadlift; 5-7 reps/side\n2) Goblet Split Squat; 5-7 reps/side @20X0\n\nC) Strength Intensity 1 (12 min): DB Bulgarian Split Squat\n3 working sets; rest 60-75 sec between all sides and sets\nWarm-Up Set - 10 reps - Easy\nWorking Set 1 - 10 - RPE 8\nWorking Set 2 - 10 - same weight\nWorking Set 3 - Max UB reps - same weight\n\nD) Strength Intensity 2 (10 min): Seated Cable Row or Head Support DB Bent Over Row\nEvery 2:30 x 3 working sets\nWarm-Up Set - 10 reps @20X1 - Easy\nWorking Set 1 - 15 @20X1 - RPE 7\nWorking Set 2 - 15 @20X1 - same weight\nWorking Set 3 - 15 @20X1 - same weight\n\nE) Strength Balance (15 min): 3 sets\n1. Goblet Cyclist Squat; 12-15 reps @20X0 - rest 30 sec\n2. Tripod DB Row; 10-12 reps/side @20X0 - rest 90 sec and back to 1.\nLoading Note: Perform 1 warmup set. Aim for RPE 7-8 on first working set.\n\nF) Finisher (10 min): 2-3 sets\n1. Wide Grip Pullup; 6-10 reps @20X0 - rest 30 sec\n2. Weighted Forearm Plank; 40-60 sec - rest 60-90 sec and back to 1.\nLoading Note: Aim for each set to be close to failure.\n\nG) Cooldown (5 min): 1-2 sets\n1) Reclined Hero Stretch; 30-60 sec\n2) Forward Fold Rotation; 30 sec\n3) Banded Lat Stretch; 30 sec/side\n\nTotal Time: ~60-65 minutes",
      6: "LIFT 5x Sept/Oct - Week 1 - Day 6\n\nA) Daily Focus Notes: Mental Cue\n\"On your deficit deadlifts, think about pushing the floor away instead of just pulling the bar. This cue drives the lift through your legs and hips, keeping your back from overworking.\"\n\nShort on Time? Remove Finisher or Strength Intensity 2 based on your individual goals.\n\nB) Warmup: 2 min Cardio of Choice + 2-3 Sets\n15 sec Cardio Sprint directly into:\n1) DB Full Raise; 8-10 reps @30X0\n2) Middle Split Hip Hinge; 5-7 reps @30X0\n\nC) Strength Intensity 1 (12 min): Deficit Deadlift\nEvery 3:30 x 3 Working Sets\nWarm-Up Set - 10 reps @ 20X1 - Easy\nWorking Set 1 - 10 @ 20X1 - RPE 7\nWorking Set 2 - 8 @ 20X1 - RPE 8\nWorking Set 3 - 6 @ 20X1 - RPE 9\n\nD) Strength Intensity 2 (12 min): Single Leg Landmine RDL\n3 working sets; rest 60-75 sec between all side and sets\nWorking Set 1 - 8/side @ 20X1 - RPE 7\nWorking Set 2 - 6/side @ 20X1 - RPE 8\nWorking Set 3 - 4/side @ 20X1 - RPE 9\n\nE) Strength Balance (12 min): 3 sets\n1. Strict Bar Dip; 5-7 reps @31X1 - rest 30 sec\n2. Assisted Nordic Curl; 5-7 reps @30X0 - rest 60-90 sec and back to 1.\nLoading Note: Perform 1 warmup set. Aim for RPE 7-8 on first working set.\n\nF) Finisher (10 min): 2-3 sets\n1. Half Kneeling Landmine Press; 6-8 reps/side @30X0 - rest 30 sec\n2. Suitcase Standing Calf Raise; 12-15 reps @30X0 - rest 60-90 sec and back to 1.\nLoading Note: Aim for each set to be close to failure.\n\nG) Cooldown (5 min): 1-2 sets\n1) Pigeon Stretch; 30 sec/side\n2) Downdog to Updog x 6-8 reps\n3) Hip Sleeper Stretch; 30 sec/side\n\nTotal Time: ~60-65 minutes",
      7: "REST DAY - Sunday\n\nHappy Sunday, Functional Bodybuilders!\n\nIt's easy to get caught up in numbers—heavier weights, faster reps, longer workouts—but the truth is, how you move matters far more than how much you move.\n\nPaying attention to form, tempo, and proper breathing ensures your body is working efficiently and safely. Small adjustments now can prevent injuries, improve results, and make every session more effective.\n\nThink of it this way: consistent, intentional practice builds a stronger, more resilient body than mindless grinding ever will.\n\nFocus on quality first, and quantity will naturally follow.\n\nWith Love,\nMarcus",
    },
    2: { 1: "[Week 2 - Day 1 content]", 2: "[Week 2 - Day 2 content]", 3: "[Week 2 - Day 3 content]", 4: "[Week 2 - Day 4 Recovery]", 5: "[Week 2 - Day 5 content]", 6: "[Week 2 - Day 6 content]", 7: "[Rest Day]" },
    3: { 1: "[Week 3 - Day 1]", 2: "[Week 3 - Day 2]", 3: "[Week 3 - Day 3]", 4: "[Week 3 - Day 4]", 5: "[Week 3 - Day 5]", 6: "[Week 3 - Day 6]", 7: "[Rest Day]" },
    4: { 1: "[Week 4 - Day 1]", 2: "[Week 4 - Day 2]", 3: "[Week 4 - Day 3]", 4: "[Week 4 - Day 4]", 5: "[Week 4 - Day 5]", 6: "[Week 4 - Day 6]", 7: "[Rest Day]" },
    5: { 1: "[Week 5 - Day 1]", 2: "[Week 5 - Day 2]", 3: "[Week 5 - Day 3]", 4: "[Week 5 - Day 4]", 5: "[Week 5 - Day 5]", 6: "[Week 5 - Day 6]", 7: "[Rest Day]" },
    6: { 1: "[Week 6 - Day 1]", 2: "[Week 6 - Day 2]", 3: "[Week 6 - Day 3]", 4: "[Week 6 - Day 4]", 5: "[Week 6 - Day 5]", 6: "[Week 6 - Day 6]", 7: "[Rest Day]" },
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
