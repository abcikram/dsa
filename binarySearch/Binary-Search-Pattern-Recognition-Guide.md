# Binary Search — Pattern Recognition & Interview Guide

This guide brings together the binary-search patterns used across the problems in this folder. The goal is not to memorize solutions. The goal is to recognize **when binary search applies, which pattern to choose, and what condition moves the search boundaries**.

---

## 1. First question: can I eliminate half of the search space?

Binary search is useful when you can make a decision at the middle and safely discard one side.

Look for one of these properties:

1. **Sorted data** — values are in ascending or descending order.
2. **Monotonic condition** — once a condition becomes true, it stays true (or once false, stays false).
3. **One-direction movement** — comparing the middle with a neighbor tells you which direction can contain the answer.
4. **Rotated sorted data** — the original order is rotated, but at least one half remains sorted (for distinct values).

A keyword is only a clue. Always prove that the search space is ordered or that your decision is monotonic.

---

## 2. Recognition cheat sheet

| Problem wording / clue | Likely pattern | What to search |
|---|---|---|
| Find target in sorted array | Classic Binary Search | Exact index |
| Search in ascending/descending sorted data | Classic Binary Search | Exact index |
| Insert position / first position where value is not smaller | Lower Bound | First index with value >= target |
| First occurrence / first value satisfying a condition | First True / Lower Bound | Leftmost valid position |
| Last occurrence / last value satisfying a condition | Last True / Upper Bound variant | Rightmost valid position |
| Minimum feasible value / minimum days / smallest speed or divisor | Binary Search on Answer | First valid answer |
| Maximum possible minimum / maximum feasible capacity or distance | Binary Search on Answer | Last valid answer |
| Sorted array rotated around a pivot | Rotated Array Search | Which half is sorted? |
| Find minimum in rotated sorted array | Rotated Minimum | Which side can contain the minimum? |
| Peak / local maximum | Peak Binary Search | Which neighbor is higher? |
| Matrix globally sorted as one sequence | Flattened 2D Binary Search | Virtual 1D index |
| Rows or columns individually sorted | Row/column binary search or staircase search | Use the matrix's exact ordering |
| A condition changes from false to true | First True | Boundary of transition |

**Important:** Words such as *minimum*, *maximum*, *first*, or *last* do not automatically mean binary search. You still need a monotonic or ordered property.

---

## 3. Pattern A — Classic Binary Search (exact match)

### Recognition clues

- The input array is sorted.
- The question asks whether a target exists or asks for its index.
- You can compare the middle element directly with the target.

### Template: closed interval [low, high]

```ts
function binarySearch(nums: number[], target: number): number {
  let low = 0;
  let high = nums.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);

    if (nums[mid] === target) return mid;

    if (nums[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}
```

### Why `low <= high`?

The interval is closed: both endpoints are candidates. If `low === high`, one candidate remains and must still be checked.

### Boundary updates

- `low = mid + 1`: middle is checked and too small; discard it and everything before it.
- `high = mid - 1`: middle is checked and too large; discard it and everything after it.

**Typical complexity:** O(log n) time, O(1) extra space.

---

## 4. Pattern B — Lower Bound (first position that satisfies a condition)

### Recognition clues

- Insert position.
- First occurrence.
- First element greater than or equal to target.
- First index where a condition becomes true.
- The question asks for the *leftmost* valid answer.

### Definition

Lower bound is the first index `i` where:

```ts
nums[i] >= target
```

If no element satisfies it, the answer is `nums.length`.

### Template: half-open interval [low, high)

```ts
function lowerBound(nums: number[], target: number): number {
  let low = 0;
  let high = nums.length;

  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);

    if (nums[mid] >= target) {
      high = mid;       // mid may be the first valid answer
    } else {
      low = mid + 1;    // mid is definitely too small
    }
  }

  return low;
}
```

Notice that we use `high = mid`, not `mid - 1`, because `mid` may be the answer.

---

