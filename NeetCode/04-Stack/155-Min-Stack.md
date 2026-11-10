# LeetCode 155 — Min Stack

**NeetCode category:** Stack  
**Core technique:** Design a Stack with a Running Minimum  
**Difficulty:** Medium  
**Language:** TypeScript  
**Problem:** https://leetcode.com/problems/min-stack/

---

## 1. Problem Statement

Design a stack that supports the following operations:

| Operation | Description |
|---|---|
| `push(val)` | Push `val` onto the stack. |
| `pop()` | Remove the top element. |
| `top()` | Return the top element. |
| `getMin()` | Return the minimum element currently in the stack. |

**Requirement:** Every operation must run in `O(1)` time.

The standard stack operations (`push`, `pop`, and `top`) are straightforward. The challenge is implementing `getMin()` in constant time, even after elements are removed.

---

## 2. Why Is a Normal Stack Not Enough?

Suppose we push these values:

```ts
push(5);
push(3);
push(7);
```

The stack looks like this:

```text
Top -> 7
       3
       5
```

The minimum is `3`.

We could store the current minimum in a variable:

```ts
let min = 3;
```

But what happens when we call:

```ts
pop();
```

The value `7` is removed, so the minimum is still `3`.

Now consider:

```ts
pop();
```

The value `3` is removed. The new minimum is `5`.

If we stored only one `min` variable, how would we know that the previous minimum was `5`?

We need a way to remember the minimum at every stack position.

---

## 3. Optimal Approach — Store the Minimum with Every Value

Instead of storing only the actual value, store a pair for every pushed element:

```ts
[value, minimumSoFar]
```

- `value` is the actual element pushed onto the stack.
- `minimumSoFar` is the minimum value among all elements from the bottom of the stack up to this entry.

For example:

```ts
push(1);
push(2);
push(0);
```

The internal stack becomes:

```ts
[
  [1, 1],
  [2, 1],
  [0, 0]
]
```

Each pair means:

| Entry | Actual value | Minimum so far |
|---|---:|---:|
| `[1, 1]` | 1 | 1 |
| `[2, 1]` | 2 | 1 |
| `[0, 0]` | 0 | 0 |

The top entry is `[0, 0]`, so the current minimum is `0`.

If we call `pop()`, `[0, 0]` is removed. The new top becomes `[2, 1]`, so the minimum automatically becomes `1`.

We do not need to recalculate the minimum. The previous minimum was already saved in the previous entry.

---

## 4. Complete TypeScript Solution

```ts
class MinStack {
    private stack: [number, number][] = [];

    constructor() {}

    push(val: number): void {
        let currentMin: number;

        if (this.stack.length === 0) {
            currentMin = val;
        } else {
            currentMin = Math.min(val, this.getMin());
        }

        this.stack.push([val, currentMin]);
    }

    pop(): void {
        this.stack.pop();
    }

    top(): number {
        return this.stack[this.stack.length - 1][0];
    }

    getMin(): number {
        return this.stack[this.stack.length - 1][1];
    }
}
```

---

## 5. Understand Each Method

### A. Constructor and Stack Declaration

```ts
private stack: [number, number][] = [];

constructor() {}
```

We use an array as our stack.

Its type is:

```ts
[number, number][]
```

This means the array contains tuples. Each tuple stores exactly two numbers:

```ts
[value, minimumSoFar]
```

For example:

```ts
[2, 1]
```

Here:
- `2` is the actual value.
- `1` is the minimum value up to this position.

### B. `push(val)`

```ts
push(val: number): void {
    let currentMin: number;

    if (this.stack.length === 0) {
        currentMin = val;
    } else {
        currentMin = Math.min(val, this.getMin());
    }

    this.stack.push([val, currentMin]);
}
```

There are two cases.

**Case 1: The stack is empty**

The new value is automatically the minimum:

```ts
currentMin = val;
```

For example:

```ts
push(5);
```

