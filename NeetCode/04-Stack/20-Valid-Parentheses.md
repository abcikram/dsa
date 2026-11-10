# LeetCode 20 — Valid Parentheses

**NeetCode Category:** Stack  
**Core Technique:** Stack / Matching Brackets  
**Difficulty:** Easy  
**Language:** TypeScript  
**Problem:** https://leetcode.com/problems/valid-parentheses/

---

## 1. Problem Statement — সহজ বাংলায়

তোমাকে একটি string `s` দেওয়া হবে। String-এ শুধু এই ছয় ধরনের bracket থাকতে পারে:

- `(` এবং `)`
- `{` এবং `}`
- `[` এবং `]`

Check করতে হবে bracket-গুলো valid বা correctly matched কি না।

একটি string valid হওয়ার জন্য তিনটি শর্ত পূরণ করতে হবে:

1. প্রতিটি opening bracket-এর matching closing bracket থাকতে হবে।
2. Closing bracket-এর type অবশ্যই opening bracket-এর type-এর সঙ্গে মিলতে হবে।
3. Bracket সঠিক order-এ close হতে হবে। অর্থাৎ nested bracket হলে সর্বশেষ open হওয়া bracket-টাই আগে close হতে হবে।

### Example 1

```ts
s = "()";
Output = true;
```

### Example 2

```ts
s = "()[]{}";
Output = true;
```

### Example 3

```ts
s = "(]";
Output = false;
```

কারণ `(`-এর matching closing bracket হলো `)`, `]` নয়।

### Example 4

```ts
s = "([])";
Output = true;
```

কারণ:
- `(` open হয়েছে, পরে `)` close হয়েছে।
- `[` open হয়েছে, পরে `]` close হয়েছে।
- Nested order সঠিক।

### Example 5

```ts
s = "([)]";
Output = false;
```

এখানে `(` আগে open হয়েছে, তারপর `[` open হয়েছে। তাই `]` দিয়ে `[` close করার পর `)` দিয়ে `(` close হওয়ার কথা। কিন্তু actual string-এ order mismatch হয়েছে।

---

## 2. Pattern Recognition — কীভাবে বুঝব এটি Stack Problem?

Problem statement-এর clues:

1. Opening bracket এলে সেটি মনে রাখতে হবে।
2. Closing bracket এলে check করতে হবে সর্বশেষ কোন opening bracket ছিল।
3. Nested bracket থাকতে পারে।
4. সর্বশেষ open হওয়া bracket-টাই আগে close হতে হবে।

এটি Stack-এর **LIFO (Last In, First Out)** behaviour।

যেমন:

```text
s = "([])"
```

Opening bracket-এর order:
1. `(` এসেছে।
2. `[` এসেছে।

Closing bracket-এর order:
1. `]` এসেছে — সর্বশেষ opening `[` close হলো।
2. `)` এসেছে — তার আগের opening `(` close হলো।

তাই Stack এই problem-এর natural choice।

### Pattern recognition shortcut

> Nested structure, matching pairs, অথবা সর্বশেষ open হওয়া item আগে close করতে হবে — এমন clue থাকলে Stack ভাববে।

---

## 3. Optimal Approach — Stack

একটি Stack রাখব, যেখানে শুধু opening brackets store করব।

প্রতিটি character process করব:

- Opening bracket হলে Stack-এ push করব।
- Closing bracket হলে:
  - Stack empty কি না check করব।
  - Empty হলে matching opening bracket নেই, তাই `false`।
  - না হলে Stack থেকে top opening bracket pop করব।
  - সেটি closing bracket-এর matching pair কি না check করব।
- সব character process হওয়ার পরে Stack empty হতে হবে।

কেন শেষে Stack empty হতে হবে?

কারণ Stack-এ কোনো opening bracket বাকি থাকলে তার matching closing bracket পাওয়া যায়নি।

---

## 4. Complete TypeScript Solution

```ts
class Solution {
    isValid(s: string): boolean {
        const stack: string[] = [];

        const pairs: Record<string, string> = {
            ")": "(",
            "]": "[",
            "}": "{"
        };

        for (const char of s) {
            // Opening bracket: remember it.
            if (char === "(" || char === "[" || char === "{") {
                stack.push(char);
            } else {
                // A closing bracket cannot match an empty stack.
                if (stack.length === 0) {
                    return false;
                }

                // Get the most recently opened bracket.
                const lastOpen = stack.pop()!;

                // Check whether the bracket types match.
                if (lastOpen !== pairs[char]) {
                    return false;
                }
            }
        }

        // No unmatched opening bracket should remain.
        return stack.length === 0;
    }
}
```