## 5. Pattern C — Upper Bound / last valid position

### Recognition clues

- Last occurrence.
- Last element less than or equal to target.
- Rightmost index that satisfies a condition.

Upper bound is commonly defined as the first index where `nums[i] > target`. Therefore:

- First index `> target` = upper bound.
- Last index `<= target` = upper bound - 1.

### Template: first index where condition becomes true

```ts
function upperBound(nums: number[], target: number): number {
  let low = 0;
  let high = nums.length;

  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);

    if (nums[mid] > target) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }

  return low;
}
```

For the last occurrence of target, calculate lower bound and upper bound, then check whether the range contains target.

---

## 6. Pattern D — Binary Search on Answer (feasibility / monotonic predicate)

### Recognition clues

The question asks for an answer such as:

- Minimum number of days.
- Minimum speed or smallest divisor.
- Minimum capacity.
- Maximum minimum distance.
- Minimum time to complete a task.

The answer itself may not be in an array. Instead, you search a numeric range of possible answers.

### The key idea: build a feasibility function

Ask:

> If I try answer = mid, can I complete the task?

Create a function such as:

```ts
isPossible(mid): boolean
```

Then prove its result is monotonic.

For a **minimum valid answer**, the pattern often looks like:

```text
mid too small       | mid valid
false false false   | true true true
                    ^
              first true
```

If `mid` is valid, try a smaller answer. If it is invalid, try a larger answer.

### Template: minimum valid answer (first true)

```ts
function minimumValidAnswer(low: number, high: number): number {
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);

    if (isPossible(mid)) {
      high = mid;       // valid; mid may be the minimum
    } else {
      low = mid + 1;    // invalid; need a larger answer
    }
  }

  return low;
}
```

### Template: maximum valid answer (last true)

```ts
function maximumValidAnswer(low: number, high: number): number {
  while (low < high) {
    const mid = low + Math.ceil((high - low) / 2);

    if (isPossible(mid)) {
      low = mid;        // valid; try a larger answer
    } else {
      high = mid - 1;   // invalid; move smaller
    }
  }

  return low;
}
```

For the maximum template, use the **upper midpoint** (`Math.ceil`) so the loop cannot get stuck when `low + 1 === high`.

### How to build `isPossible(mid)`

1. Decide what the candidate answer `mid` represents.
2. Simulate or calculate whether the task can be completed using that answer.
3. Return `true` if it is feasible; otherwise return `false`.
4. Check that feasibility changes in only one direction as `mid` increases.

### Examples from this folder

**Minimum Number of Days to Make Bouquets**

- Search space: minimum bloom day to maximum bloom day.
- `isPossible(day)`: can we make at least `m` bouquets using `k` adjacent flowers?
- If possible, fewer days might work: search left.
- If impossible, we need more days: search right.
- Pattern: minimum valid answer / first true.

**Smallest Divisor Given a Threshold**

- Search space: divisor from 1 to `max(nums)`.
- `isPossible(divisor)`: is the sum of `ceil(nums[i] / divisor)` <= threshold?
- A larger divisor makes the sum stay the same or decrease.
- If valid, try a smaller divisor; otherwise increase it.
- Pattern: minimum valid answer / first true.

### Complexity

If the answer range has size R and each feasibility check costs O(n), total time is typically O(n log R). Extra space depends on the feasibility function; often O(1).

---

## 7. Pattern E — Rotated Sorted Array

### Recognition clues

- The array was sorted, then rotated.
- Example: `[4, 5, 6, 7, 0, 1, 2]`.
- The question asks to search for a target or find the minimum.

### E1. Search in Rotated Sorted Array (distinct values)

At least one half is sorted.

```ts
function searchRotated(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] === target) return mid;

    // Left half is sorted
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    // Right half is sorted
    else {
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}
```

**Recognition / decision steps:**

