# 🧠 Iron-Mind AI: System Context

This document serves as the high-speed memory layer for the Iron-Mind codebase. It maps the most frequently used utilities and endpoints so agents can invoke them autonomously without traversing the directory tree.

## 🛠️ Top 5 Utility Functions

### 1. `supabase` (Auth & Database Client)
**Path:** `@/lib/supabase`
**Usage:** The core interface for all cloud interactions.
```typescript
import { supabase } from '@/lib/supabase';

// Example: Fetch workouts
const { data, error } = await supabase.from('workouts').select('*');
// Example: Get user
const { data: { user } } = await supabase.auth.getUser();
```

### 2. `estimate1RM` (Strength Calculator)
**Path:** `@/lib/iron-logic`
**Usage:** Calculates theoretical maximum strength from sub-maximal sets.
```typescript
import { estimate1RM } from '@/lib/iron-logic';

const epleyMax = estimate1RM.epley(weightLbs, repsCompleted); // e.g. (315, 5) -> 367
const brzyckiMax = estimate1RM.brzycki(weightLbs, repsCompleted);
```

### 3. `calculateWorkout` (5/3/1 Core Math)
**Path:** `@/lib/workout-logic`
**Usage:** Generates the required sets, percentages, and weights for a given week.
```typescript
import { calculateWorkout } from '@/lib/workout-logic';

const currentTM = 315;
const currentWeek = 3; // 5/3/1 week
const sessionSets = calculateWorkout(currentTM, currentWeek); 
// Returns: [{ percentage: 75, weight: 235, reps: '5' }, ...]
```

### 4. `analyzeProgress` (AI Coaching Engine)
**Path:** `@/lib/coach-logic`
**Usage:** Scans history to provide actionable intelligence and TM jump recommendations.
```typescript
import { analyzeProgress } from '@/lib/coach-logic';

const insights = analyzeProgress(userHistoryArray, userLiftsArray);
// Returns: [{ type: 'LEAP', lift: 'SQUAT', message: '...', actionable: true }]
```

### 5. `calculatePlates` (Visual Barbell Math)
**Path:** `@/lib/iron-logic`
**Usage:** Determines the exact plate configuration for one side of the barbell.
```typescript
import { calculatePlates } from '@/lib/iron-logic';

const platesNeeded = calculatePlates(315);
// Returns: [45, 45, 45] (Per side, assuming 45lb bar)
```

## 🏗️ State Management Notes
* **Local Fallback:** `localStorage.getItem('iron-mind-history')` and `localStorage.getItem('iron-mind-lifts')` are used for Guest accounts and offline resiliency.
* **Global State:** The primary state loop (active tab, selected lift) is managed at the root of `src/components/TrainingDashboard.tsx` in the `AppContent` export.