---

## 5. Code Step by Step

### Step 1 — Stack তৈরি করি

```ts
const stack: string[] = [];
```

এখানে opening brackets store করব।

যেমন input-এর শুরুতে `(` পেলে:

```ts
stack.push("(");
```

### Step 2 — Matching Map তৈরি করি

```ts
const pairs: Record<string, string> = {
    ")": "(",
    "]": "[",
    "}": "{"
};
```

এখানে closing bracket-এর key এবং তার matching opening bracket-এর value রাখা হয়েছে।

| Closing bracket | Expected opening bracket |
|---|---|
| `)` | `(` |
| `]` | `[` |
| `}` | `{` |

তাই যদি current character `]` হয়:

```ts
pairs["]"]; // "["
```

### Step 3 — প্রতিটি Character Process করি

```ts
for (const char of s) {
```

String-এর প্রতিটি character একবার করে process হবে।

### Step 4 — Opening Bracket হলে Push করি

```ts
if (char === "(" || char === "[" || char === "{") {
    stack.push(char);
}
```

Opening bracket-গুলো মনে রাখতে হবে, কারণ পরে closing bracket এলে সর্বশেষ opening bracket-এর সঙ্গে match করতে হবে।

### Step 5 — Closing Bracket হলে আগে Empty Stack Check করি

```ts
if (stack.length === 0) {
    return false;
}
```

ধরো:

```ts
s = ")";
```

প্রথম character-ই closing bracket। কিন্তু Stack-এ কোনো opening bracket নেই।

তাই এটি invalid এবং সঙ্গে সঙ্গে `false` return করব।

### Step 6 — সর্বশেষ Opening Bracket Pop করি

```ts
const lastOpen = stack.pop()!;
```

এটি Stack-এর top opening bracket বের করে এবং Stack থেকে remove করে।

### Step 7 — Bracket Type Match করি

```ts
if (lastOpen !== pairs[char]) {
    return false;
}
```

ধরো:

```ts
lastOpen = "(";
char = "]";
```

এখন:

```ts
pairs["]"]; // "["
```

তাই comparison:

```ts
"(" !== "[" // true
```

এই bracket pair match করে না। তাই `false` return করব।

### Step 8 — সব Character-এর পরে Stack Empty কি না Check করি

```ts
return stack.length === 0;
```

যদি Stack empty হয়, তাহলে প্রতিটি opening bracket-এর matching closing bracket পাওয়া গেছে।

যদি Stack empty না হয়, তাহলে কিছু opening bracket-এর closing bracket পাওয়া যায়নি।

---

## 6. Full Dry Run — Valid Example

Input:

```ts
s = "([])";
```

Initially:

```ts
stack = [];
```

| Character | Operation | Stack |
|---|---|---|
| `(` | Opening → push | `["("]` |
| `[` | Opening → push | `["(", "["]` |
| `]` | Pop `[`; expected `[`; match | `["("]` |
| `)` | Pop `(`; expected `(`; match | `[]` |

সব character process হয়ে গেছে।

```ts
stack.length === 0; // true
```

Output:

```ts
true
```

---

## 7. Full Dry Run — Invalid Example

Input:

```ts
s = "([)]";
```

Initially:

```ts
stack = [];
```

| Character | Operation | Stack | Result |
|---|---|---|---|
| `(` | Push `(` | `["("]` | Continue |
| `[` | Push `[` | `["(", "["]` | Continue |
| `)` | Pop `[`; expected `(` | `["("]` | Mismatch |

এখানে current closing bracket `)`। এর matching opening bracket হওয়া উচিত `(`।

কিন্তু Stack থেকে pop হয়েছে `[`।

তাই:

```ts
lastOpen !== pairs[")"];
"[" !== "(";
```

এটি true, তাই সঙ্গে সঙ্গে:

```ts
return false;
```

এই জন্য `"([)]"` invalid।

---

## 8. কেন Stack Empty Check করা দরকার?

দুটি আলাদা invalid situation আছে।

### Case A — Opening bracket ছাড়া Closing bracket

```ts
s = "())";
```

প্রথম `(` push হবে। প্রথম `)` সেটিকে match করে pop করবে। দ্বিতীয় `)` আসার সময় Stack empty।