1. Check whether `nums[mid]` is the target.
2. If `nums[left] <= nums[mid]`, the left half is sorted.
3. Check whether target lies inside that half's range.
4. Otherwise, the right half is sorted; check its range.
5. Discard the half that cannot contain target.

This standard version assumes distinct values. Duplicates can make it impossible to identify the sorted half from these comparisons alone.

### E2. Find Minimum in Rotated Sorted Array (distinct values)

Compare the middle value with the rightmost value.

```ts
function findMin(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] > nums[right]) {
      left = mid + 1;  // minimum is strictly to the right
    } else {
      right = mid;     // mid may itself be the minimum
    }
  }

  return nums[left];
}
```

Why `right = mid`? The middle element may be the minimum, so do not discard it.

---

## 8. Pattern F — Peak Element (neighbor comparison)

### Recognition clues

- Find a peak or local maximum.
- A peak is greater than its neighboring elements.
- You do not need to find a globally maximum value.
- Comparing `nums[mid]` and `nums[mid + 1]` tells you which direction has a peak.

### Template

```ts
function findPeakElement(nums: number[]): number {
  let low = 0;
  let high = nums.length - 1;

  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);

    if (nums[mid] < nums[mid + 1]) {
      low = mid + 1;   // ascending slope; a peak exists to the right
    } else {
      high = mid;      // descending slope; mid may be a peak
    }
  }

  return low;
}
```

This is a convergence pattern. We use `low < high`; when both pointers meet, the remaining index is a peak.

**Key distinction:** This is not exact target search. We follow the slope to a peak.

---

## 9. Pattern G — Binary Search in a 2D Matrix

First identify what ordering the matrix guarantees. Not every sorted matrix supports the same binary-search approach.

### G1. Entire matrix is globally sorted

Recognition clue: every row is sorted, and the first element of each row is greater than the last element of the previous row.

Treat the matrix as a virtual 1D sorted array of length `rows * cols`.

```ts
function searchMatrix(matrix: number[][], target: number): boolean {
  const rows = matrix.length;
  if (rows === 0) return false;

  const cols = matrix[0].length;
  if (cols === 0) return false;

  let low = 0;
  let high = rows * cols - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);

    const row = Math.floor(mid / cols);
    const col = mid % cols;
    const value = matrix[row][col];

    if (value === target) return true;
    if (value < target) low = mid + 1;
    else high = mid - 1;
  }

  return false;
}
```

Index conversion:

- `row = Math.floor(mid / cols)`
- `col = mid % cols`

Time: O(log(rows * cols)); extra space: O(1).

### G2. Rows or columns are sorted independently

Do not automatically flatten the matrix. Flattening is valid only if the global ordering condition above is guaranteed.

Depending on the exact guarantee, use:
- Binary search in each row: O(rows * log(cols)).
- Binary search in each column: O(cols * log(rows)).
- Staircase traversal from a suitable corner: often O(rows + cols).

**Recognition clue:** Read the matrix constraints carefully: globally sorted is different from rows/columns individually sorted.

---

## 10. Pattern H — First True / transition point

This is the underlying idea behind many lower-bound and answer-search problems.

Suppose a condition looks like:

```text
false false false true true true
                  ^
              first true
```

Find the first index or value where the predicate becomes true.

Examples:
- First index where `nums[i] >= target`.
- Earliest day when enough bouquets can be made.
- Smallest divisor that satisfies a threshold.

The key is to write the predicate clearly and prove its monotonic direction before coding.

---

## 11. Choosing the loop condition and boundary updates

Do not memorize `while (low <= high)` or `while (low < high)` in isolation. Choose the interval definition first.

| Goal / interval style | Loop | Typical updates | End result |
|---|---|---|---|
| Exact match, closed interval [low, high] | `low <= high` | `low = mid + 1`, `high = mid - 1` | Return when found; otherwise not found |
| First true / lower bound, half-open [low, high) | `low < high` | `high = mid`, `low = mid + 1` | `low` is first true |
| Minimum in rotated array | `low < high` | `high = mid` or `low = mid + 1` | `low` is minimum index |
| Peak convergence | `low < high` | `high = mid` or `low = mid + 1` | `low` is a peak index |
| Maximum true / last valid | `low < high` | upper mid; `low = mid` or `high = mid - 1` | `low` is last true |

