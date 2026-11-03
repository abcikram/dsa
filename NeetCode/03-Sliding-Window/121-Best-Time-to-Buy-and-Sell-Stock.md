# LeetCode 121 — Best Time to Buy and Sell Stock

**NeetCode category:** Sliding Window  
**Core technique:** Greedy + One Pass (running minimum)  
**Difficulty:** Easy  
**Language:** TypeScript  
**Problem:** https://leetcode.com/problems/best-time-to-buy-and-sell-stock/

---

## 1. Problem Statement — সহজ বাংলায়

তোমাকে একটি array `prices` দেওয়া থাকবে। `prices[i]` হলো `i`-তম দিনের stock price।

তোমার কাজ:

- একটি দিনে stock **buy** করতে হবে।
- তার **পরের কোনো দিনে** stock **sell** করতে হবে।
- সর্বোচ্চ কত profit করা সম্ভব, সেটা return করতে হবে।
- শুধু **একবার buy এবং একবার sell** করা যাবে।
- Profit না হলে `0` return করবে।

Profit-এর formula:

\[
\text{Profit} = \text{Selling Price} - \text{Buying Price}
\]

### Example

```ts
prices = [7, 1, 5, 3, 6, 4];

// Buy at 1 (Day 1)
// Sell at 6 (Day 4)
// Profit = 6 - 1 = 5
// Output: 5
```

মনে রাখবে: **আগে buy, তারপর sell**। একই দিনে buy ও sell করা যাবে না।

---

## 2. Pattern কী এবং কীভাবে চিনব?

### NeetCode pattern: Sliding Window

NeetCode 150 roadmap-এ এই problem-টি **Sliding Window** category-তে রাখা হয়। তবে এখানে fixed-size window নেই। আমরা একটি dynamic range-এর মধ্যে:

- বাম দিকের best buying day track করি।
- ডান দিকের current day-কে selling day হিসেবে consider করি।

### Core technique: Greedy + Running Minimum

এই problem-টি Greedy / One Pass হিসেবেও খুব পরিচিত।

**কীভাবে pattern চিনবে?**

Problem statement-এ কয়েকটি clue আছে:

1. Buy day অবশ্যই sell day-এর আগে হতে হবে (`buyDay < sellDay`)।
2. Profit maximize করতে হবে: `prices[sellDay] - prices[buyDay]`।
3. যদি selling day fixed করি, তাহলে best buying day হবে তার আগের দিনগুলোর মধ্যে minimum price-এর দিন।
4. প্রতিটি দিনের জন্য আগের minimum price আবার scan করার দরকার নেই; minimum-টা variable-এ store করে update করা যায়।

তাই brute force-এর দুইটি loop-কে optimize করে এক pass-এ আনা সম্ভব।

**Pattern recognition shortcut:**

> “আগের দিনগুলোর মধ্যে minimum value মনে রাখো, আর current value দিয়ে sell করলে কত profit হয় সেটা check করো।”

---

## 3. প্রথমে Brute Force Approach

সব possible buy-sell pair check করব।

- `i` = buy day
- `j` = sell day
- Sell day অবশ্যই buy day-এর পরে: `j > i`

```ts
class Solution {
  maxProfit(prices: number[]): number {
    let maxProfit = 0;

    for (let i = 0; i < prices.length; i++) {
      for (let j = i + 1; j < prices.length; j++) {
        const profit = prices[j] - prices[i];
        maxProfit = Math.max(maxProfit, profit);
      }
    }

    return maxProfit;
  }
}
```

### Brute force dry run

```ts
prices = [7, 1, 5, 3, 6, 4]
```

- Day 0-তে buy করলে পরের সব দিনের price-এর সঙ্গে compare করব।
- তারপর Day 1-তে buy ধরে তার পরের সব দিনের price compare করব।
- এভাবে প্রতিটি valid pair check করব।
- সর্বোচ্চ profit হবে `6 - 1 = 5`।

### Complexity

- **Time:** `O(n²)` — প্রতিটি buy day-এর জন্য পরের দিনগুলো scan করি।
- **Auxiliary Space:** `O(1)` — শুধু কয়েকটি variable ব্যবহার করি।

Brute force কাজ করে, কিন্তু প্রতিটি pair বারবার check করা অপ্রয়োজনীয়।

---

## 4. Brute Force থেকে Optimal Approach-এ কীভাবে যাব?

এটাই problem-এর সবচেয়ে important observation।

ধরো আমরা আজকের দিনে sell করতে চাই। তাহলে প্রশ্ন:

**আজ sell করলে সবচেয়ে ভালো profit পেতে কোন দিনে buy করা উচিত?**

উত্তর: আজকের আগের দিনগুলোর মধ্যে যেদিন price সবচেয়ে কম ছিল।