The stack becomes:

```ts
[[5, 5]]
```

**Case 2: The stack is not empty**

Compare the new value with the previous minimum:

```ts
currentMin = Math.min(val, this.getMin());
```

For example, if the current minimum is `5` and we push `3`:

```ts
Math.min(3, 5); // 3
```

The new entry is:

```ts
[3, 3]
```

If we then push `7`:

```ts
Math.min(7, 3); // 3
```

The new entry is:

```ts
[7, 3]
```

So every entry remembers the minimum that was valid when that entry was pushed.

### C. `pop()`

```ts
pop(): void {
    this.stack.pop();
}
```

Remove the top pair.

We do not need to calculate the minimum again. Once the top pair is removed, the previous pair becomes the top, and it already contains the previous minimum.

### D. `top()`

```ts
top(): number {
    return this.stack[this.stack.length - 1][0];
}
```

Break it down:

```ts
this.stack.length - 1
```

Gets the index of the top entry.

```ts
[0]
```

Gets the first value in the pair, which is the actual stack value.

### E. `getMin()`

```ts
getMin(): number {
    return this.stack[this.stack.length - 1][1];
}
```

This is the key idea.

- `this.stack.length - 1` selects the top entry.
- `[1]` selects the second value in that pair.
- The second value is the minimum saved for the current stack state.

Therefore, the minimum of the entire current stack is always stored at the second position of the top pair.

---

## 6. Why Is the Last Pair's Second Value Always the Minimum?

This is the most important concept in this solution.

Suppose we perform:

```ts
push(5);
push(3);
push(8);
push(2);
```

The stack becomes:

```ts
[
  [5, 5],
  [3, 3],
  [8, 3],
  [2, 2]
]
```

Notice how the second value is calculated:

| Push | Calculation | Stored pair |
|---|---|---|
| `push(5)` | First value becomes the minimum | `[5, 5]` |
| `push(3)` | `Math.min(3, 5)` | `[3, 3]` |
| `push(8)` | `Math.min(8, 3)` | `[8, 3]` |
| `push(2)` | `Math.min(2, 3)` | `[2, 2]` |

The top pair is `[2, 2]`, so:

```ts
getMin(); // 2
```

Now call:

```ts
pop();
```

The top pair `[2, 2]` is removed.

The stack becomes:

```ts
[
  [5, 5],
  [3, 3],
  [8, 3]
]
```

The new top is `[8, 3]`.

Therefore:

```ts
getMin(); // 3
```

We did not recalculate the minimum after popping `2`. It was already stored in the new top pair.

**Key rule:** The second value of every pair is the minimum of the stack from the bottom up to that pair. Therefore, the second value of the current top pair is always the minimum of the entire current stack.

---

## 7. Full Dry Run — LeetCode Example

Operations:

```ts
push(1);
push(2);
push(0);
getMin();
pop();
top();
getMin();
```

| Operation | Stack after operation | Return value |
|---|---|---:|
| `push(1)` | `[[1, 1]]` | — |
| `push(2)` | `[[1, 1], [2, 1]]` | — |
| `push(0)` | `[[1, 1], [2, 1], [0, 0]]` | — |
| `getMin()` | unchanged | `0` |
| `pop()` | `[[1, 1], [2, 1]]` | — |
| `top()` | unchanged | `2` |
| `getMin()` | unchanged | `1` |

Expected output:

```ts
[null, null, null, 0, null, 2, 1]
```

`push()` and `pop()` return nothing, so the LeetCode operation output shows `null` for those calls.

---

## 8. Another Dry Run — Minimum Changes After Pop

Operations:

```ts
push(5);
push(3);
push(8);
push(2);
pop();
```

Before `pop()`:

```ts
[
  [5, 5],
  [3, 3],
  [8, 3],
  [2, 2]
]
```

After `pop()`:

```ts
[
  [5, 5],
  [3, 3],
  [8, 3]
]
```

