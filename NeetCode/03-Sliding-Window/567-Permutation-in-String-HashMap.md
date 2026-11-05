# LeetCode 567 — Permutation in String (HashMap Approach)

**NeetCode category:** Sliding Window  
**Core technique:** Fixed-Size Sliding Window + Frequency HashMap  
**Difficulty:** Medium  
**Language:** TypeScript  
**Problem:** https://leetcode.com/problems/permutation-in-string/

---

## 1. Problem Statement — সহজ বাংলায়

তোমাকে দুটি string দেওয়া আছে: `s1` এবং `s2`। Check করতে হবে, `s2`-এর মধ্যে এমন কোনো substring আছে কি না, যেটি `s1`-এর permutation।

**Permutation মানে:** character একই থাকবে এবং প্রত্যেক character-এর frequency একই থাকবে; শুধু order আলাদা হতে পারে।

Example:

```ts
s1 = "ab";
s2 = "eidbaooo";

Output = true;
```

কারণ `s2`-এর মধ্যে `"ba"` আছে। `"ab"` এবং `"ba"` permutation, কারণ দুটিতেই `a` একবার এবং `b` একবার আছে।

আরেকটি example:

```ts
s1 = "ab";
s2 = "eidboaoo";

Output = false;
```

এখানে `"ab"` বা `"ba"`-এর মতো কোনো substring নেই।

---

## 2. Pattern কী এবং কীভাবে চিনব?

**Pattern: Fixed-Size Sliding Window + Frequency HashMap**

Problem-এর clues:

1. `s1`-এর permutation খুঁজতে হবে `s2`-এর ভিতরে।
2. Permutation হলে character count একই হতে হবে।
3. `s1`-এর permutation-এর character সংখ্যা সবসময় `s1.length`-এর সমান।
4. তাই `s2`-এর উপর fixed-size window চালাতে পারি, যেখানে window size হবে `s1.length`।

আমরা দুটি HashMap ব্যবহার করব:

- `s1Map` → original `s1`-এর character frequency রাখবে।
- `windowMap` → `s2`-এর current window-এর character frequency রাখবে।

দুটো Map-এর frequency একই হলেই current window হলো `s1`-এর permutation।

### Pattern recognition shortcut

> কোনো string-এর permutation/anagram অন্য string-এর মধ্যে খুঁজতে হলে character frequency compare করো। Substring-এর length fixed হলে Fixed-Size Sliding Window ব্যবহার করো।

---

## 3. কেন Window Size হবে `s1.length`?

Permutation-এ character বদলায় না, শুধু order বদলায়। তাই `s1`-এ যতগুলো character আছে, তার permutation-এও ঠিক ততগুলো character থাকবে।

```ts
s1 = "aab";

s1.length = 3;
```

তাই `s2` থেকে একবারে 3টি character নিয়ে check করব। 2 বা 4 character-এর window কখনোই `"aab"`-এর permutation হতে পারে না।

```ts
const k = s1.length;
```

আর যদি `s1.length > s2.length` হয়, তাহলে `s2`-এর মধ্যে ওই length-এর substring থাকতেই পারে না। তাই শুরুতেই `false` return করব:

```ts
if (k > s2.length) return false;
```

---

## 4. Complete TypeScript Solution — HashMap

