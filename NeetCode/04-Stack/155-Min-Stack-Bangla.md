# LeetCode 155 — Min Stack (বাংলা ব্যাখ্যা)

**NeetCode Category:** Stack  
**মূল Technique:** প্রতিটি Value-এর সঙ্গে Running Minimum রাখা  
**Difficulty:** Medium  
**Language:** TypeScript  
**Problem:** https://leetcode.com/problems/min-stack/

---

## 1. Problem Statement — সহজ বাংলায়

এমন একটি Stack Design করতে হবে, যেটিতে নিচের চারটি operation থাকবে:

| Operation | কাজ |
|---|---|
| `push(val)` | Stack-এর উপরে নতুন `val` যোগ করবে |
| `pop()` | Stack-এর উপরের element সরিয়ে দেবে |
| `top()` | Stack-এর উপরের element return করবে |
| `getMin()` | Stack-এর মধ্যে সবচেয়ে ছোট element return করবে |

**সবচেয়ে গুরুত্বপূর্ণ শর্ত:** প্রতিটি operation-এর Time Complexity হতে হবে `O(1)`।

সাধারণ Stack-এ `push`, `pop` এবং `top` সহজেই `O(1)` করা যায়। Challenge হলো `getMin()`-কেও `O(1)` রাখা।

---

## 2. সাধারণ Stack দিয়ে সমস্যা কোথায়?

ধরো আমরা এই values push করলাম:

```ts
push(5);
push(3);
push(7);
```

Stack দেখতে এমন হবে:

```text
Top -> 7
       3
       5
```

এখন minimum হলো `3`।

আমরা চাইলে একটি variable-এ minimum রেখে দিতে পারি:

```ts
let min = 3;
```

কিন্তু এরপর যদি:

```ts
pop();
```

করি, তাহলে `7` remove হবে। Minimum এখনও `3`।

আবার `pop()` করলে `3` remove হয়ে যাবে। তখন নতুন minimum হবে `5`।

সমস্যা হলো, শুধু একটি `min` variable রাখলে আগের minimum `5` কীভাবে মনে রাখব?

আমাদের এমন ব্যবস্থা দরকার, যাতে প্রতিটি stack position-এর minimum আগে থেকেই সংরক্ষিত থাকে।

---

## 3. Optimal Approach — প্রতিটি Value-এর সঙ্গে Minimum Store করব

শুধু actual value না রেখে প্রতিটি entry-তে দুটি value রাখব:

```ts
[value, minimumSoFar]
```

এখানে:

- `value` হলো Stack-এ push করা আসল number।
- `minimumSoFar` হলো Stack-এর bottom থেকে এই entry পর্যন্ত সবচেয়ে ছোট number।

ধরো:

```ts
push(1);
push(2);
push(0);
```

তাহলে internal stack হবে:

```ts
[
  [1, 1],
  [2, 1],
  [0, 0]
]
```

| Entry | Actual value | এখন পর্যন্ত Minimum |
|---|---:|---:|
| `[1, 1]` | 1 | 1 |
| `[2, 1]` | 2 | 1 |
| `[0, 0]` | 0 | 0 |

Stack-এর top entry হলো `[0, 0]`। তাই current minimum হলো `0`।

এখন `pop()` করলে `[0, 0]` remove হবে। নতুন top হবে `[2, 1]`। তাই minimum আবার `1` হয়ে যাবে।

Minimum আবার calculate করতে হচ্ছে না। আগের minimum আগের entry-তেই save করা ছিল।

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

## 5. প্রতিটি Method ধাপে ধাপে বুঝি

### A. Constructor এবং Stack Declaration

```ts
private stack: [number, number][] = [];

constructor() {}
```

আমরা একটি array ব্যবহার করছি Stack হিসেবে।

এর Type:

```ts
[number, number][]
```

এর মানে হলো array-এর প্রতিটি element হবে একটি tuple, যার মধ্যে ঠিক দুটি number থাকবে।

```ts
[value, minimumSoFar]
```

যেমন:

```ts
[2, 1]
```

এখানে:
- `2` হলো actual value।
- `1` হলো এই position পর্যন্ত minimum value।

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

এখানে দুটি Case আছে।

**Case 1: Stack Empty**

Stack empty হলে নতুন value-টাই minimum হবে।

```ts
currentMin = val;
```

যেমন:

```ts
push(5);
```

Stack হবে:

```ts
[[5, 5]]
```

**Case 2: Stack Empty নয়**

নতুন value এবং আগের minimum-এর মধ্যে যেটি ছোট, সেটি `currentMin` হবে।

```ts
currentMin = Math.min(val, this.getMin());
```

ধরো আগের minimum `5`, আর আমরা `3` push করলাম:

```ts
Math.min(3, 5); // 3
```

তাহলে নতুন entry:

```ts
[3, 3]
```

