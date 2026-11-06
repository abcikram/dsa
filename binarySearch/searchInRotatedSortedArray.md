# Search in Rotated Sorted Array

**Problem:** Given an array of distinct integers sorted in ascending order and then rotated, return the index of `target`. Return `-1` if it does not exist.

Example:

```ts
nums = [4, 5, 6, 7, 0, 1, 2];
target = 0;
// answer: 4
```

## 1. Recognize the pattern

The array was sorted before rotation. After rotation, it looks like two sorted portions:

```text
[4, 5, 6, 7 | 0, 1, 2]
```

At every binary-search iteration, **at least one half is sorted** (the standard problem assumes distinct values).

The strategy is:

1. Find the middle.
2. Identify which half is sorted.
3. Check whether the target belongs to that sorted half.
4. Keep the half that can contain the target and discard the other half.

Do not decide which side to move to by comparing only `nums[mid]` and `nums[left]`. You must also check where the target lies.

---

## 2. Why use `nums[left] <= nums[mid]`?

If the leftmost value is less than or equal to the middle value, the interval from `left` to `mid` is sorted.

Example:

```text
[4, 5, 6, 7, 0, 1, 2]
 L        M           R
```

Here, `nums[left] = 4` and `nums[mid] = 7`, so the left half is sorted.

The target is inside this sorted range only if:

```ts
target >= nums[left] && target < nums[mid]
```

- If true, search left: `right = mid - 1`.
- Otherwise, search right: `left = mid + 1`.

Why is the upper comparison strict (`target < nums[mid]`)? We already checked `nums[mid]` for equality. If target equalled it, we would have returned.

---

## 3. What if the right half is sorted?

If:

```ts
nums[left] > nums[mid]
```

then the right half from `mid` to `right` is sorted.

Example:

```text
[6, 7, 0, 1, 2, 4, 5]
 L     M           R
```

The target belongs to the sorted right range when:

```ts
target > nums[mid] && target <= nums[right]
```

- If true, search right: `left = mid + 1`.
- Otherwise, search left: `right = mid - 1`.

The lower comparison is strict because `nums[mid]` was already checked.

---

## 4. Complete TypeScript solution

```ts
function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (nums[mid] === target) {
      return mid;
    }

    // Case 1: Left half is sorted.
    if (nums[left] <= nums[mid]) {
      // Is target inside the sorted left half?
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    // Case 2: Right half is sorted.
    else {
      // Is target inside the sorted right half?
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

This implementation assumes distinct values, as specified by the standard problem. Duplicates make the sorted-half identification ambiguous in some cases and require additional handling.

---

## 5. Dry run

Input:

```ts
nums = [4, 5, 6, 7, 0, 1, 2];
target = 0;
```

| Iteration | left | right | mid | nums[mid] | Decision |
|---|---:|---:|---:|---:|---|
| 1 | 0 | 6 | 3 | 7 | Left half sorted; target is not in [4, 7), search right |
| 2 | 4 | 6 | 5 | 1 | Left half [0, 1] sorted; target is in [0, 1), search left |
| 3 | 4 | 4 | 4 | 0 | Target found |

Return index `4`.

---

## 6. Why `while (left <= right)`?

This is an **exact target search**. We use a closed interval `[left, right]`, and each update removes `mid` after checking it:

- `left = mid + 1`
- `right = mid - 1`

When `left === right`, one candidate remains and still needs to be checked. Therefore the loop condition is:

```ts
while (left <= right)
```

This is different from **Find Minimum in Rotated Sorted Array**:

| Problem | Goal | Loop | Important update |
|---|---|---|---|
| Search in Rotated Sorted Array | Find target index | `left <= right` | `mid + 1` or `mid - 1` |
| Find Minimum in Rotated Sorted Array | Narrow to minimum | `left < right` | `mid + 1` or `mid` |

For finding the minimum, `mid` may still be the answer, so we keep it with `right = mid`. For exact search, we already checked `mid`, so we can discard it.

---

## 7. What's wrong with the initial attempt?

The initial logic was:

```ts
if (nums[mid] === target) return mid;
else if (nums[mid] < nums[left]) {
  right = mid - 1;
} else {
  left = mid + 1;
}
```

Problems:

1. It checks the relationship between `nums[mid]` and `nums[left]`, but does not determine whether the target is inside the sorted half.
2. If the left half is sorted, the target may still be in the right half. If the right half is sorted, the target may still be in the left half.
3. `while (left < right)` skips the final remaining candidate in this exact-search template. Use `left <= right`.
4. The midpoint calculation is fine; the main issue is the decision logic.

---

## 8. Complexity

- **Time:** `O(log n)` — each iteration eliminates about half the remaining search space.
- **Extra space:** `O(1)` — iterative binary search uses constant extra memory.

## 9. Interview explanation

"Because the array was sorted and then rotated, at least one half around the middle is always sorted. I first check whether the left half is sorted. If it is, I check whether the target lies between the left boundary and the middle. If it does, I search left; otherwise, I search right. If the left half is not sorted, the right half must be sorted, so I check whether the target lies in that range. I repeat until the target is found or the search interval becomes empty."

## 10. Pattern checklist

Before coding, ask:

1. Is the array rotated and made from a sorted array?
2. Are duplicate values allowed? (This standard solution assumes no duplicates.)
3. Which half is sorted?
4. Does the target fall inside that sorted half?
5. Have I checked `mid` for equality first?
6. Does the interval still include the last untested candidate?

**Core pattern:** Identify the sorted half → check target range → discard the impossible half.


---

## 11. Reviewing the revised implementation: one missing boundary check

A common almost-correct version checks only that the right half is sorted and that the target is greater than the middle:

```ts
if (nums[mid] <= nums[right] && target > nums[mid]) {
  left = mid + 1;
} else {
  right = mid - 1;
}
```

This is incomplete. The target must be **inside the entire sorted right-half range**, not merely greater than `nums[mid]`.

Use:

```ts
if (target > nums[mid] && target <= nums[right]) {
  left = mid + 1;
} else {
  right = mid - 1;
}
```

Why check `target <= nums[right]`? A target larger than the right boundary cannot exist in that sorted half, so we must search the left half instead.

Also note that `nums[mid] <= nums[right]` is a way to recognize the sorted right half once the left half has been ruled out. In the implementation below, the outer `else` already establishes that the right half is sorted, so repeating that check inside is unnecessary.

### Final decision logic

| Sorted half | Target range check | Next search |
|---|---|---|
| Left | `target >= nums[left] && target < nums[mid]` | `right = mid - 1` |
| Right | `target > nums[mid] && target <= nums[right]` | `left = mid + 1` |

**Remember:** Identifying a sorted half is only step one. The target must also fall within that half's boundaries.
