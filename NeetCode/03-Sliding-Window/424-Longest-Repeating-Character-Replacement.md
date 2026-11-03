# LeetCode 424 — Longest Repeating Character Replacement

**NeetCode category:** Sliding Window  
**Core technique:** Variable-size Sliding Window + Frequency Count + Greedy  
**Difficulty:** Medium  
**Language:** TypeScript  
**Problem:** https://leetcode.com/problems/longest-repeating-character-replacement/

---

## 1. Problem Statement — সহজ বাংলায়

তোমাকে একটি uppercase English string `s` এবং একটি integer `k` দেওয়া থাকবে। সর্বোচ্চ `k`টি character replace করে এমন একটি longest substring-এর length বের করতে হবে, যার সব character একই করা সম্ভব।

- Substring continuous হতে হবে।
- সর্বোচ্চ `k`টি replacement করা যাবে।
- সব character-কে একই character-এ convert করতে হবে।
- শুধু maximum length return করতে হবে।

### Example 1

```ts
s = "ABAB";
k = 2;

// Replace both B's with A's:
ABAB -> AAAA
// Output: 4
```

### Example 2

```ts
s = "AABABBA";
k = 1;

// "AABA" can become "AAAA" by replacing one B.
// Output: 4
```

---

## 2. Pattern কী এবং কীভাবে চিনব?

**Primary pattern: Variable-size Sliding Window**

Problem statement-এর clue:

1. **Substring** → continuous range দরকার।
2. **Longest** → maximum window length বের করতে হবে।
3. **At most k replacements** → window-কে valid করতে কয়টি character বদলাতে হবে, তা count করতে হবে।

তাই Variable-size Sliding Window + Frequency Count ব্যবহার করব।

### Frequency count কেন?

ধরো current window:

```text
A A B A B
```

| Character | Frequency |
|---|---:|
| A | 3 |
| B | 2 |

সব character-কে `A` বানাতে শুধু দুইটি `B` replace করতে হবে। তাই সবচেয়ে বেশি frequency-র character-টা রেখে বাকি character-গুলো replace করব।

**Pattern recognition shortcut:**

> Substring + Longest + At most k changes/replacements → Variable-size Sliding Window + Frequency Count.

---

## 3. সবচেয়ে Important Formula

\[
\text{Replacements Needed} = \text{Window Length} - \text{Max Frequency}
\]

Window length:

\[
right-left+1
\]

তাই:

\[
\boxed{(right-left+1)-maxFreq \leq k}
\]

- Condition true হলে সর্বোচ্চ `k` replacement দিয়ে window-কে একই character-এ convert করা যায়।
- Condition false হলে window shrink করতে হবে।

Example:

```text
Window = A A B A B
Length = 5
maxFreq = 3
Replacements needed = 5 - 3 = 2
```

- `k = 2` হলে valid।
- `k = 1` হলে invalid; shrink করতে হবে।

**মনে রাখবে:** `k` হলো replace করা যাবে এমন character-এর maximum সংখ্যা। তাই শুধু `windowLength > k` check করলেই হবে না; `maxFreq` বাদ দিতে হবে।

---

## 4. Brute Force Approach

সব possible substring check করার কথা ভাবি।

1. প্রতিটি starting index `i` থেকে window শুরু করব।
2. Ending index `j` এক এক করে বাড়াব।
3. Frequency count update করব।
4. `windowLength - maxFreq <= k` হলে window valid।
5. Maximum length update করব।

```ts
class Solution {
  characterReplacement(s: string, k: number): number {
    let maxLength = 0;

    for (let i = 0; i < s.length; i++) {
      const freq = new Array(26).fill(0);
      let maxFreq = 0;

      for (let j = i; j < s.length; j++) {
        const index = s.charCodeAt(j) - 65;
        freq[index]++;
        maxFreq = Math.max(maxFreq, freq[index]);

        const windowLength = j - i + 1;
        const replacementsNeeded = windowLength - maxFreq;

        if (replacementsNeeded <= k) {
          maxLength = Math.max(maxLength, windowLength);
        }
      }
    }

    return maxLength;
  }
}
```

