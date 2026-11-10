# LeetCode 69 — Sqrt(x): All Approaches

**NeetCode Category:** Binary Search  
**Core Techniques:** Brute Force, Binary Search on Answer, Newton's Method  
**Difficulty:** Easy  
**Language:** TypeScript  
**Problem:** https://leetcode.com/problems/sqrtx/

---

## 1. Problem Statement — সহজ বাংলায়

তোমাকে একটি non-negative integer `x` দেওয়া হবে। তার square root-এর **integer part** return করতে হবে। অর্থাৎ decimal অংশ বাদ দিয়ে নিচের পূর্ণসংখ্যাটি return করবে।

```ts
x = 4; // Output: 2
x = 8; // Output: 2
```

কারণ `2 * 2 = 4`, কিন্তু `3 * 3 = 9`। তাই `floor(sqrt(8)) = 2`।

**Important:** Built-in `Math.sqrt()` ব্যবহার না করে integer square root বের করতে হবে।

---

## 2. আসলে কী খুঁজছি?

আমরা এমন একটি maximum integer `k` খুঁজছি, যার square `x`-এর চেয়ে ছোট বা সমান:

\[
k^2 \le x
\]

এবং পরের integer-এর square `x`-এর চেয়ে বড়:

\[
(k+1)^2 > x
\]

যেমন `x = 8`:

| `k` | `k * k` | Valid? |
|---:|---:|---|
| 0 | 0 | Yes |
| 1 | 1 | Yes |
| 2 | 4 | Yes |
| 3 | 9 | No |
| 4 | 16 | No |

সর্বশেষ valid integer হলো `2`।

---

## 3. Pattern Recognition — কেন Binary Search?

একটি গুরুত্বপূর্ণ property আছে:

- কোনো `k` valid হলে তার চেয়ে ছোট সব non-negative integer-ও valid।
- কোনো `k` invalid হলে তার চেয়ে বড় সব integer-ও invalid।

`x = 8`-এর জন্য:

```text
0  1  2 | 3  4  5  6  7  8
V  V  V | X  X  X  X  X  X
```

এখানে valid থেকে invalid হওয়ার একটি boundary আছে। এই ধরনের problem-কে **Binary Search on Answer** বা **Monotonic Predicate** problem বলা হয়।

Condition:

```ts
mid * mid <= x
```

আমাদের goal হলো সর্বশেষ valid `mid` খুঁজে বের করা।

---

# Approach 1 — Brute Force

## 4. Brute Force Logic

1. `1` থেকে শুরু করব।
2. প্রতিটি integer-এর square check করব।
3. যতক্ষণ square `x`-এর চেয়ে ছোট বা সমান, answer update করব।
4. Square `x`-এর চেয়ে বড় হলে থামব।

### TypeScript Code

```ts
class Solution {
    mySqrt(x: number): number {
        let answer = 0;

        for (let i = 1; i <= x / i; i++) {
            answer = i;
        }

        return answer;
    }
}
```

এখানে `i <= x / i` হলো positive `i`-এর জন্য `i * i <= x`-এর equivalent। এতে unnecessary বড় multiplication এড়ানো যায়।

### Dry Run — `x = 8`

| `i` | Check: `i <= 8 / i` | Action | Answer |
|---:|---|---|---:|
| 1 | `1 <= 8` → true | `answer = 1` | 1 |
| 2 | `2 <= 4` → true | `answer = 2` | 2 |
| 3 | `3 <= 2.67` → false | Loop ends | 2 |

Return `2`।

### Complexity

- **Time:** `O(√x)` — প্রায় square root পর্যন্ত iterate করতে হয়।
- **Space:** `O(1)` — কয়েকটি variable ব্যবহার করছি।

**কখন ব্যবহার করব?** Problem-এর logic বোঝার জন্য। বড় input-এর জন্য Binary Search ভালো।

---

# Approach 2 — Binary Search with `ans`

## 5. Logic

দুটি pointer রাখব:

```ts
let left = 0;
let right = x;
```

প্রতিবার middle বের করব:

```ts
const mid = left + Math.floor((right - left) / 2);
```

তারপর:

- `mid` valid হলে `ans = mid` save করব এবং বড় valid answer খুঁজতে ডান দিকে যাব।
- `mid` invalid হলে বাম দিকে search করব।

### কেন `ans` দরকার?

আমরা maximum valid value খুঁজছি। Valid `mid` পেলে তাকে বাদ দিয়ে আরও ডানে search করি। Search শেষে `left` valid answer-এর পরের position-এ চলে যেতে পারে। তাই সর্বশেষ valid value আলাদা করে save রাখব।

### TypeScript Code

```ts
class Solution {
    mySqrt(x: number): number {
        if (x < 2) return x;

        let left = 0;
        let right = x;
        let ans = 0;

        while (left <= right) {
            const mid = left + Math.floor((right - left) / 2);

            // Check mid * mid <= x without multiplying.
            if (mid <= Math.floor(x / mid)) {
                ans = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return ans;
    }
}
```

