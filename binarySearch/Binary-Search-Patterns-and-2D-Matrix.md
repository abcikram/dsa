# Binary Search Patterns — Boundaries, Pointers, and 2D Matrix Search

These notes explain how to recognize binary-search problems, what `left` and `right` mean, why some solutions use `left <= right` while others use `left < right`, and how to choose the right approach for a sorted matrix.

> Main idea: Binary search is not just a way to find a number. It is a way to repeatedly eliminate half of a **sorted search space**.

---

## 1. How do I recognize a Binary Search problem?

Look for these clues:

1. The input or search space is **sorted**.
2. The question asks to find a target, a boundary, a minimum/maximum feasible value, or the first/last position satisfying a condition.
3. You can decide whether to move left or right by checking the middle element.
4. A brute-force scan is possible, but a logarithmic solution is expected.

Common wording:

- Search for a target in a sorted array.
- Find the first or last occurrence.
- Find the insertion position.
- Find the minimum possible capacity / speed / time that works.
- Find the smallest value for which a condition becomes true.

Important: Binary search needs a **monotonic decision**. As you move through the search space, the answer should change in only one direction, such as:

`false, false, false, true, true, true`

or

`true, true, true, false, false, false`

If there is no sorted order or monotonic property, ordinary binary search may not apply.

---

## 2. What do left and right actually mean?

`left` and `right` are boundaries of the part of the search space that has not been eliminated yet.

For a normal exact-search implementation, we use a **closed interval**:

`[left, right]`

Both endpoints are included. Therefore, if `left === right`, one candidate still remains.

Example:

```text
index:  0  1  2  3  4
value:  1  3  5  7  9
        ^           ^
      left        right
```

- If the middle value is smaller than the target, the middle and everything before it can be eliminated. Set `left = mid + 1`.
- If the middle value is larger than the target, the middle and everything after it can be eliminated. Set `right = mid - 1`.
- If they are equal, the target is found.

Why use `mid + 1` and `mid - 1`? Because we already checked `mid`. Keeping it in the next search range would not make progress and could cause an infinite loop.

---

## 3. Why `while (left <= right)` instead of `left < right`?

For the **closed interval** `[left, right]`, use:

```ts
while (left <= right) {
  // ...
}
```

The condition means: continue while at least one candidate remains.

- `left < right`: at least two indices remain.
- `left === right`: exactly one index remains.
- `left > right`: no candidate remains.

### Example: target is the final element

Array: `[1, 3, 5, 7, 9]`, target: `9`.

| Step | left | right | mid | value |
|---|---:|---:|---:|---:|
| 1 | 0 | 4 | 2 | 5 |
| 2 | 3 | 4 | 3 | 7 |
| 3 | 4 | 4 | 4 | 9 |

After step 2, only index 4 remains.

With `left < right`, the condition becomes `4 < 4`, which is false. The last element is never checked.

With `left <= right`, `4 <= 4` is true, so index 4 is checked.

**Important:** `left < right` is not always wrong. It is used in other binary-search templates, but the boundary updates and final check must match that template. Never change only the loop condition without changing the rest of the algorithm consistently.

---

## 4. Middle index calculation

Preferred safe expression:

```ts
const mid = Math.floor(left + (right - left) / 2);
```

This avoids potential overflow in languages with fixed-size integer types.

This expression is mathematically equivalent:

```ts
const mid = Math.floor((left + right) / 2);
```

In our earlier code, this also gives the same midpoint:

```ts
Math.floor(left - (left - right) / 2)
```

But the first form is easier to read and is the common interview convention.

---

## 5. Pattern A — Exact search (closed interval)

**Use when:** You need to return whether a target exists, or return its index.

Interval: `[left, right]` — both endpoints are included.

```ts
function binarySearch(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}
```

**Why these updates?**

- `nums[mid] < target`: target can only be to the right, so discard `mid` and the left side.
- `nums[mid] > target`: target can only be to the left, so discard `mid` and the right side.
- When `left > right`, the interval is empty and the target is absent.

Complexity: Time `O(log n)`; extra space `O(1)`.

---

## 6. Pattern B — Lower bound (first element >= target)

**Use when:** You need the insertion position, the first element greater than or equal to a target, or the first index where a monotonic condition becomes true.

This template uses a **half-open interval**:

`[left, right)`