```ts
class Solution {
  checkInclusion(s1: string, s2: string): boolean {
    const k = s1.length;

    if (k > s2.length) return false;

    const s1Map = new Map<string, number>();
    const windowMap = new Map<string, number>();

    // Step 1: Build frequency map of s1.
    for (const char of s1) {
      s1Map.set(char, (s1Map.get(char) ?? 0) + 1);
    }

    // Step 2: Build frequency map of the first window in s2.
    for (let i = 0; i < k; i++) {
      const char = s2[i];
      windowMap.set(char, (windowMap.get(char) ?? 0) + 1);
    }

    // Step 3: Compare the two frequency maps.
    const isSame = (): boolean => {
      if (s1Map.size !== windowMap.size) return false;

      for (const [char, count] of s1Map) {
        if (windowMap.get(char) !== count) {
          return false;
        }
      }

      return true;
    };

    // Check the first window.
    if (isSame()) return true;

    // Step 4: Slide the fixed-size window.
    for (let right = k; right < s2.length; right++) {
      // Remove the character leaving the window.
      const leftChar = s2[right - k];
      const leftCount = (windowMap.get(leftChar) ?? 0) - 1;

      if (leftCount === 0) {
        windowMap.delete(leftChar);
      } else {
        windowMap.set(leftChar, leftCount);
      }

      // Add the new character entering the window.
      const rightChar = s2[right];
      windowMap.set(
        rightChar,
        (windowMap.get(rightChar) ?? 0) + 1
      );

      // Check the updated window.
      if (isSame()) return true;
    }

    return false;
  }
}
```

---

## 5. Code-এর প্রতিটি অংশ Step by Step

### Step 1 — Window size বের করা

```ts
const k = s1.length;
```

`k` হলো fixed window size। কারণ permutation-এর length original string-এর length-এর সমান হবে।

### Step 2 — Length check

```ts
if (k > s2.length) return false;
```

যদি `s1` বড় হয় `s2`-এর চেয়ে, তাহলে `s2`-তে `s1`-এর সমান length-এর substring-ই নেই। তাই কোনো permutation পাওয়া সম্ভব নয়।

### Step 3 — দুটি Map তৈরি করা

```ts
const s1Map = new Map<string, number>();
const windowMap = new Map<string, number>();
```

| Map | কাজ |
|---|---|
| `s1Map` | Target string `s1`-এ character কতবার আছে, তা রাখে |
| `windowMap` | `s2`-এর current window-তে character কতবার আছে, তা রাখে |

`windowMap` দরকার, কারণ শুধু target-এর frequency জানলে হবে না; current window-তে কী আছে সেটাও জানতে হবে। তারপর দুটি frequency compare করব।

### Step 4 — `s1Map` তৈরি করা

```ts
for (const char of s1) {
  s1Map.set(char, (s1Map.get(char) ?? 0) + 1);
}
```

এখানে `(s1Map.get(char) ?? 0)` মানে:

- Character আগে Map-এ থাকলে তার count নাও।
- না থাকলে `0` ধরো।
- তারপর `1` বাড়িয়ে Map-এ set করো।

Example: `s1 = "aab"`

| Character | আগের count | নতুন count |
|---|---:|---:|
| a | 0 | 1 |
| a | 1 | 2 |
| b | 0 | 1 |

তাই:

```ts
s1Map = {
  a: 2,
  b: 1
};
```

### Step 5 — প্রথম window-এর `windowMap` তৈরি করা

```ts
for (let i = 0; i < k; i++) {
  const char = s2[i];
  windowMap.set(char, (windowMap.get(char) ?? 0) + 1);
}
```

যেহেতু `k = 3`, তাই `s2`-এর প্রথম 3টি character নেব। যেমন `s2 = "eidbaao"` হলে প্রথম window হলো `"eid"`।

```ts
windowMap = {
  e: 1,
  i: 1,
  d: 1
};
```

### Step 6 — `isSame()` function

```ts
const isSame = (): boolean => {
  if (s1Map.size !== windowMap.size) return false;

  for (const [char, count] of s1Map) {
    if (windowMap.get(char) !== count) {
      return false;
    }
  }

  return true;
};
```

এটি দুটি Map-এর frequency compare করে।

**প্রথমে `size` compare কেন?** `Map.size` হলো Map-এ থাকা distinct key-এর সংখ্যা। আলাদা distinct key count হলে frequency map same হতে পারে না।

তারপর `s1Map`-এর প্রতিটি `[char, count]` নিয়ে `windowMap`-এ ওই character-এর count একই কি না check করি। একটি count-ও আলাদা হলে `false`। সব count same হলে `true`।

মনে রাখবে, JavaScript-এ `map1 === map2` দিয়ে Map-এর contents compare করা যায় না; সেটা object reference compare করে। তাই entries compare করছি।