**Complexity:**
- Time: `O(n²)` — প্রতিটি starting index-এর জন্য ending index scan করি।
- Auxiliary Space: `O(1)` — fixed 26-size frequency array।

Repeated scanning কমাতে Sliding Window ব্যবহার করব।

---

# Method 1 — Sliding Window + Frequency Array

## 5. কেন Frequency Array?

LeetCode 424-এর constraints-এ string-এ uppercase English letters `A-Z` থাকে। মোট 26টি character, তাই fixed-size array ব্যবহার করতে পারি।

```ts
const freq = new Array(26).fill(0);
```

Character-এর index বের করি:

```ts
const index = s.charCodeAt(right) - 65;
```

| Character | ASCII code | Array index |
|---|---:|---:|
| A | 65 | 0 |
| B | 66 | 1 |
| C | 67 | 2 |
| ... | ... | ... |
| Z | 90 | 25 |

Example:

```ts
"B".charCodeAt(0) - 65; // 66 - 65 = 1
```

## 6. Variables

```ts
let left = 0;
let maxFreq = 0;
let maxLength = 0;

const freq = new Array(26).fill(0);
```

- `left`: current window-এর starting index।
- `right`: current window-এর ending index।
- `freq`: প্রতিটি character কতবার এসেছে।
- `maxFreq`: এখন পর্যন্ত দেখা highest character frequency।
- `maxLength`: পাওয়া maximum window length।

## 7. Optimal Frequency Array — TypeScript

```ts
class Solution {
  characterReplacement(s: string, k: number): number {
    let left = 0;
    let maxLength = 0;
    let maxFreq = 0;

    const freq = new Array(26).fill(0);

    for (let right = 0; right < s.length; right++) {
      // Convert current character to index 0..25.
      const index = s.charCodeAt(right) - 65;

      // Add current character to the window.
      freq[index]++;

      // Update highest frequency seen so far.
      maxFreq = Math.max(maxFreq, freq[index]);

      // Calculate how many replacements are needed.
      const windowLength = right - left + 1;
      const replacementsNeeded = windowLength - maxFreq;

      // Shrink once if replacement budget is exceeded.
      if (replacementsNeeded > k) {
        const leftIndex = s.charCodeAt(left) - 65;
        freq[leftIndex]--;
        left++;
      }

      // Keep the best length seen so far.
      maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
  }
}
```

## 8. Code Line by Line

### A. Current character-এর frequency বাড়ানো

```ts
const index = s.charCodeAt(right) - 65;
freq[index]++;
```

Right pointer যে character-এ আছে, তার frequency এক বাড়াই।

### B. `maxFreq` update

```ts
maxFreq = Math.max(maxFreq, freq[index]);
```

Current character-এর updated frequency এবং আগের `maxFreq` compare করি। বড় value-টা রাখি।

| Added character | A count | B count | maxFreq |
|---|---:|---:|---:|
| A | 1 | 0 | 1 |
| A | 2 | 0 | 2 |
| B | 2 | 1 | 2 |
| A | 3 | 1 | 3 |
| B | 3 | 2 | 3 |

### C. Window length

```ts
const windowLength = right - left + 1;
```

`left` ও `right`—দুই endpoint-ই window-এর অংশ, তাই `+1`।

### D. Replacement needed

```ts
const replacementsNeeded = windowLength - maxFreq;
```

সবচেয়ে বেশি frequency-র character-টিকে রেখে বাকি character-গুলো replace করব।

### E. Invalid হলে shrink

```ts
if (replacementsNeeded > k) {
  const leftIndex = s.charCodeAt(left) - 65;
  freq[leftIndex]--;
  left++;
}
```

Leftmost character-এর frequency কমাই এবং `left++` করে window-এর শুরু এক ঘর সামনে আনি।

### F. Maximum length update

```ts
maxLength = Math.max(maxLength, right - left + 1);
```

Current window length এবং আগের best length-এর মধ্যে বড়টি রেখে দিই।

---

## 9. Full Dry Run — `AABABBA`, k = 1