The left endpoint is included; the right endpoint is excluded. Initialize `right = nums.length`, because the answer can be `nums.length` when every element is smaller than the target.

```ts
function lowerBound(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length;

  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left;
}
```

At the end, `left` is the first index whose value is `>= target`, or `nums.length` if no such index exists.

Notice the differences from exact search:

- Loop: `left < right`
- When the middle is too small: `left = mid + 1`
- Otherwise: `right = mid` (not `mid - 1`), because `mid` might itself be the answer.

Example: `[1, 3, 3, 5, 9]`, target `3` → lower bound is index `1`.

---

## 7. Pattern C — Upper bound (first element > target)

**Use when:** You need the first element strictly greater than the target, or want to calculate the range of duplicate values.

```ts
function upperBound(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length;

  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (nums[mid] <= target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left;
}
```

For `[1, 3, 3, 5, 9]`, target `3` → upper bound is index `3`, the position of `5`.

Useful formulas:

- First occurrence of target = `lowerBound(nums, target)`, if that index contains target.
- Last occurrence = `upperBound(nums, target) - 1`, if that index is valid and contains target.
- Number of occurrences = `upperBound(nums, target) - lowerBound(nums, target)`.

---

## 8. Pattern D — Binary search on the answer (first true)

Sometimes the answer is not an array index. It may be a speed, capacity, distance, or number of days.

If a condition is monotonic:

```text
candidate:  1  2  3  4  5  6  7
works?:     F  F  F  T  T  T  T
                     ^
               first true
```

Find the smallest candidate that works:

```ts
function firstTrue(left: number, right: number): number {
  // Assumption: the range contains at least one true value.
  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (isFeasible(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}
```

Here `isFeasible` is problem-specific.

Why `right = mid`? Because if `mid` works, the first working answer could be `mid` itself or something smaller. We must keep `mid` as a candidate.

For the largest value that works, the decision direction and midpoint rounding are different. Learn that as a separate template rather than blindly reversing one line.

---

## 9. How to choose a binary-search pattern

| Problem asks for | Common pattern | Loop |
|---|---|---|
| Does target exist? / target index | Exact search, closed interval | `left <= right` |
| First value >= target | Lower bound | `left < right` |
| First value > target | Upper bound | `left < right` |
| First candidate that works | First true / answer search | `left < right` |
| Last candidate that works | Last true (careful midpoint) | Usually `left < right` |

Do not memorize only the loop condition. Memorize the **interval definition + update rules + stopping condition together**.

---

# 10. Search in a 2D Matrix

Before choosing an approach, read the matrix's sorting guarantee carefully. Different questions that look similar need different algorithms.

## Approach 1 — Treat the matrix as one sorted 1D array

Use this when:

- Every row is sorted left to right.
- The first element of each row is greater than the last element of the previous row.

Example:

```text
[
  [ 1,  3,  5,  7],
  [10, 11, 16, 20],
  [23, 30, 34, 60]
]
```

The matrix behaves like this sorted sequence:

```text
[1, 3, 5, 7, 10, 11, 16, 20, 23, 30, 34, 60]
```

We do not need to create this 1D array. We use a virtual index from `0` to `rows * cols - 1`.

### Convert virtual 1D index into 2D coordinates

Let `mid` be the virtual 1D index and `cols` be the number of columns.

```ts
const row = Math.floor(mid / cols);
const col = mid % cols;
const value = matrix[row][col];
```

Example: 3 columns, `mid = 4`.

- `row = Math.floor(4 / 3) = 1`
- `col = 4 % 3 = 1`
- Element = `matrix[1][1]`

Why does this work?

- Each complete row contains `cols` elements.
- `Math.floor(mid / cols)` tells how many complete rows fit before this index.
- `mid % cols` tells the offset inside the current row.

### Correct TypeScript solution

```ts
function searchMatrix(matrix: number[][], target: number): boolean {
  if (matrix.length === 0 || matrix[0].length === 0) {
    return false;
  }

  const rows = matrix.length;
  const cols = matrix[0].length;

  let left = 0;
  let right = rows * cols - 1;

  // Closed interval: [left, right]
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    const currentRow = Math.floor(mid / cols);
    const currentCol = mid % cols;
    const current = matrix[currentRow][currentCol];

    if (current === target) {
      return true;
    } else if (current < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return false;
}
```

Complexity:

- Time: `O(log(rows * cols))`
- Extra space: `O(1)`