এবার `7` push করলে:

```ts
Math.min(7, 3); // 3
```

নতুন entry:

```ts
[7, 3]
```

অর্থাৎ নতুন value বড় হলেও আগের minimum হারিয়ে যাচ্ছে না।

### C. `pop()`

```ts
pop(): void {
    this.stack.pop();
}
```

Stack-এর top pair remove করে দিচ্ছি।

Minimum আবার calculate করার দরকার নেই। কারণ top pair remove হওয়ার পর আগের pair top-এ চলে আসবে, আর তার দ্বিতীয় value-তে আগের minimum save করা আছে।

### D. `top()`

```ts
top(): number {
    return this.stack[this.stack.length - 1][0];
}
```

এটি ভেঙে বুঝি:

```ts
this.stack.length - 1
```

এটি Stack-এর top index বের করে।

```ts
[0]
```

Top pair-এর প্রথম value return করে, অর্থাৎ actual stack value।

### E. `getMin()`

```ts
getMin(): number {
    return this.stack[this.stack.length - 1][1];
}
```

এটাই এই problem-এর সবচেয়ে গুরুত্বপূর্ণ অংশ।

- `this.stack.length - 1` → Stack-এর top entry select করে।
- `[1]` → ওই pair-এর দ্বিতীয় value নেয়।
- দ্বিতীয় value-তেই current minimum save করা আছে।

তাই Stack-এর top entry-এর দ্বিতীয় value-ই পুরো current Stack-এর minimum।

---

## 6. কীভাবে প্রতিবার Last Pair-এর Second Value-তেই Minimum পাওয়া যায়?

এটাই এই solution-এর সবচেয়ে গুরুত্বপূর্ণ concept।

ধরো আমরা চালালাম:

```ts
push(5);
push(3);
push(8);
push(2);
```

এখন Stack:

```ts
[
  [5, 5],
  [3, 3],
  [8, 3],
  [2, 2]
]
```

প্রতিটি pair-এর দ্বিতীয় value কীভাবে এসেছে দেখো:

| Operation | Calculation | Stored pair |
|---|---|---|
| `push(5)` | প্রথম value-ই minimum | `[5, 5]` |
| `push(3)` | `Math.min(3, 5)` | `[3, 3]` |
| `push(8)` | `Math.min(8, 3)` | `[8, 3]` |
| `push(2)` | `Math.min(2, 3)` | `[2, 2]` |

এখন top pair হলো `[2, 2]`।

তাই:

```ts
getMin(); // 2
```

এবার:

```ts
pop();
```

হলে `[2, 2]` remove হবে।

Stack হবে:

```ts
[
  [5, 5],
  [3, 3],
  [8, 3]
]
```

এখন নতুন top pair হলো `[8, 3]`।

তাই:

```ts
getMin(); // 3
```

খেয়াল করো, `2` remove হওয়ার পরে minimum নতুন করে calculate করতে হয়নি। `[8, 3]`-এর মধ্যে আগের minimum আগে থেকেই save করা ছিল।

**মূল নিয়ম:** প্রতিটি pair-এর দ্বিতীয় value হলো Stack-এর bottom থেকে ওই pair পর্যন্ত minimum। তাই বর্তমান top pair-এর দ্বিতীয় value সবসময় পুরো Stack-এর minimum।

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

| Operation | Operation-এর পরে Stack | Return |
|---|---|---:|
| `push(1)` | `[[1, 1]]` | — |
| `push(2)` | `[[1, 1], [2, 1]]` | — |
| `push(0)` | `[[1, 1], [2, 1], [0, 0]]` | — |
| `getMin()` | অপরিবর্তিত | `0` |
| `pop()` | `[[1, 1], [2, 1]]` | — |
| `top()` | অপরিবর্তিত | `2` |
| `getMin()` | অপরিবর্তিত | `1` |

Expected Output:

```ts
[null, null, null, 0, null, 2, 1]
```

`push()` এবং `pop()` কিছু return করে না। তাই LeetCode-এর operation output-এ এগুলোর জায়গায় `null` দেখা যায়।

---

## 8. আরেকটি Dry Run — Pop-এর পরে Minimum কীভাবে Change হয়?

Operations:

```ts
push(5);
push(3);
push(8);
push(2);
pop();
```

`pop()` করার আগে:

```ts
[
  [5, 5],
  [3, 3],
  [8, 3],
  [2, 2]
]
```

`pop()` করার পরে:

```ts
[
  [5, 5],
  [3, 3],
  [8, 3]
]
```

এখন:

```ts
top();    // 8
getMin(); // 3
```

Minimum `2` থেকে আবার `3` হলো। কারণ `[8, 3]` pair-এর মধ্যে আগের minimum আগে থেকেই রাখা ছিল।

---

## 9. Time এবং Space Complexity

ধরি, Stack-এ বর্তমানে `n`টি element আছে।