কারণ আজকের selling price fixed। তাই buying price যত কম হবে, profit তত বেশি হবে।

অর্থাৎ প্রতিটি দিনের জন্য আমাদের শুধু একটি information দরকার:

`আজকের আগের দিনগুলোতে minimum price কত ছিল?`

এটা প্রতিবার loop চালিয়ে বের না করে `minPrice` variable-এ maintain করব।

### দুটি variable

```ts
let minPrice = prices[0];
let maxProfit = 0;
```

- `minPrice`: এখন পর্যন্ত দেখা minimum buying price।
- `maxProfit`: এখন পর্যন্ত পাওয়া maximum profit।

প্রতিদিন:

1. Current price-এ sell করলে profit বের করো।
2. Maximum profit update করো।
3. Future days-এর জন্য minimum price update করো।

---

## 5. Optimal TypeScript Solution

```ts
class Solution {
  maxProfit(prices: number[]): number {
    if (prices.length === 0) return 0;

    let minPrice = prices[0];
    let maxProfit = 0;

    for (let i = 1; i < prices.length; i++) {
      // Step 1: Today sell করলে profit কত?
      // minPrice হলো আগের দিনগুলোতে পাওয়া lowest buying price.
      const profit = prices[i] - minPrice;

      // Step 2: Maximum profit update করো.
      maxProfit = Math.max(maxProfit, profit);

      // Step 3: Future days-এর জন্য minimum price update করো.
      minPrice = Math.min(minPrice, prices[i]);
    }

    return maxProfit;
  }
}
```

---

## 6. Code Line by Line

### A. Empty array guard

```ts
if (prices.length === 0) return 0;
```

Array খালি হলে কোনো buy বা sell করা সম্ভব নয়, তাই `0` return করি।

LeetCode-এর original constraints-এ সাধারণত array non-empty থাকে, কিন্তু reusable code-এ guard রাখা ভালো।

### B. Initialize minimum price

```ts
let minPrice = prices[0];
```

প্রথম দিনের price-কে initial minimum ধরি।

### C. Initialize maximum profit

```ts
let maxProfit = 0;
```

কোনো profitable transaction না থাকলে answer `0` হবে। তাই `maxProfit`-ও `0` দিয়ে শুরু।

### D. Loop কেন `i = 1` থেকে?

```ts
for (let i = 1; i < prices.length; i++)
```

কারণ index `0`-এর price আমরা আগেই `minPrice = prices[0]` হিসেবে initialize করেছি। তাই Day 0 আবার process করার দরকার নেই।

উদাহরণ:

```ts
prices = [7, 1, 5, 3, 6, 4];
prices.length = 6;
```

Valid index হলো:

```text
0, 1, 2, 3, 4, 5
```

Loop condition:

```ts
i < prices.length
```

মানে:

```text
i = 1  ✅
i = 2  ✅
i = 3  ✅
i = 4  ✅
i = 5  ✅  // Last index included
i = 6  ❌  // 6 < 6 false, loop stops
```

**তাই `i < prices.length` লিখতে হবে।**

যদি লিখি:

```ts
i < prices.length - 1
```

তাহলে শেষ processed index হবে `4`; index `5` বাদ পড়ে যাবে। ফলে শেষ দিনের price দিয়ে sell করার সুযোগ থাকবে না।

### E. আগে profit, তারপর minimum update কেন?

```ts
const profit = prices[i] - minPrice;
maxProfit = Math.max(maxProfit, profit);

minPrice = Math.min(minPrice, prices[i]);
```

এই order-এর reasoning:

- `minPrice` হলো আগের দিনগুলোর best buying price।
- Current day-কে selling day ধরে profit calculate করি।
- তারপর current price-কে future days-এর buying option হিসেবে minimum-এর সঙ্গে compare করি।

এতে buy day অবশ্যই sell day-এর আগে থাকে—logic-টা পরিষ্কার থাকে।

**একটি subtle note:** এই problem-এ `minPrice` আগে update করলেও final numerical answer সাধারণত একই থাকবে, কারণ current day-এর নিজের price minus itself = `0`, আর `maxProfit` কখনো negative হয় না। কিন্তু interview explanation ও buy-before-sell constraint বোঝানোর জন্য আগে profit calculate, পরে minimum update করাই পরিষ্কার।

---

## 7. Full Dry Run — Step by Step

Input:

```ts
prices = [7, 1, 5, 3, 6, 4]
```

Initial values:

```ts
minPrice = 7;
maxProfit = 0;
```

| Day / Index | Current Price | Previous `minPrice` | Profit if sell today | Updated `maxProfit` | New `minPrice` |
|---:|---:|---:|---:|---:|---:|
| 0 | 7 | — | — | 0 | 7 |
| 1 | 1 | 7 | 1 - 7 = -6 | 0 | 1 |
| 2 | 5 | 1 | 5 - 1 = 4 | 4 | 1 |
| 3 | 3 | 1 | 3 - 1 = 2 | 4 | 1 |
| 4 | 6 | 1 | 6 - 1 = 5 | 5 | 1 |
| 5 | 4 | 1 | 4 - 1 = 3 | 5 | 1 |

