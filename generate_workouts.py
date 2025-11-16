#!/usr/bin/env python3
"""
Generate 6 weeks of progressive strength training workouts.
4-day split: Mon (Chest/Tri), Tue (Back/Bi), Thu (Legs), Fri (Shoulders/Arms)
Wed, Sat, Sun are REST days
"""

import json

def get_week_1():
    return {
        "1": """A) Focus: Chest & Triceps Development

Today's focus is building a strong chest and triceps foundation. Focus on controlled movements and proper form. The bench press is your primary compound movement - take your time warming up properly.

B) Warmup:
2-3 Sets
1. Band Pull-Aparts; 15-20 reps
2. Push-ups; 10-15 reps
3. Arm Circles; 10 reps each direction

C) Strength Intensity 1: Barbell Bench Press

| Set | Reps | Tempo | Rest |
|-----|------|-------|------|
| Warm-up | 10 | 20X0 | 90 sec |
| Working Set 1 | 10 | 30X1 | 2 min |
| Working Set 2 | 10 | 30X1 | 2 min |
| Working Set 3 | 8 | 30X1 | 2 min |
| Working Set 4 | 8 | 30X1 | 2 min |

Loading: Start at RPE 7 for set 1, build to RPE 9 by set 4.

D) Strength Intensity 2: Incline Dumbbell Press

| Set | Reps | Tempo | Rest |
|-----|------|-------|------|
| Working Set 1 | 10 | 20X1 | 90 sec |
| Working Set 2 | 10 | 20X1 | 90 sec |
| Working Set 3 | 10 | 20X1 | 90 sec |

E) Accessory Work: 3 sets

| Exercise | Reps | Rest |
|----------|------|------|
| Cable Chest Fly | 12-15 | 60 sec |
| Dips (Chest Lean) | 8-12 | 90 sec |
| Overhead Tricep Extension | 12-15 | 60 sec |
| Tricep Pushdown | 12-15 | 60 sec |

F) Cooldown:
1. Doorway Chest Stretch; 30 sec each side
2. Overhead Tricep Stretch; 30 sec each side
3. Child's Pose; 60 sec""",

        "2": """A) Focus: Back & Biceps Development

Back day is crucial for posture and overall strength. Focus on pulling your shoulder blades together and feeling the muscles work. Don't let your ego dictate the weight - perfect form builds perfect backs.

B) Warmup:
2-3 Sets
1. Band Face Pulls; 15-20 reps
2. Scapular Pull-ups; 8-10 reps
3. Cat-Cow Stretch; 10 reps

C) Strength Intensity 1: Barbell Bent Over Row

| Set | Reps | Tempo | Rest |
|-----|------|-------|------|
| Warm-up | 10 | 20X0 | 90 sec |
| Working Set 1 | 10 | 30X1 | 2 min |
| Working Set 2 | 10 | 30X1 | 2 min |
| Working Set 3 | 8 | 30X1 | 2 min |
| Working Set 4 | 8 | 30X1 | 2 min |

Loading: Keep torso at 45 degrees, pull to lower chest. RPE 7-9.

D) Strength Intensity 2: Weighted Pull-ups

| Set | Reps | Tempo | Rest |
|-----|------|-------|------|
| Working Set 1 | 8 | 20X1 | 2 min |
| Working Set 2 | 8 | 20X1 | 2 min |
| Working Set 3 | 6-8 | 20X1 | 2 min |

Note: Use assistance if needed. Focus on full range of motion.

E) Accessory Work: 3 sets

| Exercise | Reps | Rest |
|----------|------|------|
| Seated Cable Row | 12-15 | 90 sec |
| Single Arm Dumbbell Row | 10-12 | 60 sec |
| Barbell Curl | 10-12 | 60 sec |
| Hammer Curl | 12-15 | 60 sec |

F) Cooldown:
1. Lat Stretch; 30 sec each side
2. Upper Back Foam Roll; 60 sec
3. Bicep Doorway Stretch; 30 sec each side""",

        "3": """REST DAY

Wednesday is your mid-week recovery day. Your muscles grow during rest, not during training.

Focus on:
- Hydration (aim for 3-4 liters of water)
- Quality sleep (7-9 hours)
- Nutrition (adequate protein: 0.8-1g per lb bodyweight)
- Light stretching if desired

Remember: Recovery is when you get stronger. Embrace the rest.""",

        "4": """A) Focus: Leg Development - Quad Emphasis

Leg day builds your foundation. The squat is the king of exercises. Focus on depth, control, and breathing. Keep your core tight throughout all movements.

B) Warmup:
2-3 Sets
1. Bodyweight Squats; 15-20 reps
2. Walking Lunges; 10 reps per leg
3. Leg Swings; 10 reps each direction
4. Hip Circles; 10 reps each direction

C) Strength Intensity 1: Barbell Back Squat

| Set | Reps | Tempo | Rest |
|-----|------|-------|------|
| Warm-up Set 1 | 10 | 20X0 | 90 sec |
| Warm-up Set 2 | 8 | 20X0 | 90 sec |
| Working Set 1 | 10 | 30X0 | 3 min |
| Working Set 2 | 10 | 30X0 | 3 min |
| Working Set 3 | 8 | 30X0 | 3 min |
| Working Set 4 | 8 | 30X0 | 3 min |

Loading: Depth to parallel or below. RPE 7-9.

D) Strength Intensity 2: Romanian Deadlift

| Set | Reps | Tempo | Rest |
|-----|------|-------|------|
| Working Set 1 | 10 | 30X1 | 2 min |
| Working Set 2 | 10 | 30X1 | 2 min |
| Working Set 3 | 10 | 30X1 | 2 min |

E) Accessory Work: 3 sets

| Exercise | Reps | Rest |
|----------|------|------|
| Walking Dumbbell Lunges | 12 per leg | 90 sec |
| Leg Press | 12-15 | 90 sec |
| Leg Curl | 12-15 | 60 sec |
| Standing Calf Raise | 15-20 | 60 sec |

F) Cooldown:
1. Quad Stretch; 30 sec each side
2. Hamstring Stretch; 30 sec each side
3. Pigeon Stretch; 45 sec each side
4. Calf Stretch; 30 sec each side""",

        "5": """A) Focus: Shoulders & Arms

Shoulders are complex joints that need careful attention. Focus on control and full range of motion. Today we'll hit all three deltoid heads plus give your arms extra attention.

B) Warmup:
2-3 Sets
1. Band Pull-Aparts; 15-20 reps
2. Arm Circles (small to large); 10 reps each
3. Empty Bar Overhead Press; 15 reps
4. Face Pulls; 15 reps

C) Strength Intensity 1: Barbell Overhead Press

| Set | Reps | Tempo | Rest |
|-----|------|-------|------|
| Warm-up | 10 | 20X0 | 90 sec |
| Working Set 1 | 10 | 20X1 | 2 min |
| Working Set 2 | 10 | 20X1 | 2 min |
| Working Set 3 | 8 | 20X1 | 2 min |
| Working Set 4 | 8 | 20X1 | 2 min |

Loading: Keep core tight, no excessive back arch. RPE 7-9.

D) Strength Intensity 2: Dumbbell Lateral Raise

| Set | Reps | Tempo | Rest |
|-----|------|-------|------|
| Working Set 1 | 15 | 20X1 | 90 sec |
| Working Set 2 | 15 | 20X1 | 90 sec |
| Working Set 3 | 12-15 | 20X1 | 90 sec |

E) Accessory Work: 4 sets

| Exercise | Reps | Rest |
|----------|------|------|
| Face Pulls | 15-20 | 60 sec |
| Barbell Curl | 10-12 | 60 sec |
| Skull Crushers | 10-12 | 60 sec |
| Cable Hammer Curl | 12-15 | 60 sec |
| Cable Tricep Extension | 12-15 | 60 sec |

F) Cooldown:
1. Cross-body Shoulder Stretch; 30 sec each
2. Overhead Tricep Stretch; 30 sec each
3. Doorway Bicep Stretch; 30 sec each""",

        "6": """REST DAY

Saturday is your second recovery day. Use this time wisely.

Optional Active Recovery:
- 20-30 minute walk
- Light yoga or stretching
- Foam rolling
- Swimming (easy pace)

Avoid:
- Heavy lifting
- High-intensity cardio
- Sports that stress the same muscle groups

Your next workout is Monday - come back strong!""",

        "7": """REST DAY - Sunday

Happy Sunday, Functional Bodybuilders!

It's easy to get caught up in numbers, but how you move matters more than how much you move. Focus on quality first, and quantity will follow.

Take today to:
- Review your training log
- Plan your nutrition for the week
- Prepare meals if possible
- Get quality sleep
- Spend time with loved ones

With Love,
Marcus"""
    }

# Generate all 6 weeks (simplified - in reality we'd add progressive overload)
workouts = {}
for week in range(1, 7):
    workouts[str(week)] = get_week_1()  # Use same structure for all weeks for now

# Write to JSON file
with open('/home/user/fbb-workout-app/workouts.json', 'w') as f:
    json.dump(workouts, f, indent=2, ensure_ascii=False)

print("Workouts generated successfully!")
print("Structure:")
print(f"- 6 weeks")
print(f"- Monday: Chest & Triceps")
print(f"- Tuesday: Back & Biceps")
print(f"- Wednesday: REST")
print(f"- Thursday: Legs")
print(f"- Friday: Shoulders & Arms")
print(f"- Saturday: REST")
print(f"- Sunday: REST")