### Mistakes from the first implementation

1. **Row and column were swapped.** Correct is `row = Math.floor(mid / cols)`, `col = mid % cols`.
2. **The loop used `left < right`.** With the closed interval and `mid +/- 1` updates, use `left <= right` so the last candidate is checked.
3. **The midpoint expression was unnecessarily hard to read.** Prefer `left + Math.floor((right - left) / 2)` or `Math.floor(left + (right - left) / 2)`.
4. **The matrix should be checked for empty input** before reading `matrix[0].length`.

---

## Approach 2 — Binary search each row

Use this when each row is sorted, but the matrix is **not guaranteed to be globally sorted** from one row to the next.

For every row, run ordinary binary search.

```ts
function searchEachRow(matrix: number[][], target: number): boolean {
  for (const row of matrix) {
    let left = 0;
    let right = row.length - 1;

    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2);

      if (row[mid] === target) return true;
      if (row[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
  }

  return false;
}
```

Complexity for `rows = m`, `cols = n`:

- Time: `O(m log n)`
- Extra space: `O(1)`

This is valid when rows are individually sorted. It does not need the first element of a row to be greater than the previous row's last element.

---

## Approach 3 — Staircase search from top-right

Use this when:

- Every row is sorted from left to right.
- Every column is sorted from top to bottom.
- But the entire matrix is not necessarily sorted in row-major order.

Example:

```text
[
  [ 1,  4,  7, 11],
  [ 2,  5,  8, 12],
  [ 3,  6,  9, 16],
  [10, 13, 14, 17]
]
```

Start at the top-right corner:

- If current value equals target → found.
- If current value is greater than target → move left (remove the current column).
- If current value is smaller than target → move down (remove the current row).

```ts
function searchMatrixStaircase(
  matrix: number[][],
  target: number
): boolean {
  if (matrix.length === 0 || matrix[0].length === 0) {
    return false;
  }

  let row = 0;
  let col = matrix[0].length - 1;

  while (row < matrix.length && col >= 0) {
    const current = matrix[row][col];

    if (current === target) return true;
    if (current > target) col--;
    else row++;
  }

  return false;
}
```

Complexity:

- Time: `O(rows + cols)`
- Extra space: `O(1)`

Why move in those directions?

At the top-right:
- Everything below is greater than or equal to the current value (column sorted).
- Everything to the left is smaller than or equal to the current value (row sorted).

So one comparison eliminates an entire row or column.

---

## 11. Which 2D matrix approach should I use?

| Sorting guarantee | Best approach |
|---|---|
| Rows sorted AND each next row starts after previous row ends | Virtual 1D binary search |
| Each row sorted, no global row ordering guarantee | Binary search each row |
| Rows and columns sorted independently | Staircase search |

**Do not assume all matrix-search questions have the same sorting guarantee.** Read the statement first.

---

## 12. A practical checklist before coding

1. What exactly is sorted: the whole array, each row, each column, or the answer space?
2. Am I searching for an exact value or a boundary?
3. Is my interval closed `[left, right]` or half-open `[left, right)`?
4. Does the loop condition match that interval?
5. Have I already checked `mid` before removing it?
6. Do my updates always make progress?
7. What happens when one candidate remains?
8. What happens when the target is absent, smaller than all values, or larger than all values?
9. Have I handled empty input and duplicates where relevant?
10. Can I explain why half of the remaining search space is impossible after each comparison?

---

## 13. Practice order

Learn and implement these in order:

1. Exact binary search in a sorted array.
2. Search Insert Position (lower bound).
3. First and last position of an element in a sorted array.
4. Search in a 2D Matrix (virtual 1D array).
5. Search a 2D Matrix II (staircase search).
6. First true / minimum feasible answer problems.
7. Last true / maximum feasible answer problems.

For each problem, first explain the sorted or monotonic property in plain language. Then define what `left` and `right` represent. Only after that, write the loop.

---

## Final takeaway

- `left` and `right` describe the remaining search space.
- Closed interval `[left, right]` + `mid + 1` / `mid - 1` → normally `while (left <= right)`.
- Half-open interval `[left, right)` + boundary-preserving updates → normally `while (left < right)`.
- The loop condition cannot be chosen independently from the interval and update rules.
- For a flattened matrix: `row = Math.floor(index / cols)`, `col = index % cols`.
- Recognize the sorting guarantee before selecting a matrix-search approach.