### Step 7 — প্রথম window check করা

```ts
if (isSame()) return true;
```

প্রথম window-টাই যদি permutation হয়, তাহলে আর window slide করার দরকার নেই। সরাসরি `true` return করব।

---

## 6. Sliding Window — পুরোনো character বের করা, নতুন character ঢোকানো

মূল loop:

```ts
for (let right = k; right < s2.length; right++) {
```

প্রথম window-এর index হলো `0` থেকে `k - 1`। তাই পরের নতুন character-এর index `k` থেকে শুরু হবে। `right` সেই নতুন character-এর index।

প্রতিবার window এক ঘর ডানে সরবে। তাই দুটি কাজ করতে হবে:

1. Window-এর বাম দিকের character-এর count কমাতে হবে।
2. নতুন ডান দিকের character-এর count বাড়াতে হবে।

### A. Window থেকে character বের করা

```ts
const leftChar = s2[right - k];
const leftCount = (windowMap.get(leftChar) ?? 0) - 1;
```

`right - k` হলো current window থেকে বের হওয়া character-এর index।

যদি `right = 3` এবং `k = 3` হয়:

```ts
leftChar = s2[3 - 3];
leftChar = s2[0]; // প্রথম character
```

তার count এক কমাই।

```ts
if (leftCount === 0) {
  windowMap.delete(leftChar);
} else {
  windowMap.set(leftChar, leftCount);
}
```

Count zero হলে key delete করি। কারণ current window-তে ওই character আর নেই। Count zero না হলে updated count Map-এ রাখি।

### B. নতুন character window-তে ঢোকানো

```ts
const rightChar = s2[right];
windowMap.set(
  rightChar,
  (windowMap.get(rightChar) ?? 0) + 1
);
```

`right` index-এর character-টি নতুন window-তে ঢুকছে। তাই তার frequency এক বাড়াই। আগে না থাকলে count `0` ধরে `1` করি।

### C. Updated window compare করা

```ts
if (isSame()) return true;
```

প্রতিটি slide-এর পরে `windowMap` update হয়েছে। এখন target `s1Map`-এর সঙ্গে compare করি। Match হলে `true` return করি।

সব window check করেও match না পেলে শেষে `false` return হবে।

---

## 7. Complete Dry Run — `s1 = "aab"`, `s2 = "eidbaao"`

### Initial setup

```ts
s1 = "aab";
s2 = "eidbaao";
k = 3;
```

Target frequency:

```ts
s1Map = {
  a: 2,
  b: 1
};
```

প্রথম window হলো `"eid"`:

```ts
windowMap = {
  e: 1,
  i: 1,
  d: 1
};
```

প্রথম comparison match নয়।

### Iteration 1 — `"eid"` থেকে `"idb"`

```ts
right = 3;
leftChar = s2[3 - 3]; // e
rightChar = s2[3];    // b
```

- `e` বের হচ্ছে: count `1 → 0`, তাই `e` delete।
- `b` ঢুকছে: count `0 → 1`।

Updated Map:

```ts
windowMap = {
  i: 1,
  d: 1,
  b: 1
};
```

Current window: `"idb"`। Match নয়।

### Iteration 2 — `"idb"` থেকে `"dba"`

```ts
right = 4;
leftChar = s2[4 - 3]; // i
rightChar = s2[4];    // a
```

- `i` বের হচ্ছে: count `1 → 0`, তাই `i` delete।
- `a` ঢুকছে: count `0 → 1`।

Updated Map:

```ts
windowMap = {
  d: 1,
  b: 1,
  a: 1
};
```

Current window: `"dba"`। Match নয়, কারণ `a` দরকার 2 বার, কিন্তু আছে 1 বার।

### Iteration 3 — `"dba"` থেকে `"baa"`

```ts
right = 5;
leftChar = s2[5 - 3]; // d
rightChar = s2[5];    // a
```

- `d` বের হচ্ছে: count `1 → 0`, তাই `d` delete।
- `a` ঢুকছে: count `1 → 2`।

