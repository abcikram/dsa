# Find Minimum in Rotated Sorted Array

**Problem:** Given an array of unique elements sorted in ascending order and then rotated between 1 and n times, return the minimum element.

Example:

```ts
nums = [3, 4, 5, 1, 2]
// answer: 1
```

---

## 1. Recognize the pattern

Ask these questions:

1. Was the array originally sorted? Yes.
2. Has it been rotated? Yes.
3. Can a comparison at the middle tell us which half may contain the minimum? Yes.

This is **Binary Search on a rotated sorted array**.

A rotation creates two individually sorted parts:

```text
[3, 4, 5 | 1, 2]
            ^
         minimum
```

We want to keep the half that must contain the minimum.

## 2. Why compare `nums[mid]` with `nums[right]`?

We compare the middle value with the rightmost value. Under the problem's guarantee of unique values, this tells us which side contains the rotation boundary (and therefore the minimum).

### Case A: `nums[mid] > nums[right]`

Example:

```text
[3, 4, 5, 1, 2]
       M        R

nums[mid] = 5
nums[right] = 2
```

The middle is in the left, higher-valued sorted portion. The minimum must be strictly to the right of `mid`.

Therefore:

```ts
left = mid + 1;
```

We can discard `mid) because it cannot be the minimum in this case.

### Case B: `nums[mid] < nums[right]`

Example:

```text
[3, 4, 5, 1, 2]
             M  R

nums[mid] = 1
nums[right] = 2
```

The range from `mid` through `right` is sorted in ascending order. Its smallest value is `nums[mid]`, but the minimum could also be somewhere to the left.

Therefore, keep `mid` as a candidate:

```ts
right = mid;
```

Do **not** use `right = mid - 1`, because `mid` itself may be the minimum.

With unique elements, equality cannot occur. If adapting the algorithm to arrays with duplicates, the equality case needs special handling (usually `right--`).

---

## 3. Why use `while (left < right)`?

Here we are not looking for an exact target. We are narrowing the range until only one possible minimum remains.

We maintain a **closed candidate interval**: `[left, right]`.

- If `left < right`, at least two candidates remain, so continue.
- If `left === right`, exactly one candidate remains. That index must contain the minimum.
- We return `nums[left]` after the loop.

This is why this pattern uses:

```ts
while (left < right)
```

Compare it with exact binary search:

| Exact target search | Find minimum in rotated array |
|---|---|
| Goal: find target or prove absent | Goal: narrow to the minimum |
| `while (left <= right)` | `while (left < right)` |
| Updates `mid + 1` or `mid - 1` | Updates `mid + 1` or `mid` |
| Can finish with empty interval | Finishes with one candidate |

The loop condition must match the interval meaning and update rules. It is not a rule that all binary searches use the same condition.

## 4. Complete TypeScript solution

```ts
function findMin(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (nums[mid] > nums[right]) {
      // Minimum is strictly to the right of mid.
      left = mid + 1;
    } else {
      // Minimum is at mid or to its left.
      right = mid;
    }
  }

  return nums[left];
}
```

This solution assumes the input is non-empty and contains unique values, as in the standard problem statement.

---

## 5. Dry run

Input:

```ts
nums = [3, 4, 5, 1, 2];
```

| Iteration | left | right | mid | nums[mid] | nums[right] | Action |
|---|---:|---:|---:|---:|---:|---|
| 1 | 0 | 4 | 2 | 5 | 2 | `5 > 2`, so `left = 3` |
| 2 | 3 | 4 | 3 | 1 | 2 | `1 < 2`, so `right = 3` |

Now `left = 3` and `right = 3`. The loop stops because only one candidate remains.

Return `nums[3] = 1`.

## 6. More examples to test the logic

### Example A — Rotated in the middle

```ts
[4, 5, 6, 7, 0, 1, 2]
// minimum = 0
```

### Example B — Only two elements

```ts
[2, 1]
// minimum = 1
```

### Example C — Not rotated

```ts
[1, 2, 3, 4, 5]
// minimum = 1
```

Even when the array is not rotated, the same algorithm works: the minimum stays in the remaining left portion until one candidate remains.

---

## 7. Complexity analysis

Let `n` be the array length.

- **Time:** `O(log n)` — the candidate range is approximately halved on each iteration.
- **Extra space:** `O(1)` — only a few variables are used.

## 8. Common mistakes

1. **Using `right = mid - 1` in Case B.** This can discard the minimum when `mid` is the minimum.
2. **Using `left = mid` in Case A.** This may fail to make progress when the interval has two elements.
3. **Using `left <= right` with these exact updates.** This is the one-candidate search template; it stops at `left === right`.
4. **Comparing with the wrong boundary without proving the logic.** This solution specifically uses `nums[right]`.
5. **Forgetting the problem's uniqueness assumption.** Duplicates require a modified equality case.

## 9. How to explain it in an interview

"I use binary search because the array was sorted and rotation divides it into two sorted portions. I compare the middle element with the rightmost element. If the middle is greater, the minimum must be after the middle, so I move left to mid plus one. Otherwise, the minimum is at the middle or before it, so I move right to mid. I continue until both pointers meet. That index contains the minimum."

## 10. Quick pattern reminder

```ts
while (left < right) {
  const mid = Math.floor(left + (right - left) / 2);

  if (nums[mid] > nums[right]) {
    left = mid + 1;
  } else {
    right = mid;
  }
}

return nums[left];
```

**Remember:** `right = mid` keeps the middle as a possible answer; `left = mid + 1` removes it only when we know the minimum is to its right.