Final:

```ts
return maxProfit; // 5
```

Best transaction:

- Buy: Day 1 at price `1`
- Sell: Day 4 at price `6`
- Profit: `6 - 1 = 5`

**Output: `5`**

---

## 8. Edge Cases

### Case 1: Price সবসময় কমছে

```ts
prices = [7, 6, 4, 3, 1];
Output = 0;
```

কোনো profitable buy-sell pair নেই। তাই `maxProfit = 0`-ই থাকবে।

### Case 2: Price সবসময় বাড়ছে

```ts
prices = [1, 2, 3, 4, 5];
Output = 4;
```

প্রথম দিন `1`-এ buy করে শেষ দিন `5`-এ sell করব।

### Case 3: শুধু একটি দিন

```ts
prices = [5];
Output = 0;
```

একটি দিনে buy করার পর পরের কোনো দিন নেই sell করার জন্য।

Loop একবারও চলবে না, তাই `0` return হবে।

### Case 4: সব price একই

```ts
prices = [3, 3, 3, 3];
Output = 0;
```

Profit সবসময় zero।

### Case 5: Minimum price মাঝখানে আসে

```ts
prices = [8, 3, 6, 2, 9];
Output = 7;
```

`2`-এ buy করে পরের দিন `9`-এ sell করলে profit `7`।

### Case 6: দুই দিন

```ts
prices = [2, 5];
Output = 3;
```

একটি valid buy-sell pair আছে।

### Case 7: Empty input (defensive check)

```ts
prices = [];
Output = 0;
```

Empty guard-এর কারণে সঙ্গে সঙ্গে `0` return হবে।

---

## 9. Common Mistakes এবং তোমার Code-এর Correction

### Mistake 1: শেষ দিন বাদ পড়ে যাওয়া

ভুল:

```ts
for (let i = 0; i < prices.length - 1; i++)
```

এটা শেষ index পর্যন্ত যায় না।

সঠিক (যখন `minPrice = prices[0]`):

```ts
for (let i = 1; i < prices.length; i++)
```

### Mistake 2: `prices[0]` initialize করে আবার index 0 থেকে loop চালানো

```ts
let minPrice = prices[0];

for (let i = 0; i < prices.length; i++) {
  // ...
}
```

এটা ভুল নয়, কিন্তু first day অপ্রয়োজনীয়ভাবে আবার process হয়। `i = 1` থেকে শুরু করলে পরিষ্কার হয়।

### Mistake 3: `minPrice`-কে current day's price দিয়ে update করার পর profit calculate করা

Recommended order:

```ts
const profit = prices[i] - minPrice;
maxProfit = Math.max(maxProfit, profit);
minPrice = Math.min(minPrice, prices[i]);
```

এতে current day শুধু future buying opportunity হিসেবে ব্যবহার হয়।

### Mistake 4: Buy এবং Sell-এর order ভুলে যাওয়া

Buy day অবশ্যই sell day-এর আগে হতে হবে:

```text
buyIndex < sellIndex
```

তাই brute force-এ inner loop `j = i + 1` থেকে শুরু হয়।

### Mistake 5: `maxProfit` negative দিয়ে শুরু করা

যদি সব price কমে, তাহলে answer `0`, negative নয়। তাই:

```ts
let maxProfit = 0;
```

### Mistake 6: শুধু maximum price মনে রাখা

Maximum selling price একা যথেষ্ট নয়। Selling day-এর আগে minimum buying price কত ছিল, সেটাও জানতে হবে।

---

## 10. Alternative Approaches — Comparison

| Approach | Idea | Time | Auxiliary Space |
|---|---|---:|---:|
| Brute Force | সব valid buy-sell pair check | `O(n²)` | `O(1)` |
| Prefix Minimum Array | প্রতিটি index-এর আগের minimum আলাদা array-তে store | `O(n)` | `O(n)` |
| Running Minimum (Optimal) | একটি variable-এ minimum maintain | `O(n)` | `O(1)` |

### Prefix minimum approach (বোঝার জন্য)

```ts
class Solution {
  maxProfit(prices: number[]): number {
    if (prices.length === 0) return 0;

    const minBefore: number[] = new Array(prices.length);
    minBefore[0] = prices[0];

    for (let i = 1; i < prices.length; i++) {
      minBefore[i] = Math.min(minBefore[i - 1], prices[i - 1]);
    }

    let maxProfit = 0;

    for (let i = 1; i < prices.length; i++) {
      const profit = prices[i] - minBefore[i];
      maxProfit = Math.max(maxProfit, profit);
    }

    return maxProfit;
  }
}
```