Updated Map:

```ts
windowMap = {
  b: 1,
  a: 2
};
```

Current window: `"baa"`।

এখন `s1Map` এবং `windowMap`-এর frequency same:

```ts
s1Map = { a: 2, b: 1 };
windowMap = { b: 1, a: 2 };
```

Map-এ key-এর order আলাদা হতে পারে, কিন্তু frequency same। তাই `isSame()` true return করবে এবং main function `true` return করবে।

### Dry Run Summary

| Window | বের হয়েছে | ঢুকেছে | `windowMap` | Match? |
|---|---|---|---|---|
| `eid` | — | — | `e:1, i:1, d:1` | No |
| `idb` | e | b | `i:1, d:1, b:1` | No |
| `dba` | i | a | `d:1, b:1, a:1` | No |
| `baa` | d | a | `b:1, a:2` | **Yes** |

---

## 8. কেন প্রতিবার নতুন `windowMap` বানাচ্ছি না?

প্রতিটি window-এর জন্য নতুন Map বানালে current window-এর সব character আবার count করতে হবে। এতে repeated work বাড়বে।

আমরা একই `windowMap` update করি:

- outgoing character-এর count কমাই;
- count zero হলে key delete করি;
- incoming character-এর count বাড়াই।

এতে প্রতিবার পুরো window rebuild করতে হয় না। এটিই Sliding Window-এর মূল সুবিধা।

---

## 9. Common Mistakes

### Mistake 1: Window size ভুল নেওয়া

Window size হবে `s1.length`, কারণ permutation-এর length বদলায় না।

### Mistake 2: শুধু `s1Map` বানানো

Target-এর frequency জানলেই হবে না; current window-এর frequency-ও track করতে হবে। তাই `windowMap` দরকার।

### Mistake 3: `Map`-কে সরাসরি `===` দিয়ে compare করা

```ts
s1Map === windowMap
```

এটি Map-এর contents compare করে না; object reference compare করে। তাই entries ধরে count compare করতে হবে।

### Mistake 4: Outgoing character delete না করা

Window সরানোর সময় পুরোনো character-এর count কমাতে হবে। না হলে Map current window-কে represent করবে না।

### Mistake 5: Count zero হলেও key রেখে দেওয়া

Count zero হলে key delete করা ভালো। এতে `Map.size` distinct active character-এর সঠিক সংখ্যা দেখায় এবং comparison সহজ হয়।

### Mistake 6: Incoming character-এর count update না করা

প্রতিটি slide-এ নতুন character-এর count বাড়াতে হবে।

### Mistake 7: `right`-এর starting index ভুল করা

প্রথম window `0 ... k-1` পর্যন্ত। তাই নতুন character-এর index `k` থেকে শুরু হবে:

```ts
for (let right = k; right < s2.length; right++)
```

### Mistake 8: First window check বাদ দেওয়া

Sliding loop শুরু করার আগে initial window-টিও compare করতে হবে। সেটিই answer হতে পারে।

---

## 10. Edge Cases

| `s1` | `s2` | Output | Reason |
|---|---|---|---|
| `"ab"` | `"eidbaooo"` | `true` | `"ba"` is a permutation |
| `"ab"` | `"eidboaoo"` | `false` | No matching window |
| `"aab"` | `"eidbaao"` | `true` | `"baa"` has same frequencies |
| `"a"` | `"a"` | `true` | Single-character match |
| `"a"` | `"b"` | `false` | Character differs |
| `"abc"` | `"ab"` | `false` | `s1` is longer than `s2` |
| `"aa"` | `"ab"` | `false` | Required duplicate `a` is missing |

---

## 11. Complexity Analysis — TC / SC

Let:
- `m = s1.length`
- `n = s2.length`
- `k` = number of possible distinct characters in the alphabet.

LeetCode 567-এর constraint অনুযায়ী strings-এ lowercase English letters (`a` to `z`) থাকে। তাই `k ≤ 26`।

### Time Complexity: `O(n × 26) = O(n)`