**কেন `x < 2` check?** এতে `x = 0` এবং `x = 1`-এর answer সরাসরি return হয় এবং division by zero-এর edge case থাকে না।

### Dry Run — `x = 8`

Initially:

```ts
left = 0;
right = 8;
ans = 0;
```

| `left` | `right` | `mid` | `mid * mid` | Action | `ans` |
|---:|---:|---:|---:|---|---:|
| 0 | 8 | 4 | 16 | Invalid → `right = 3` | 0 |
| 0 | 3 | 1 | 1 | Valid → `left = 2` | 1 |
| 2 | 3 | 2 | 4 | Valid → `left = 3` | 2 |
| 3 | 3 | 3 | 9 | Invalid → `right = 2` | 2 |

এখন `left > right`, তাই loop শেষ।

```ts
return ans; // 2
```

### Complexity

- **Time:** `O(log x)`
- **Space:** `O(1)`

এটি সহজে explain করা যায় এবং interview-এর জন্য ভালো approach।

---

# Approach 3 — Binary Search without `ans`

## 6. Logic

এখানেও Binary Search করব, কিন্তু আলাদা `ans` variable রাখব না।

আমরা এমনভাবে boundary maintain করব যেন loop শেষে `left`-ই maximum valid answer হয়। এজন্য **Upper Mid** ব্যবহার করব:

```ts
const mid = left + Math.ceil((right - left) / 2);
```

কেন Upper Mid?

ধরো:

```ts
left = 2;
right = 3;
```

Lower mid হলে `mid = 2` হবে। Valid হলে `left = mid` করলেও `left` আর এগোবে না, ফলে infinite loop হতে পারে।

Upper mid হলে `mid = 3` হবে। তাই range ছোট হবে।

### TypeScript Code

```ts
class Solution {
    mySqrt(x: number): number {
        let left = 0;
        let right = x;

        while (left < right) {
            const mid = left + Math.ceil((right - left) / 2);

            if (mid <= Math.floor(x / mid)) {
                left = mid;
            } else {
                right = mid - 1;
            }
        }

        return left;
    }
}
```

এখানে `while (left < right)` চলার সময় upper-mid-এর কারণে `mid` zero হবে না।

### Dry Run — `x = 8`

| `left` | `right` | Upper `mid` | Valid? | Update |
|---:|---:|---:|---|---|
| 0 | 8 | 4 | No | `right = 3` |
| 0 | 3 | 2 | Yes | `left = 2` |
| 2 | 3 | 3 | No | `right = 2` |

এখন `left === right === 2`। Loop শেষ।

```ts
return left; // 2
```

### Complexity

- **Time:** `O(log x)`
- **Space:** `O(1)`

**খেয়াল রাখবে:** এই version-এ upper-mid ব্যবহার করা জরুরি, কারণ valid হলে `left = mid` করছি।

---

# Approach 4 — Newton's Method

## 7. Mathematical Approach

Newton's Method দিয়ে square root-এর কাছাকাছি value বারবার improve করা যায়।

Formula:

\[
next = \frac{current + x/current}{2}
\]

ধরো:

```ts
x = 8;
current = 8;
```

প্রথম update:

```text
next = (8 + 8 / 8) / 2
     = 4.5
```

এরপর:

```text
next = (4.5 + 8 / 4.5) / 2
     ≈ 3.138
```

এরপর আরও update করলে value `2.828...`-এর দিকে converge করবে।

আমাদের decimal answer দরকার নেই; floor square root দরকার।

### TypeScript Code — Integer Newton's Method

```ts
class Solution {
    mySqrt(x: number): number {
        if (x < 2) return x;

        let current = x;

        while (current > Math.floor(x / current)) {
            const quotient = Math.floor(x / current);
            current = Math.floor((current + quotient) / 2);
        }

        return current;
    }
}
```

এখানে integer calculation ব্যবহার করছি:

- `quotient` হলো `floor(x / current)`।
- `current` update করে ছোট estimate-এর দিকে এগোই।
- যখন `current <= floor(x / current)` হয়, তখন `current` আর square root-এর ওপরে নেই। সেটিই floor square root।

### Example — `x = 8`

| Iteration | `current` | `floor(8 / current)` | New `current` |
|---:|---:|---:|---:|
| 1 | 8 | 1 | 4 |
| 2 | 4 | 2 | 3 |
| 3 | 3 | 2 | 2 |
| Stop | 2 | 4 | — |

Return:

```ts
2
```

### Complexity

- **Time:** `O(log x)` worst-case upper bound for this integer iteration; বাস্তবে Newton's Method সাধারণত দ্রুত converge করে।
- **Space:** `O(1)`।