Input:

```ts
s = "AABABBA";
k = 1;
```

Initially:

```ts
left = 0;
maxFreq = 0;
maxLength = 0;
```

| Right | Added char | Window before shrink | maxFreq | Needed replacements | Action | Length after action | maxLength |
|---:|:---:|---|---:|---:|---|---:|---:|
| 0 | A | A | 1 | 0 | Valid | 1 | 1 |
| 1 | A | AA | 2 | 0 | Valid | 2 | 2 |
| 2 | B | AAB | 2 | 1 | Valid | 3 | 3 |
| 3 | A | AABA | 3 | 1 | Valid | 4 | 4 |
| 4 | B | AABAB | 3 | 2 | Shrink once | 4 | 4 |
| 5 | B | ABABB | 3 | 2 | Shrink once | 4 | 4 |
| 6 | A | ABBA | 3 | 2 | Shrink once | 4 | 4 |

Final:

```ts
return maxLength; // 4
```

একটি valid substring হলো `AABA`। একটি `B`-কে `A` দিয়ে replace করলে `AAAA` হয়। তাই output `4`।

---

## 10. `if` কেন, `while` কেন নয়?

এটি problem-এর confusing অংশ।

Standard optimized solution-এ:

```ts
if (windowLength - maxFreq > k) {
  const leftIndex = s.charCodeAt(left) - 65;
  freq[leftIndex]--;
  left++;
}
```

এখানে `maxFreq` হলো **historical maximum frequency** — এখন পর্যন্ত দেখা highest frequency। Shrink করার সময় এটাকে decrease বা recompute করি না।

তাই shrink করার পর current window সবসময় strictly valid নাও হতে পারে। কিন্তু এই optimized technique-এর লক্ষ্য হলো maximum achievable length বের করা; প্রতিটি iteration-এ perfectly valid window রাখা নয়।

### Example: `AABBB`, k = 1

`AABBB` window-তে:

- Window length = 5
- Historical `maxFreq` = 3
- Estimated replacements = 5 - 3 = 2
- `2 > 1`, তাই left একবার shrink করি।
- Window length হয় 4; current window হলো `ABBB`, যা valid (একটি A replace করলেই BBBB)।

আরও কিছু input-এ stale `maxFreq` থাকার কারণে current window technically invalid থাকতে পারে। কিন্তু সেই length আগে পাওয়া valid maximum-এর বেশি হয় না, তাই final maximum length ঠিক থাকে।

### কখন `while` ব্যবহার করব?

যদি প্রতিটি iteration শেষে current window-কে strictly valid রাখতে চাই, তাহলে shrink করার পর actual `maxFreq` আবার calculate করতে হবে।

Fixed alphabet `A-Z` হওয়ায় 26টি count scan করা constant work।

```ts
while ((right - left + 1) - maxFreq > k) {
  const leftIndex = s.charCodeAt(left) - 65;

  freq[leftIndex]--;
  left++;

  // Recalculate the actual maximum frequency.
  maxFreq = Math.max(...freq);
}
```

এই version-এ current window সত্যিই valid রাখা হয়। Time complexity `O(26n)`, অর্থাৎ fixed alphabet-এর জন্য `O(n)`।

**Revision-এর জন্য standard `if` + historical `maxFreq` version-টাই আগে practice করো।**

---

# Method 2 — Sliding Window + HashMap

## 11. HashMap কেন ব্যবহার করব?

Frequency Array-তে `A-Z`-এর জন্য 26টা fixed index ব্যবহার করি। HashMap-এ character-কে সরাসরি key হিসেবে ব্যবহার করতে পারি।

```ts
const freq = new Map<string, number>();
```

Frequency update:

```ts
freq.set(char, (freq.get(char) ?? 0) + 1);
```

এই problem-এ uppercase `A-Z` fixed থাকায় array simple, তবে Map দিয়েও একই algorithm করা যায়।

## 12. Optimal HashMap — TypeScript