- `s1Map` তৈরি করতে `O(m)` সময় লাগে।
- প্রথম window-এর Map তৈরি করতে `O(m)` সময় লাগে।
- `s2`-এর সর্বোচ্চ `O(n)`টি window check হতে পারে।
- প্রতিটি `isSame()` call-এ সর্বোচ্চ 26টি distinct character compare হয়।
- প্রতিটি slide-এ outgoing এবং incoming character update করা average `O(1)` Map operations।

তাই মোট:

\[
O(m + m + 26n) = O(m+n)
\]

যেহেতু শুরুতেই `m > n` হলে return করি, এবং alphabet fixed 26, তাই সাধারণভাবে বলা যায়:

\[
\boxed{O(n)}
\]

### Space Complexity: `O(26) = O(1)`

- `s1Map`-এ সর্বোচ্চ 26টি distinct lowercase letter থাকবে।
- `windowMap`-এও সর্বোচ্চ 26টি distinct lowercase letter থাকবে।
- `i`, `right`, `leftChar`, `rightChar` ইত্যাদি fixed variables `O(1)`।

তাই:

\[
\boxed{O(1)}
\]

### General alphabet হলে

যদি character set fixed না হয় এবং `k`টি distinct character থাকতে পারে, তাহলে Map comparison-এর time `O(k)` per window এবং space `O(k)` পর্যন্ত হতে পারে। এই problem-এর lowercase English constraint-এর কারণে `k ≤ 26`, তাই এগুলো constant।

---

## 12. HashMap vs Frequency Array

| বিষয় | Frequency Array | HashMap |
|---|---|---|
| Character lookup | `charCodeAt() - 97` index | Character key |
| Frequency update | `count[index]++` | `map.set()` |
| Comparison | 26টি index | Map-এর entries |
| Time (এই problem) | `O(26n) = O(n)` | `O(26n) = O(n)` |
| Space (এই problem) | `O(26) = O(1)` | `O(26) = O(1)` |
| Flexibility | Fixed alphabet-এর জন্য convenient | Character-key frequency map-এর জন্য flexible |

এই problem-এ দুটো approach-এর Big-O complexity same। তবে fixed lowercase alphabet হওয়ায় array সাধারণত simpler এবং Map-এর তুলনায় কম overhead হতে পারে। HashMap approach বুঝলে অন্য frequency-count problems-এ কাজে লাগবে।

---

## 13. Interview-এ Approach কীভাবে Explain করবে?

> I first build a frequency map for `s1`. Since any permutation of `s1` must have the same length, I use a fixed-size window of length `s1.length` over `s2`. I build a frequency map for the first window and compare it with the target map. Then I slide the window one character at a time: decrement the outgoing character, remove its key if the count becomes zero, and increment the incoming character. After each update, I compare the two frequency maps. If they match, a permutation exists and I return true. If no window matches, I return false.

---

## 14. Revision Checklist

- [ ] Permutation মানে character frequency same, order আলাদা হতে পারে — বুঝি।
- [ ] কেন window size `s1.length` হবে — explain করতে পারি।
- [ ] `s1Map` এবং `windowMap`-এর আলাদা কাজ বলতে পারি।
- [ ] `(map.get(char) ?? 0) + 1` বুঝি।
- [ ] `Map.size` কেন compare করছি — বলতে পারি।
- [ ] কেন Map-কে সরাসরি `===` দিয়ে compare করা যায় না — জানি।
- [ ] `right - k` দিয়ে outgoing character কীভাবে বের হয় — বুঝি।
- [ ] Count zero হলে key delete করার কারণ জানি।
- [ ] প্রতিটি slide-এর পরে `isSame()` কেন call করি — explain করতে পারি।
- [ ] Equal ও duplicate-character example dry run করতে পারি।
- [ ] এই constraint-এ TC `O(n)` এবং SC `O(1)` justify করতে পারি।

### One-line Memory Trick

> `s1Map` = target frequency, `windowMap` = current window frequency. Window size `s1.length`; এক character বের করো, এক character ঢোকাও, তারপর frequency compare করো.