Interview-এ এই approach ব্যবহার করার আগে problem constraints এবং implementation ভালোভাবে explain করতে হবে।

---

# Approach 5 — Built-in `Math.sqrt()`

## 8. JavaScript / TypeScript Built-in

JavaScript-এ square root বের করার built-in method আছে:

```ts
class Solution {
    mySqrt(x: number): number {
        return Math.floor(Math.sqrt(x));
    }
}
```

Example:

```ts
Math.sqrt(8);             // 2.828...
Math.floor(Math.sqrt(8)); // 2
```

এটি practical application code-এ useful। কিন্তু LeetCode 69-এর উদ্দেশ্য হলো square root algorithm implement করা, তাই algorithm practice-এর জন্য Binary Search শেখা বেশি গুরুত্বপূর্ণ।

---

## 9. All Approaches — Comparison

| Approach | Time Complexity | Space Complexity | Notes |
|---|---:|---:|---|
| Brute Force | `O(√x)` | `O(1)` | সহজ, কিন্তু ধীর |
| Binary Search with `ans` | `O(log x)` | `O(1)` | Interview-friendly |
| Binary Search without `ans` | `O(log x)` | `O(1)` | Upper-mid boundary technique |
| Newton's Method | `O(log x)` worst-case bound | `O(1)` | Mathematical approach |
| `Math.sqrt()` | Built-in | `O(1)` auxiliary | Algorithm practice-এর বিকল্প নয় |

---

## 10. তোমার Original Code — কী Issue ছিল?

তোমার original code-এর গুরুত্বপূর্ণ অংশ:

```ts
while (left < right) {
    const mid = left + Math.floor((right - left) / 2);

    if (mid * mid === x) {
        return mid;
    } else if (mid * mid <= x) {
        left = mid + 1;
    } else {
        right = mid - 1;
    }
}

return left;
```

সমস্যা হলো, `mid * mid <= x` হলে তুমি valid `mid`-কে বাদ দিয়ে:

```ts
left = mid + 1;
```

করছ। কিন্তু valid `mid`-কে save করছ না।

Example:

```ts
x = 8;
```

শেষে `left = 3` হয়ে যেতে পারে, অথচ correct answer `2`।

### Fix 1

একটি `ans` variable রাখো:

```ts
ans = mid;
```

### Fix 2

অথবা upper-mid Binary Search ব্যবহার করে boundary এমনভাবে maintain করো, যাতে loop শেষে `left`-ই answer হয়।

---

## 11. Edge Cases

| Input `x` | Output | Explanation |
|---:|---:|---|
| `0` | `0` | Square root of zero |
| `1` | `1` | Exact square |
| `2` | `1` | `1² <= 2 < 2²` |
| `4` | `2` | Exact square |
| `8` | `2` | `2² <= 8 < 3²` |
| `15` | `3` | `3² <= 15 < 4²` |
| `16` | `4` | Exact square |
| `2147395600` | `46340` | Large perfect square |

---

## 12. Interview-এ Pattern কীভাবে Explain করবে?

নিজেকে প্রশ্ন করবে:

1. একটি integer answer খুঁজছি? — Yes.
2. কোনো condition দিয়ে answer valid বা invalid বলা যায়? — Yes, `k * k <= x`।
3. ছোট integer-গুলো valid হলে তার চেয়ে বড় integer-গুলোও কি valid? — না, বরং valid থেকে invalid-এ একবার boundary তৈরি হয়।
4. এই boundary efficiently খুঁজতে পারি? — Yes, Binary Search।

এটি **Binary Search on Answer / Monotonic Predicate**।

### Interview-ready explanation

> We need the largest integer whose square is less than or equal to x. The predicate `mid * mid <= x` is monotonic: once a value becomes invalid, every larger value is also invalid. So we can binary search for the last valid value. I keep the last valid midpoint in an answer variable and return it after the search. The time complexity is O(log x) and the auxiliary space complexity is O(1).

---

## 13. Final Revision Checklist

- [ ] Integer square root মানে floor square root — বুঝি।
- [ ] কেন `k * k <= x` condition ব্যবহার করছি, বুঝি।
- [ ] Brute Force approach লিখতে পারি।
- [ ] Binary Search with `ans` implement করতে পারি।
- [ ] কেন `ans` দরকার, explain করতে পারি।
- [ ] Upper-mid Binary Search without `ans` বুঝি।
- [ ] Newton's Method-এর formula এবং code বুঝি।
- [ ] কেন `Math.floor()` দিয়ে `Math.sqrt()` return করছি, বুঝি।
- [ ] TC এবং SC compare করতে পারি।

### One-line Memory Trick

> Maximum integer `k` খুঁজতে হবে যেন `k² <= x`। Brute Force এক এক করে check করে; Binary Search valid/invalid boundary খুঁজে; `ans` approach-এ সর্বশেষ valid value save করে রাখে।