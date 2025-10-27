# Level System

## Overview
The app uses a dynamic level system that adjusts your daily goal based on your performance.

## Level Progression (0-5)

| Level | Base | Daily Goal |
|-------|------|------------|
| 0 | 0 | 1 |
| 1 | 1 | 10 |
| 2 | 10 | 15 |
| 3 | 15 | 20 |
| 4 | 20 | 25 |
| 5 | 25 | 30 |

## Progression Rules

### Level Up
- Complete your daily goal for **3 consecutive days**
- Advances to next level (max: Level 5)
- Daily goal increases

### Level Down
- Fail to meet your level's **base** for **3 consecutive days**
- Drops to previous level (min: Level 0)
- Daily goal decreases

### Example
```
Days 1-3: Complete 10+ approaches → Level up to 2
Level 2: New goal is 15 approaches
Days 4-6: Complete 15+ approaches → Level up to 3
Level 3: New goal is 20 approaches

If you do less than 15 approaches for 3 days → Level down to 2
If you do less than 10 approaches for 3 days → Level down to 1
```

## Streak System

### Fire Icons 🔥
- **2+ consecutive days** meeting goal → 2 fire icons
- **3+ consecutive days** meeting goal → 3 fire icons
- Displayed next to level in top bar

### Streak Calculation
- Counts backwards from yesterday
- Today's progress doesn't affect streak until tomorrow
- Resets when you miss a day's goal

## Testing Mode

You can override the level system for testing:

```typescript
// In constants/index.ts
export const App = {
  currentLevel: null, // null = automatic (system-managed)
  // currentLevel: 3,  // Uncomment and set to lock level for testing
  ...
}
```

## Configuration

All thresholds are configurable in `constants/index.ts`:

```typescript
export const App = {
  currentLevel: null,
  
  levels: [
    { level: 0, base: 0, goal: 1 },
    { level: 1, base: 1, goal: 10 },
    { level: 2, base: 10, goal: 15 },
    { level: 3, base: 15, goal: 20 },
    { level: 4, base: 20, goal: 25 },
    { level: 5, base: 25, goal: 30 },
  ],
  
  streakThresholds: {
    twoFires: 2,
    threeFires: 3,
  },
}
```

