# LeetCode 150 — Evaluate Reverse Polish Notation

**NeetCode Category:** Stack  
**Core Technique:** Stack / Expression Evaluation  
**Difficulty:** Medium  
**Language:** TypeScript  
**Problem:** https://leetcode.com/problems/evaluate-reverse-polish-notation/

---

## 1. Problem Statement — সহজ বাংলায়

তোমাকে `tokens` নামে একটি string array দেওয়া হবে। এতে integer এবং `+`, `-`, `*`, `/` operator থাকবে। Reverse Polish Notation (RPN) expression evaluate করে final integer result return করতে হবে।

Example:

```ts
tokens = ["2", "1", "+", "3", "*"];
```

এর মানে:

```text
(2 + 1) * 3 = 9
```

Output:

```ts
9
```

আরেকটি example:

```ts
tokens = ["4", "13", "5", "/", "+"];
```

এর মানে `4 + (13 / 5)`। Division truncate করার পরে result `4 + 2 = 6`।

---

## 2. Reverse Polish Notation (RPN) কী?

সাধারণ expression-এ operator operands-এর মাঝে থাকে:

```text
2 + 1
```

এটি Infix Notation।

RPN বা Postfix Notation-এ operator operands-এর পরে থাকে:

```text
2 1 +
```

আরও কিছু example:

| Infix | RPN |
|---|---|
| `2 + 1` | `2 1 +` |
| `2 * 3` | `2 3 *` |
| `(2 + 1) * 3` | `2 1 + 3 *` |
| `4 + (13 / 5)` | `4 13 5 / +` |

RPN-এ token-এর order-ই বলে দেয় কখন operation হবে। তাই আলাদা করে parentheses বা operator precedence handle করতে হয় না।

---

## 3. Pattern Recognition — কেন এটি Stack Problem?

Problem-এর clues:

1. Number একটার পর একটা আসছে।
2. Operator এলে আগের দুটি available operand দরকার।
3. সর্বশেষ পাওয়া operand-গুলো আগে ব্যবহার করতে হবে।
4. Calculation-এর result পরবর্তী operation-এ আবার ব্যবহার হতে পারে।

এখানে **LIFO (Last In, First Out)** behaviour দরকার। Stack-ও LIFO follow করে: সর্বশেষ push করা element-টাই আগে pop হয়।

**Pattern recognition shortcut:**

> Number পেলে জমা রাখো। Operator এলে সর্বশেষ দুটি operand বের করে calculation করো। Result আবার জমা রাখো — এই flow দেখলে Stack ভাববে।

---

## 4. Optimal Approach — Stack

একটি আলাদা `number` stack রাখব।

প্রতিটি token process করব:

- Number হলে `Number(token)` করে Stack-এ push করব।
- Operator হলে Stack থেকে দুটি number pop করব।
- Operation করে result আবার Stack-এ push করব।
- সব token শেষ হলে Stack-এর একমাত্র element final answer।

### Pop Order খুব গুরুত্বপূর্ণ

```ts
const b = stack.pop()!;
const a = stack.pop()!;
```

প্রথমে `b`, তারপর `a` pop করব।

যদি Stack হয়:

```ts
[10, 4]
```

তাহলে `b = 4`, `a = 10` হবে। তাই subtraction হবে `a - b = 10 - 4`, `b - a` নয়।

বিশেষ করে `-` এবং `/` operator-এর ক্ষেত্রে order ভুল করলে answer ভুল হবে।

---

## 5. Complete TypeScript Solution

```ts
class Solution {
    evalRPN(tokens: string[]): number {
        const stack: number[] = [];

        for (const token of tokens) {
            if (
                token === "+" ||
                token === "-" ||
                token === "*" ||
                token === "/"
            ) {
                // First pop is the right operand.
                const b = stack.pop()!;

                // Second pop is the left operand.
                const a = stack.pop()!;

                let result = 0;

                switch (token) {
                    case "+":
                        result = a + b;
                        break;

                    case "-":
                        result = a - b;
                        break;

                    case "*":
                        result = a * b;
                        break;

                    case "/":
                        result = Math.trunc(a / b);
                        break;
                }

                // Push the calculated result back.
                stack.push(result);
            } else {
                // Convert the numeric string to a number.
                stack.push(Number(token));
            }
        }

        // The final expression result remains in the stack.
        return stack.pop()!;
    }
}
```

---

## 6. Code Step by Step

### Step 1 — আলাদা Stack তৈরি করি

```ts
const stack: number[] = [];
```

এখানে numbers এবং intermediate calculation results রাখব।

**Input `tokens` array-কে Stack হিসেবে ব্যবহার করব না।** `tokens` হলো original expression; সেটি শুধু iterate করব।

### Step 2 — প্রতিটি token process করি