এই approach-এ `minBefore[i]` হলো day `i`-এর **আগের** দিনগুলোর minimum price। তাই same-day buy/sell-এর issue নেই।

তবে extra array লাগে। Optimal solution-এ সেই array-এর বদলে শুধু `minPrice` variable maintain করি।

---

## 11. Time & Space Complexity — কেন?

### Optimal Time Complexity: `O(n)`

- Loop একবার array traverse করে।
- প্রতি iteration-এ constant-time কাজ হয়: subtraction, `Math.max`, `Math.min`।
- তাই total work input length-এর সঙ্গে linearly বাড়ে।

\[
\boxed{O(n)}
\]

### Optimal Auxiliary Space: `O(1)`

শুধু কয়েকটি variable ব্যবহার করি:

- `i`
- `minPrice`
- `maxProfit`
- `profit`

Input-এর size বাড়লেও extra variable-এর সংখ্যা বাড়ে না।

\[
\boxed{O(1)}
\]

### Brute force complexity

- Outer loop: `n` বার।
- Inner loop: মোট মিলিয়ে quadratic সংখ্যক pair check।
- তাই Time: `O(n²)`।
- Extra variables fixed: `O(1)`।

---

## 12. Interview-এ কীভাবে Explain করবে?

> I use a greedy one-pass approach. I maintain the minimum stock price seen before the current day. For each day, I calculate the profit if I sell on that day using this minimum buying price, and update the maximum profit. Then I update the minimum price for future days. This guarantees that the buy day comes before the sell day. The algorithm takes O(n) time and O(1) auxiliary space.

---

## 13. Pattern Recognition Checklist

পরেরবার এমন problem দেখলে নিজেকে প্রশ্ন করবে:

- [ ] আমাকে কি আগে একটি value choose করে পরে আরেকটি value choose করতে হবে?
- [ ] দ্বিতীয় choice কি প্রথম choice-এর পরে হতে হবে?
- [ ] Objective কি দুই value-এর difference maximize করা?
- [ ] Current position-এর answer কি আগের অংশের minimum/maximum-এর ওপর depend করে?
- [ ] আগের অংশের summary কি একটি variable-এ maintain করা যায়?

এই প্রশ্নগুলোর উত্তর হ্যাঁ হলে **running minimum / maximum + one-pass greedy** ভাবতে পারো।

NeetCode roadmap-এ এটি Sliding Window category-তে থাকলেও core optimization trick হলো **running minimum**। এটাকে fixed-size sliding window ভেবে ফেলবে না।

---

## 14. Interview Follow-up — Stock Problem Variations

| Problem | Main difference | Likely technique |
|---|---|---|
| 121. Best Time to Buy and Sell Stock | One transaction only | Running minimum / Greedy |
| 122. Best Time to Buy and Sell Stock II | Multiple transactions allowed | Greedy |
| 123. Best Time to Buy and Sell Stock III | At most two transactions | Dynamic Programming |
| 188. Best Time to Buy and Sell Stock IV | At most `k` transactions | Dynamic Programming |
| 309. Best Time to Buy and Sell Stock with Cooldown | Cooldown after selling | Dynamic Programming |
| 714. Best Time to Buy and Sell Stock with Transaction Fee | Transaction fee | Dynamic Programming / Greedy reasoning |

প্রথমে 121-এর running minimum logic পরিষ্কার করো। তারপর 122 solve করলে বোঝা যাবে transaction-এর rule বদলালে approach কেন বদলায়।

---

## 15. Final Revision Notes

**Remember this sequence:**

```text
1. First day-কে initial minimum ধরি.
2. পরের প্রতিটি দিনকে selling day হিসেবে check করি.
3. Current price - previous minimum = today's possible profit.
4. Maximum profit update করি.
5. Current price-কে future days-এর জন্য new minimum হতে দিই.
```

**Optimal code to revise:**

```ts
class Solution {
  maxProfit(prices: number[]): number {
    if (prices.length === 0) return 0;

    let minPrice = prices[0];
    let maxProfit = 0;

    for (let i = 1; i < prices.length; i++) {
      const profit = prices[i] - minPrice;
      maxProfit = Math.max(maxProfit, profit);
      minPrice = Math.min(minPrice, prices[i]);
    }

    return maxProfit;
  }
}
```

**Final complexity:**
- Time: `O(n)`
- Auxiliary Space: `O(1)`

**Revision goal:** Code মুখস্থ নয়—কেন minimum price আগে থেকে maintain করছি, কেন profit আগে calculate করছি, আর কেন loop `i = 1` থেকে `i < prices.length` পর্যন্ত চলছে, সেটা নিজের ভাষায় explain করতে পারা।