তাই `false`।

### Case B — Closing bracket ছাড়া Opening bracket

```ts
s = "(((";
```

সব character opening bracket, তাই সবগুলো Stack-এ push হবে।

শেষে:

```ts
stack = ["(", "(", "("];
```

Stack empty নয়। তাই `false`।

এই কারণেই শেষে `stack.length === 0` check করতে হবে।

---

## 9. Common Mistakes

### Mistake 1: শুধু Opening ও Closing bracket-এর সংখ্যা গোনা

যেমন:

```ts
s = "([)]";
```

এখানে দুটি opening এবং দুটি closing bracket আছে। কিন্তু order ভুল।

তাই শুধু count করলেই হবে না; Stack দরকার।

### Mistake 2: সর্বশেষ Opening Bracket না দেখে যেকোনো Opening Bracket Match করা

Closing bracket অবশ্যই Stack-এর top opening bracket-এর সঙ্গে match করতে হবে। কারণ nested structure LIFO follow করে।

### Mistake 3: Stack Empty Check না করা

```ts
const lastOpen = stack.pop()!;
```

Pop করার আগে Stack empty কি না check করতে হবে। Empty Stack থেকে pop করলে valid opening bracket পাওয়া যাবে না।

### Mistake 4: শেষে Stack Empty কি না Check না করা

```ts
return true;
```

এভাবে unconditional true return করা ভুল।

সঠিক:

```ts
return stack.length === 0;
```

### Mistake 5: Bracket Type Compare না করা

শুধু opening এবং closing bracket পেলেই valid নয়। Type-ও match করতে হবে:

- `(` এর সঙ্গে `)`
- `[` এর সঙ্গে `]`
- `{` এর সঙ্গে `}`

---

## 10. Complexity Analysis — TC / SC

ধরি `n = s.length`।

| Complexity | Value | কারণ |
|---|---:|---|
| Time | `O(n)` | প্রতিটি character একবার process হয় |
| Space | `O(n)` | Worst case-এ সব character opening bracket হতে পারে |

### Time Complexity: `O(n)`

প্রতিটি character-এর জন্য:
- Opening হলে একটি push।
- Closing হলে একটি pop এবং একটি Map lookup।

Stack push/pop এবং Map lookup average `O(1)`।

তাই মোট Time Complexity `O(n)`।

### Space Complexity: `O(n)`

Worst case input যদি এমন হয়:

```ts
s = "(((((((";
```

তাহলে সব character Stack-এ জমা হবে। তাই auxiliary space `O(n)`।

---

## 11. Interview-এ Approach কীভাবে Explain করবে?

> I use a stack because brackets must be closed in reverse order of opening. I push every opening bracket onto the stack. When I encounter a closing bracket, I check that the stack is not empty, pop the most recent opening bracket, and compare it with the expected matching bracket. If they do not match, I return false. After processing the entire string, the stack must be empty. Each character is processed once, so the time complexity is O(n) and the auxiliary space complexity is O(n).

---

## 12. Related Stack Problems

| Problem | Main Stack Concept |
|---|---|
| 20. Valid Parentheses | Matching Brackets |
| 150. Evaluate Reverse Polish Notation | Operand Stack / Expression Evaluation |
| 155. Min Stack | Stack with Extra State |
| 739. Daily Temperatures | Monotonic Stack |
| 853. Car Fleet | Stack / Ordered Processing |
| 84. Largest Rectangle in Histogram | Monotonic Stack |

---

## 13. Final Revision Checklist

- [ ] বুঝি কেন bracket matching-এর জন্য Stack ব্যবহার করি।
- [ ] LIFO কীভাবে nested brackets solve করে, explain করতে পারি।
- [ ] Opening bracket এলে push করতে পারি।
- [ ] Closing bracket এলে আগে empty Stack check করতে পারি।
- [ ] Stack-এর top opening bracket-এর সঙ্গে closing bracket match করতে পারি।
- [ ] কেন শেষে Stack empty হতে হবে, explain করতে পারি।
- [ ] `"([])"` এবং `"([)]"` dry run করতে পারি।
- [ ] TC `O(n)` এবং SC `O(n)` explain করতে পারি।

### One-line Memory Trick

> Opening bracket পেলে Push; Closing bracket পেলে Empty check → Pop → Match. সব শেষ হলে Stack empty হলেই Valid।