### The three questions to ask before writing a loop

1. Is `mid` already checked and therefore safe to discard? If yes, updates often use `mid + 1` or `mid - 1`.
2. Could `mid` still be the answer? If yes, keep it with `low = mid` or `high = mid`.
3. What does the interval represent: candidates to test, or a boundary that is converging?

---

## 12. A practical recognition decision tree

Use this in an interview:

1. **Is the input sorted?**
   - Yes, and I need an exact value/index → Classic Binary Search.
   - Yes, and I need first/last position → Lower Bound / Upper Bound.
   - It is rotated → Rotated Array pattern.
   - It is a matrix → Check whether it is globally sorted or only row/column sorted.

2. **Is the answer a number in a range rather than an array element?**
   - Can I write `isPossible(x)`?
   - Does feasibility move only one way as x increases?
   - Yes → Binary Search on Answer.

3. **Am I looking for a local peak?**
   - Compare middle with its neighbor → Peak pattern.

4. **Can I prove that one side is impossible after checking mid?**
   - If not, binary search may not be the right algorithm.

---

## 13. Common mistakes checklist

- [ ] Using binary search without proving sortedness or monotonicity.
- [ ] Using `low < high` for exact search and accidentally skipping the final candidate.
- [ ] Using `low <= high` with boundary updates that do not shrink the interval.
- [ ] Forgetting that `mid` may still be the answer, then incorrectly using `mid - 1` or `mid + 1`.
- [ ] In rotated search, identifying the sorted half but forgetting to check whether target is inside its boundaries.
- [ ] In answer search, failing to prove that `isPossible(mid)` is monotonic.
- [ ] Choosing incorrect minimum/maximum bounds for the answer space.
- [ ] Using a flattened 2D search when the matrix is not globally sorted.
- [ ] Forgetting empty input and edge cases.
- [ ] Using a lower midpoint in a last-true template, which can cause an infinite loop.

---

## 14. Quick interview language

You can explain your approach like this:

**Classic search:** "The array is sorted, so I compare the target with the middle element and discard the half that cannot contain it."

**Lower bound:** "I am looking for the first position satisfying a monotonic condition, so I keep the middle when it may still be the answer."

**Binary search on answer:** "I define a feasibility check for a candidate answer. Since feasibility is monotonic, I binary-search for the first or last valid candidate."

**Rotated search:** "At least one half is sorted. I identify that half, check whether the target lies inside its range, and discard the other half."

**Peak:** "The slope between the middle and its right neighbor tells me which side contains a peak, so I converge on a peak index."

---

## 15. Problems currently represented in this folder

| File / problem | Main concept |
|---|---|
| `search2Dmatrix.ts` | Classic binary search on a virtual 1D matrix |
| `searchInRotatedSortedArray.md` / `.ts` | Rotated sorted array search |
| `findMinimumInRotatedSortedArray.md` | Minimum in rotated sorted array |
| `findPeakelem.ts` | 1D peak using neighbor comparison |
| `FindThePeakELem2Dmat.ts` | 2D peak using binary search on columns |
| `MinimumNumberofDaystoMakemBouquets.ts` | Binary search on answer / first feasible day |
| `smallestDivisor.ts` | Binary search on answer / smallest feasible divisor |
| `count_negetive_num_in_sorted_matrix.ts` | Staircase traversal / two pointers (not binary search in the current optimal implementation) |

**Study order:** Classic search → lower/upper bound → 2D globally sorted matrix → rotated search → rotated minimum → peak → binary search on answer.

The most important habit: before coding, state what `low`, `high`, and `mid` mean, what condition you are checking, and why the discarded half cannot contain the answer.