| Operation | Time Complexity | কারণ |
|---|---:|---|
| `push()` | `O(1)` | একটি minimum calculate করে একটি pair push |
| `pop()` | `O(1)` | শেষ pair remove |
| `top()` | `O(1)` | শেষ pair-এর প্রথম value read |
| `getMin()` | `O(1)` | শেষ pair-এর দ্বিতীয় value read |

**Space Complexity: `O(n)`**

প্রতিটি pushed element-এর জন্য একটি pair store হচ্ছে। তাই `n`টি element থাকলে Stack-এর space লাগে `O(n)`।

সবগুলো operation-এর time requirement `O(1)` পূরণ হচ্ছে।

---

## 10. `getMin()`-এ পুরো Stack Scan করলে সমস্যা কী?

একটি সহজ কিন্তু inefficient solution হতে পারে শুধু actual value store করা:

```ts
private stack: number[] = [];
```

তারপর `getMin()`-এ:

```ts
getMin(): number {
    return Math.min(...this.stack);
}
```

এতে প্রতিবার Stack-এর সব element দেখতে হবে। Worst case Time Complexity হবে `O(n)`।

কিন্তু pair-based approach-এ push করার সময়ই minimum save করে রাখছি। তাই `getMin()` শুধু top pair-এর দ্বিতীয় value read করে এবং `O(1)`-এ কাজ শেষ করে।

---

## 11. Interview-এ কীভাবে Explain করবে?

> I use a stack where each entry stores two values: the actual element and the minimum element up to that position. When pushing a new value, I calculate the minimum between the new value and the previous minimum. When popping, the previous minimum is automatically restored because it is stored in the new top entry. This allows push, pop, top, and getMin to run in O(1) time. The overall space complexity is O(n).

---

## 12. Common Mistakes

### Mistake 1: শুধু একটি Current Minimum Variable রাখা

Minimum element pop হয়ে গেলে আগের minimum কী ছিল, সেটা আর জানা যাবে না। Single variable পুরো history ধরে রাখতে পারে না।

### Mistake 2: শুধু Actual Value Store করা

তাহলে `getMin()`-এর সময় Stack scan করতে হবে, যার Time Complexity `O(n)`।

### Mistake 3: `getMin()`-এ ভুল Index Return করা

ভুল:

```ts
getMin(): number {
    return this.stack[this.stack.length - 1][0];
}
```

এটি actual top value return করবে, minimum নয়।

সঠিক:

```ts
getMin(): number {
    return this.stack[this.stack.length - 1][1];
}
```

### Mistake 4: আগের Minimum Preserve না করা

নতুন value বড় হলে আগের minimum-টাই রাখতে হবে:

```ts
currentMin = Math.min(val, this.getMin());
```

যেমন current minimum `3` এবং নতুন value `8` হলে নতুন pair হবে `[8, 3]`, `[8, 8]` নয়।

### Mistake 5: প্রতিবার Pop-এর পরে Minimum Recalculate করা

Recalculate করার দরকার নেই। নতুন top pair-এর মধ্যে correct minimum আগে থেকেই save করা আছে।

---

## 13. Edge Cases

| Operations | Expected behavior |
|---|---|
| `push(-2); getMin()` | Minimum হবে `-2` |
| `push(3); push(3); getMin()` | Minimum হবে `3` |
| `push(5); push(2); pop(); getMin()` | Minimum আবার `5` হবে |
| `push(4); push(1); push(1); pop()` | Minimum `1` থাকবে |
| `push(-2); push(0); push(-3); getMin()` | Minimum হবে `-3` |
| আগের sequence-এর পরে `pop()` | Minimum হবে `-2` |

Problem guarantee করে যে `pop()`, `top()` এবং `getMin()` কখনো empty Stack-এর ওপর call হবে না।

---

## 14. Final Revision Checklist

- [ ] কেন সাধারণ Stack দিয়ে `getMin()`-কে `O(1)` রাখা কঠিন, বুঝি।
- [ ] কেন প্রতিটি entry-তে `[value, minimumSoFar]` store করছি, বুঝি।
- [ ] `push()`-এ `Math.min(val, this.getMin())` কেন ব্যবহার করছি, explain করতে পারি।
- [ ] `pop()` করলে আগের minimum কীভাবে ফিরে আসে, বুঝি।
- [ ] `getMin()`-এ top pair-এর `[1]` index কেন return করছি, explain করতে পারি।
- [ ] TypeScript-এ চারটি operation implement করতে পারি।
- [ ] প্রতিটি operation-এর `O(1)` Time এবং overall `O(n)` Space explain করতে পারি।

### One-line Memory Trick

> প্রতিটি Stack entry নিজের minimum মনে রাখে। তাই top entry-এর দ্বিতীয় value-টাই সবসময় current Stack-এর minimum।