Now:

```ts
top();    // 8
getMin(); // 3
```

The minimum changes from `2` back to `3` automatically because `[8, 3]` was already stored underneath `[2, 2]`.

---

## 9. Time and Space Complexity

Let `n` be the number of elements currently stored in the stack.

| Operation | Time Complexity | Reason |
|---|---:|---|
| `push()` | `O(1)` | Calculate one minimum and append one pair |
| `pop()` | `O(1)` | Remove the last pair |
| `top()` | `O(1)` | Read the last pair's first value |
| `getMin()` | `O(1)` | Read the last pair's second value |

**Space Complexity: `O(n)`**

Each pushed element stores one pair, so the stack uses linear space.

All four operations satisfy the problem's `O(1)` time requirement.

---

## 10. Why Not Scan the Stack in `getMin()`?

A simple but inefficient implementation might store only actual values:

```ts
private stack: number[] = [];
```

Then `getMin()` could scan every element:

```ts
getMin(): number {
    return Math.min(...this.stack);
}
```

But this takes `O(n)` time in the worst case, because it must inspect the stack's elements.

The pair-based approach stores the minimum in advance, so `getMin()` only reads the top pair and takes `O(1)` time.

---

## 11. Interview Explanation

You can explain the approach like this:

> I use a stack where each entry stores two values: the actual element and the minimum element up to that position. When pushing a new value, I calculate the minimum between the new value and the previous minimum. When popping, the previous minimum is automatically restored because it is stored in the new top entry. This allows push, pop, top, and getMin to run in O(1) time. The overall space complexity is O(n).

---

## 12. Common Mistakes

### Mistake 1: Storing only the current minimum in one variable

If the minimum element is popped, we need to know the previous minimum. A single variable does not preserve that history.

### Mistake 2: Storing only the actual value

Then `getMin()` would need to scan the stack, taking `O(n)` time.

### Mistake 3: Returning index `[0]` from `getMin()`

Incorrect:

```ts
getMin(): number {
    return this.stack[this.stack.length - 1][0];
}
```

This returns the actual top value, not the minimum.

Correct:

```ts
getMin(): number {
    return this.stack[this.stack.length - 1][1];
}
```

### Mistake 4: Forgetting to preserve the previous minimum

When pushing a larger value, keep the previous minimum:

```ts
currentMin = Math.min(val, this.getMin());
```

For example, if the current minimum is `3` and we push `8`, the new pair must be `[8, 3]`, not `[8, 8]`.

### Mistake 5: Recalculating minimum after every pop

No recalculation is necessary. The new top pair already contains the correct minimum.

---

## 13. Edge Cases

| Operations | Expected behavior |
|---|---|
| `push(-2); getMin()` | Minimum is `-2` |
| `push(3); push(3); getMin()` | Minimum is `3` |
| `push(5); push(2); pop(); getMin()` | Minimum returns to `5` |
| `push(4); push(1); push(1); pop()` | Minimum remains `1` |
| `push(-2); push(0); push(-3); getMin()` | Minimum is `-3` |
| `pop()` after the previous sequence | Minimum becomes `-2` |

The problem guarantees that `pop()`, `top()`, and `getMin()` are called only when the stack is non-empty.

---

## 14. Final Revision Checklist

- [ ] I can explain why a normal stack alone does not make `getMin()` `O(1)`.
- [ ] I understand why every entry stores `[value, minimumSoFar]`.
- [ ] I can explain why `Math.min(val, this.getMin())` is used in `push()`.
- [ ] I understand why `pop()` automatically restores the previous minimum.
- [ ] I can explain why `getMin()` reads index `[1]` of the top pair.
- [ ] I can implement all four operations in TypeScript.
- [ ] I can explain `O(1)` time for every operation and `O(n)` space.

### One-line Memory Trick

> Every stack entry remembers its own minimum. The top entry's second value is always the minimum of the current stack.