```ts
class Solution {
  characterReplacement(s: string, k: number): number {
    let left = 0;
    let maxLength = 0;
    let maxFreq = 0;

    const freq = new Map<string, number>();

    for (let right = 0; right < s.length; right++) {
      const char = s[right];

      // Increase current character's frequency.
      const newCount = (freq.get(char) ?? 0) + 1;
      freq.set(char, newCount);

      // Update historical maximum frequency.
      maxFreq = Math.max(maxFreq, newCount);

      const windowLength = right - left + 1;
      const replacementsNeeded = windowLength - maxFreq;

      // Shrink once if replacement budget is exceeded.
      if (replacementsNeeded > k) {
        const leftChar = s[left];
        const leftCount = freq.get(leftChar) ?? 0;

        freq.set(leftChar, leftCount - 1);
        left++;
      }

      maxLength = Math.max(
        maxLength,
        right - left + 1
      );
    }

    return maxLength;
  }
}
```

### HashMap version-এ কী change হলো?

**Frequency Array:**

```ts
const index = s.charCodeAt(right) - 65;
freq[index]++;
maxFreq = Math.max(maxFreq, freq[index]);
```

**HashMap:**

```ts
const char = s[right];
const newCount = (freq.get(char) ?? 0) + 1;

freq.set(char, newCount);
maxFreq = Math.max(maxFreq, newCount);
```

Left side remove:

```ts
// Array
const leftIndex = s.charCodeAt(left) - 65;
freq[leftIndex]--;

// Map
const leftChar = s[left];
freq.set(leftChar, (freq.get(leftChar) ?? 0) - 1);
```

মূল algorithm বদলায়নি; frequency store এবং access করার পদ্ধতি বদলেছে।

---

## 13. Array vs HashMap — TC / SC Comparison

Let `n = s.length` এবং `kAlphabet` = possible character-set size।

| Approach | Time | Auxiliary Space | Why |
|---|---:|---:|---|
| Frequency Array (`A-Z`) | `O(n)` | `O(1)` | Fixed 26-size array |
| HashMap (`A-Z`) | `O(n)` average | `O(1)` | At most 26 keys |
| HashMap (general character set) | `O(n)` average | `O(min(n, kAlphabet))` | Stores distinct characters seen |

### Time Complexity কেন `O(n)`?

- `right` pointer একবার পুরো string traverse করে।
- `left` pointer শুধু সামনে move করে; সর্বোচ্চ `n` বার।
- প্রতিটি iteration-এ constant number of array/Map operations হয়।
- Map operations average `O(1)`।

তাই average time:

[
\boxed{O(n)}
]

### Space Complexity কেন Array-তে `O(1)`?

Array size fixed 26। Input string বড় হলেও array বড় হয় না।

[
\boxed{O(1)}
]

### Space Complexity কেন Map-এ `O(1)` for this problem?

LeetCode 424-এর constraints-এ uppercase English letters `A-Z`। তাই Map-এ সর্বোচ্চ 26টি key থাকতে পারে।

[
\boxed{O(1)}
]

যদি arbitrary character set হয়, Map-এর space:

[
\boxed{O(\min(n,kAlphabet))}
]

**Conclusion:** এই exact problem-এর constraints-এ Array ও Map—দুটোর TC `O(n)` এবং SC `O(1)`। General character set হলে Map-এর space input-এর সঙ্গে বাড়তে পারে।

---

## 14. Edge Cases

| Input | k | Output | Reason |
|---|---:|---:|---|
| `"ABAB"` | 2 | 4 | দুইটি B replace করে AAAA |
| `"AABABBA"` | 1 | 4 | `"AABA"` valid করা যায় |
| `"AAAA"` | 2 | 4 | সব character আগেই same |
| `"ABCDE"` | 1 | 2 | একটি adjacent pair-এ 1 replacement |
| `"AAAAA"` | 0 | 5 | Replacement দরকার নেই |
| `"ABBB"` | 2 | 4 | দুই A replace করে BBBB |
| `"A"` | 0 | 1 | Single character |
| `""` | 2 | 0 | Empty string |

LeetCode-এর constraints uppercase English string দেয়। Empty string-এর জন্য code স্বাভাবিকভাবেই `0` return করে।