```ts
for (const token of tokens) {
```

প্রতিটি token হয় number, নয়তো operator।

### Step 3 — Operator কিনা check করি

```ts
if (
    token === "+" ||
    token === "-" ||
    token === "*" ||
    token === "/"
)
```

Operator হলে Stack থেকে দুটি operand pop করব।

### Step 4 — দুটি Operand Pop করি

```ts
const b = stack.pop()!;
const a = stack.pop()!;
```

ধরো:

```ts
stack = [10, 4];
```

তাহলে:

```ts
const b = stack.pop()!; // 4
const a = stack.pop()!; // 10
```

এখানে `b` হলো right operand এবং `a` হলো left operand। তাই operation হবে `a operator b`।

### Step 5 — Operation Execute করি

```ts
switch (token) {
    case "+":
        result = a + b;
        break;
    case "-":
        result = a - b;
        break;
    case "*":
        result = a * b;
        break;
    case "/":
        result = Math.trunc(a / b);
        break;
}
```

### Step 6 — Result আবার Stack-এ Push করি

```ts
stack.push(result);
```

Result আবার Stack-এ রাখতে হবে, কারণ পরবর্তী operator এই result ব্যবহার করতে পারে।

### Step 7 — Number হলে Push করি

```ts
stack.push(Number(token));
```

Input-এর token string, তাই `Number(token)` দিয়ে number-এ convert করছি।

### Step 8 — Final Answer Return করি

```ts
return stack.pop()!;
```

Valid RPN expression-এর সব token process হওয়ার পরে Stack-এ একটিমাত্র result থাকবে।

---

## 7. Full Dry Run — Example 1

Input:

```ts
tokens = ["2", "1", "+", "3", "*"];
```

Initially:

```ts
stack = [];
```

| Token | Operation | Stack |
|---|---|---|
| `"2"` | Push 2 | `[2]` |
| `"1"` | Push 1 | `[2, 1]` |
| `"+"` | Pop `b=1`, `a=2`; calculate `2+1=3`; push 3 | `[3]` |
| `"3"` | Push 3 | `[3, 3]` |
| `"*"` | Pop `b=3`, `a=3`; calculate `3*3=9`; push 9 | `[9]` |

সব token শেষ। তাই:

```ts
return stack.pop(); // 9
```

**Output: `9`**

---

## 8. Full Dry Run — Example 2

Input:

```ts
tokens = ["4", "13", "5", "/", "+"];
```

| Token | Operation | Stack |
|---|---|---|
| `"4"` | Push 4 | `[4]` |
| `"13"` | Push 13 | `[4, 13]` |
| `"5"` | Push 5 | `[4, 13, 5]` |
| `"/"` | `b=5`, `a=13`; `Math.trunc(13/5)=2`; push 2 | `[4, 2]` |
| `"+"` | `b=2`, `a=4`; `4+2=6`; push 6 | `[6]` |

Output:

```ts
6
```

---

## 9. Subtraction এবং Division-এর Operand Order

এটি problem-এর সবচেয়ে common tricky part।

### Subtraction

```ts
tokens = ["10", "4", "-"];
```

দুটি number Stack-এ জমা হবে:

```ts
stack = [10, 4];
```

এখন `-` এলে:

```ts
const b = stack.pop()!; // 4
const a = stack.pop()!; // 10
```

সঠিক:

```ts
a - b; // 10 - 4 = 6
```

ভুল:

```ts
b - a; // 4 - 10 = -6
```

### Division

```ts
tokens = ["10", "2", "/"];
```

Pop করলে `b = 2`, `a = 10`।

সঠিক:

```ts
a / b; // 5
```

ভুল:

```ts
b / a; // 0.2
```

তাই সবসময় মনে রাখবে: প্রথমে `b` pop, তারপর `a` pop, এবং operation হবে `a operator b`।

---

## 10. Division-এ `Math.trunc()` কেন?

Problem অনুযায়ী division-এর result **toward zero truncate** করতে হবে।

```ts
Math.trunc(7 / 3);   // 2
Math.trunc(-7 / 3);  // -2
```

`Math.trunc()` decimal অংশ বাদ দেয়।

কিন্তু `Math.floor()` negative number-এর ক্ষেত্রে অন্য result দিতে পারে:

```ts
Math.floor(-7 / 3); // -3
Math.trunc(-7 / 3); // -2
```

এই problem-এ `Math.trunc()` ব্যবহার করতে হবে, `Math.floor()` নয়।

---

## 11. তোমার Original Code — কী ভুল ছিল?

তোমার original approach-এর idea ঠিক ছিল, কিন্তু implementation-এ কয়েকটি ভুল ছিল।

### Mistake 1 — Input Array-কে Stack হিসেবে ব্যবহার করা

ভুল:

```ts
for (let token of tokens) {
    // ...
    tokens.push(token);
}
```

`tokens` original input expression। এটিকে modify করলে iteration-এর behaviour ভুল হতে পারে।

সঠিক:

```ts
const stack: number[] = [];

for (const token of tokens) {
    // Use stack for operands and results.
}
```

### Mistake 2 — `tokens.pop()` করা

ভুল:

```ts
const b = Number(tokens.pop());
const a = Number(tokens.pop());
```

এটি original input-এর শেষ token remove করে, processed number নয়।

সঠিক:

```ts
const b = stack.pop()!;
const a = stack.pop()!;
```

### Mistake 3 — Addition-এর জায়গায় Multiplication

ভুল:

```ts
case "+":
    result = b * a;
    break;
```

সঠিক:

```ts
case "+":
    result = a + b;
    break;
```

### Mistake 4 — Subtraction এবং Division-এর Order

ভুল:

```ts
result = b - a;
result = Math.trunc(b / a);
```

সঠিক:

```ts
result = a - b;
result = Math.trunc(a / b);
```

### Mistake 5 — Result-এর Type

আলাদা `number[]` Stack রাখলে:

```ts
stack.push(result);
```

সরাসরি push করতে পারবে। `toString()` করার দরকার নেই।

---

## 12. Complexity Analysis — TC / SC

ধরি `n = tokens.length`।

| Complexity | Value | কারণ |
|---|---:|---|
| Time | `O(n)` | প্রতিটি token একবার process হয় |
| Space | `O(n)` | Worst case-এ অনেকগুলো number Stack-এ জমা থাকতে পারে |

### Time Complexity: `O(n)`

প্রতিটি token-এর জন্য:
- Number হলে একটি push।
- Operator হলে দুটি pop, একটি calculation এবং একটি push।

Stack-এর প্রতিটি operation `O(1)`। তাই মোট `n`টি token process করতে `O(n)` সময় লাগে।

### Space Complexity: `O(n)`

Worst case-এ expression-এর অনেকগুলো number একসঙ্গে Stack-এ থাকতে পারে। তাই Stack-এর space `O(n)`।

---

## 13. Common Mistakes — Revision

- [ ] `tokens` input array-কে Stack হিসেবে ব্যবহার করা।
- [ ] Operator এলে `stack`-এর পরিবর্তে `tokens.pop()` করা।
- [ ] প্রথমে `a`, পরে `b` pop করা।
- [ ] Subtraction-এ `b-a` ব্যবহার করা।
- [ ] Division-এ `b/a` ব্যবহার করা।
- [ ] `Math.floor()` ব্যবহার করা, `Math.trunc()`-এর বদলে।
- [ ] Calculation-এর result আবার Stack-এ push করতে ভুলে যাওয়া।
- [ ] String number-কে `Number(token)` দিয়ে convert না করা।

---

## 14. Interview-এ Approach কীভাবে Explain করবে?

> I use a stack to evaluate the Reverse Polish Notation expression. I iterate through the tokens from left to right. If a token is a number, I convert it to a number and push it onto the stack. If it is an operator, I pop the right operand first and then the left operand, perform the operation in the correct order, and push the result back. After processing all tokens, the stack contains the final result. Each token is processed once, so the time complexity is O(n), and the auxiliary space complexity is O(n).

---

## 15. Related Stack Problems

| Problem | Main Stack Concept |
|---|---|
| 150. Evaluate Reverse Polish Notation | Operand Stack / Expression Evaluation |
| 20. Valid Parentheses | Matching Brackets |
| 155. Min Stack | Stack with Extra State |
| 739. Daily Temperatures | Monotonic Stack |
| 853. Car Fleet | Stack / Ordered Processing |
| 84. Largest Rectangle in Histogram | Monotonic Stack |

---

## 16. Final Revision Checklist

- [ ] RPN এবং Postfix Notation বুঝি।
- [ ] কেন এই problem-এ Stack ব্যবহার করছি, explain করতে পারি।
- [ ] Number পেলে push করতে পারি।
- [ ] Operator পেলে দুটি operand pop করতে পারি।
- [ ] কেন প্রথমে `b`, তারপর `a` pop করি, বুঝি।
- [ ] কেন calculation `a operator b` হয়, বুঝি।
- [ ] Division-এর জন্য `Math.trunc()` কেন ব্যবহার করি, বুঝি।
- [ ] Result আবার Stack-এ push করতে পারি।
- [ ] Final answer কেন Stack-এর top-এ থাকে, explain করতে পারি।
- [ ] TC `O(n)` এবং SC `O(n)` explain করতে পারি।

### One-line Memory Trick

> Number পেলে Push; Operator পেলে দুইবার Pop → `a operator b` calculate → Result Push. সব token শেষ হলে Stack-এর top-ই Answer।