---

## 15. Common Mistakes

### Mistake 1: শুধু window length-এর সঙ্গে `k` compare করা

ভুল:

```ts
if (windowLength > k) {
  // shrink
}
```

সঠিক:

```ts
if (windowLength - maxFreq > k) {
  // shrink
}
```

কারণ replacement needed হলো `windowLength - maxFreq`।

### Mistake 2: `maxFreq` বাদ দেওয়া

Window-এর সবচেয়ে frequent character-টিকে রেখে বাকি character-গুলো replace করব। তাই max frequency বাদ দিতে হবে।

### Mistake 3: `maxFreq` shrink-এর সময় decrease করা

Standard optimized `if` approach-এ `maxFreq` historical maximum হিসেবে রাখি। Shrink-এর সময় recompute করি না।

### Mistake 4: Left character-এর frequency কমাতে ভুলে যাওয়া

Shrink করলে:

```ts
freq[leftIndex]--;
left++;
```

দুটো কাজই করতে হবে।

### Mistake 5: `if` বনাম `while` গুলিয়ে ফেলা

- Standard optimized historical `maxFreq` version: `if`।
- Strictly valid window রাখতে চাইলে: `while` এবং actual `maxFreq` recompute।

### Mistake 6: `Math.max(maxLength, ...)` বুঝতে না পারা

```ts
maxLength = Math.max(maxLength, right - left + 1);
```

Current window length এবং আগের best length-এর মধ্যে বড়টি retain করি।

---

## 16. Interview-এ Approach কীভাবে Explain করবে?

নিজেকে প্রশ্ন করবে:

1. Substring কি continuous? — হ্যাঁ।
2. Longest length বের করতে হবে? — হ্যাঁ।
3. Window-এর validity কি frequency দিয়ে check করা যায়? — হ্যাঁ।
4. Current window থেকে character frequency maintain করা যায়? — হ্যাঁ।

তাই Variable-size Sliding Window + Frequency Count ব্যবহার করব।

### Interview-ready explanation

> I use a variable-size sliding window with a frequency array. I maintain the highest character frequency seen so far. The number of replacements needed is the window length minus this maximum frequency. If that exceeds k, I shrink the window from the left and decrease the outgoing character's count. I update the maximum window length at each step. Since both pointers only move forward and the alphabet has a fixed size of 26, the time complexity is O(n) and auxiliary space is O(1).

---

## 17. Related Sliding Window Problems

| Problem | Main technique |
|---|---|
| 3. Longest Substring Without Repeating Characters | Sliding Window + Set / HashMap |
| 121. Best Time to Buy and Sell Stock | Running Minimum + Greedy One Pass |
| 424. Longest Repeating Character Replacement | Sliding Window + Frequency Count |
| 567. Permutation in String | Fixed-size Sliding Window + Frequency Count |
| 76. Minimum Window Substring | Sliding Window + HashMap |
| 209. Minimum Size Subarray Sum | Variable-size Sliding Window |

---

## 18. Final Revision Checklist

- [ ] Problem statement বুঝি: at most `k` replacements।
- [ ] কেন এটি Variable-size Sliding Window?
- [ ] `maxFreq` কী track করে?
- [ ] `windowLength - maxFreq` কেন replacements needed?
- [ ] কেন condition `> k`?
- [ ] Left side থেকে character বাদ দিলে frequency কেন কমাই?
- [ ] Standard optimized version-এ `if` কেন?
- [ ] `maxFreq` কেন historical maximum হিসেবে রাখা হয়?
- [ ] Array ও HashMap দুটো solution লিখতে পারি।
- [ ] Array এবং Map-এর TC/SC difference explain করতে পারি।
- [ ] `AABABBA`, `k=1` dry run করতে পারি।
- [ ] Edge cases test করতে পারি।

### One-line Memory Trick

> Window expand করো → frequency update করো → `windowLength - maxFreq` দিয়ে replacements count করো → সেটা `k`-এর বেশি হলে left shrink করো → maximum length update করো।
