# LeetCode 3 — Longest Substring Without Repeating Characters

**NeetCode category:** Sliding Window  
**Core technique:** Variable-size Sliding Window + HashMap  
**Difficulty:** Medium | **Language:** TypeScript  
**Problem:** https://leetcode.com/problems/longest-substring-without-repeating-characters/

---

## 1. Problem Statement — সহজ বাংলায়

একটি string `s` দেওয়া থাকবে। এমন একটি **longest substring-এর length** return করতে হবে, যেখানে কোনো character repeat করবে না।

- **Substring** মানে continuous part of a string; মাঝখান থেকে character skip করা যাবে না।
- Current substring-এর মধ্যে কোনো character দুইবার থাকতে পারবে না।
- শুধু length return করতে হবে, substring return করতে হবে না।

Examples:

```ts
s = "abcabcbb"; // Output: 3 ("abc")
s = "bbbbb";    // Output: 1 ("b")
s = "pwwkew";   // Output: 3 ("wke")
```

`"pwke"` substring নয়, কারণ মাঝখানের character skip করা হয়েছে।

## 2. Pattern কী এবং কীভাবে চিনব?

**NeetCode Pattern: Sliding Window — Variable-size window**

Problem statement-এ clues:

1. **Substring** → continuous range দরকার।
2. **Longest** → maximum window length বের করতে হবে।
3. **Without repeating** → window-এর মধ্যে duplicate রাখা যাবে না।

তাই Variable-size Sliding Window ভাবব।

- নতুন character unique হলে window expand হবে।
- Duplicate current window-এর মধ্যে এলে left side shrink হবে।
- প্রতিটি valid window-এর length দিয়ে maximum update করব।

**HashMap কেন?** প্রতিটি character সর্বশেষ কোন index-এ দেখা গেছে, সেটা store করতে চাই। তাই:

```ts
const lastSeen = new Map<string, number>();
```

Map থেকে previous index পেলে left pointer একবারে সঠিক জায়গায় jump করতে পারে।

## 3. Window-এর meaning

- `left`: current window-এর starting index।
- `right`: current window-এর ending index।

Current window:

```ts
s.substring(left, right + 1)
```

Window length:

```ts
right - left + 1
```

`+1` লাগে, কারণ left এবং right—দুই endpoint-ই window-এর অংশ।

## 4. Brute Force Approach

প্রতিটি index থেকে substring শুরু করব। ডান দিকে character নিতে থাকব; কোনো duplicate পেলে ওই starting index-এর scan বন্ধ করব।

```ts
class Solution {
  lengthOfLongestSubstring(s: string): number {
    let maxLength = 0;

    for (let i = 0; i < s.length; i++) {
      const seen = new Set<string>();

      for (let j = i; j < s.length; j++) {
        const char = s[j];

        if (seen.has(char)) break;

        seen.add(char);
        maxLength = Math.max(maxLength, j - i + 1);
      }
    }

    return maxLength;
  }
}
```

**Complexity**
- Time: `O(n²)` — প্রতিটি starting index থেকে scan করতে হতে পারে।
- Auxiliary space: `O(min(n, k))` for Set; worst case `O(n)`. Here `k` is the character-set size.

Brute force overlapping substrings বারবার scan করে। এই repeated work কমানোর জন্য Sliding Window ব্যবহার করব।

## 5. Optimal Approach — Sliding Window + HashMap

Initialize:

```ts
let left = 0;
let maxLength = 0;
const lastSeen = new Map<string, number>();
```

প্রতিটি `right` index-এর জন্য:

**Step 1 — Current character নাও**

```ts
const char = s[right];
```

**Step 2 — আগের index check করো**

```ts
const previousIndex = lastSeen.get(char);
```

**Step 3 — Duplicate current window-এর মধ্যে থাকলে left move করো**

```ts
if (
  previousIndex !== undefined &&
  previousIndex >= left
) {
  left = previousIndex + 1;
}
```

**Step 4 — Latest index update করে window length calculate করো**

```ts
lastSeen.set(char, right);

const currentLength = right - left + 1;
maxLength = Math.max(maxLength, currentLength);
```

### `previousIndex >= left` condition কেন?

আগে character এসেছে মানেই current window-তে duplicate আছে, এমন নয়। তার আগের occurrence যদি current window-এর বাইরে থাকে, তাহলে left move করার দরকার নেই।

`previousIndex >= left` মানে old occurrence current window-এর ভেতরে আছে। তখন duplicate বাদ দিতে:

```ts
left = previousIndex + 1;
```

Left কখনো পেছনে যাবে না।

## 6. Complete Optimal TypeScript Solution

```ts
class Solution {
  lengthOfLongestSubstring(s: string): number {
    let left = 0;
    let maxLength = 0;

    // Character -> most recent index
    const lastSeen = new Map<string, number>();

    for (let right = 0; right < s.length; right++) {
      const char = s[right];
      const previousIndex = lastSeen.get(char);

      // Move left only if the old occurrence
      // is inside the current window.
      if (
        previousIndex !== undefined &&
        previousIndex >= left
      ) {
        left = previousIndex + 1;
      }

      // Store the latest index of this character.
      lastSeen.set(char, right);

      const currentLength = right - left + 1;
      maxLength = Math.max(maxLength, currentLength);
    }

    return maxLength;
  }
}
```

TypeScript note: যদি `noUncheckedIndexedAccess` enabled থাকে, `const char = s[right]!;` ব্যবহার করতে পারো। Loop-এর condition অনুযায়ী `right` valid index।

## 7. Dry Run 1 — `abcabcbb`

Input:

```text
Index:   0  1  2  3  4  5  6  7
String:  a  b  c  a  b  c  b  b
```

| Right | Char | Previous index | Left after check | Current window | Length | Max |
|---:|:---:|---:|---:|:---:|---:|---:|
| 0 | a | — | 0 | `a` | 1 | 1 |
| 1 | b | — | 0 | `ab` | 2 | 2 |
| 2 | c | — | 0 | `abc` | 3 | 3 |
| 3 | a | 0 | 1 | `bca` | 3 | 3 |
| 4 | b | 1 | 2 | `cab` | 3 | 3 |
| 5 | c | 2 | 3 | `abc` | 3 | 3 |
| 6 | b | 4 | 5 | `cb` | 2 | 3 |
| 7 | b | 6 | 7 | `b` | 1 | 3 |

Final answer: `3` (একটি longest substring হলো `"abc"`)।

## 8. Dry Run 2 — কেন `previousIndex >= left` দরকার? (`abba`)

```text
Index:   0  1  2  3
String:  a  b  b  a
```

- Right 0, `a`: আগে নেই। Window `a`, left 0, max 1। Store `a -> 0`।
- Right 1, `b`: আগে নেই। Window `ab`, left 0, max 2। Store `b -> 1`।
- Right 2, `b`: previous index 1। `1 >= left(0)`, তাই duplicate window-এর ভিতরে। `left = 1 + 1 = 2`। Window `b`। Store `b -> 2`।
- Right 3, `a`: previous index 0, কিন্তু left 2। `0 >= 2` false; old `a` current window-এর বাইরে। Left 2-ই থাকবে। Window `ba`, length 2।

| Right | Char | Previous index | Left | Window | Length |
|---:|:---:|---:|---:|:---:|---:|
| 0 | a | — | 0 | `a` | 1 |
| 1 | b | — | 0 | `ab` | 2 |
| 2 | b | 1 | 2 | `b` | 1 |
| 3 | a | 0 | 2 | `ba` | 2 |

Output: `2`।

যদি condition ছাড়া `left = previousIndex + 1` করি, শেষ ধাপে left আবার 1 হয়ে পেছনে চলে যাবে—এটা ভুল। Alternative safe expression:

```ts
left = Math.max(left, previousIndex + 1);
```

## 9. Edge Cases

| Input | Output | Explanation |
|---|---:|---|
| `""` | 0 | Empty string |
| `"a"` | 1 | Single character |
| `"bbbbb"` | 1 | সব character একই |
| `"abcdef"` | 6 | কোনো duplicate নেই |
| `"abcabcbb"` | 3 | `"abc"` |
| `"pwwkew"` | 3 | `"wke"` |
| `"abba"` | 2 | `"ab"` অথবা `"ba"` |
| `"tmmzuxt"` | 5 | `"mzuxt"` |

Empty string হলে loop চলবে না; `maxLength = 0` return হবে।

## 10. Complexity Analysis

Let `n = s.length`, and `k` be the character-set size.

**Time: `O(n)` average**
- Right pointer প্রতিটি character একবার process করে।
- Left pointer শুধু সামনে যায়, কখনো পিছনে যায় না।
- HashMap `get` / `set` average `O(1)`।

**Auxiliary Space: `O(min(n, k))`**
- Map-এ প্রতিটি distinct character-এর latest index রাখি।
- General worst case-এ `O(n)`।

## 11. Alternative — Sliding Window + Set

Set-এ current window-এর characters রাখব। Duplicate পেলে left থেকে remove করতে থাকব যতক্ষণ duplicate চলে যায়।

```ts
class Solution {
  lengthOfLongestSubstring(s: string): number {
    let left = 0;
    let maxLength = 0;
    const window = new Set<string>();

    for (let right = 0; right < s.length; right++) {
      const char = s[right];

      while (window.has(char)) {
        window.delete(s[left]);
        left++;
      }

      window.add(char);

      maxLength = Math.max(
        maxLength,
        right - left + 1
      );
    }

    return maxLength;
  }
}
```

| HashMap approach | Set approach |
|---|---|
| Character-এর latest index রাখে | Current window-এর characters রাখে |
| Duplicate পেলে left jump করতে পারে | Duplicate না যাওয়া পর্যন্ত left move করে |
| `previousIndex >= left` condition | `while (window.has(char))` |
| Average `O(n)` time | Average `O(n)` time |

দুটোরই auxiliary space `O(min(n, k))`। প্রথমে HashMap approach ভালোভাবে বোঝো।

## 12. Common Mistakes

1. **Substring vs subsequence:** substring continuous; character skip করা যাবে না।
2. **Length formula:** `right - left + 1`; `+1` বাদ দেবে না।
3. **Unconditional left update:** duplicate window-এর বাইরে থাকলে left move করা যাবে না।
4. **Latest index update ভুলে যাওয়া:** প্রতিবার `lastSeen.set(char, right)` করতে হবে।
5. **Fixed-size window ধরে নেওয়া:** এখানে window expand ও shrink করে।
6. **Left পেছনে চলে যাওয়া:** left সবসময় monotonic (শুধু সামনে)।

## 13. Interview-এ Approach কীভাবে চিনবে?

নিজেকে প্রশ্ন করো:

- Problem কি substring বা subarray নিয়ে?
- Range কি continuous?
- Longest বা shortest valid range খুঁজছি?
- Window-এর validity কি maintain করা যায়?
- Validity ভাঙলে left pointer move করলেই কি duplicate remove হবে?

এখানে উত্তর হ্যাঁ। তাই Variable-size Sliding Window। Character-এর previous index দ্রুত খুঁজতে HashMap ব্যবহার করি।

## 14. Interview-ready Explanation (30–45 seconds)

“I use a variable-size sliding window with a HashMap. The map stores the most recent index of each character. I expand the window using the right pointer. If the current character was previously seen inside the current window, I move the left pointer to one position after that previous occurrence. I then update the character’s latest index and calculate the current window length. I keep the maximum length seen. The average time complexity is O(n), with O(min(n, k)) auxiliary space.”

## 15. Related Sliding Window Practice

| Problem | Main idea |
|---|---|
| 121. Best Time to Buy and Sell Stock | Running minimum / one pass |
| 3. Longest Substring Without Repeating Characters | Variable window + last-seen HashMap |
| 567. Permutation in String | Fixed-size window + frequency count |
| 424. Longest Repeating Character Replacement | Variable window + frequency count |
| 209. Minimum Size Subarray Sum | Variable window + running sum |

## 16. Final Revision Checklist

- [ ] Substring মানে continuous part বুঝি।
- [ ] কেন Sliding Window category, explain করতে পারি।
- [ ] `left` ও `right` pointer-এর কাজ জানি।
- [ ] `right - left + 1` কেন window length, বুঝি।
- [ ] HashMap-এ latest index store করতে পারি।
- [ ] `previousIndex >= left` কেন দরকার, explain করতে পারি।
- [ ] কেন `left = previousIndex + 1`, বুঝি।
- [ ] `"abba"` dry run করতে পারি।
- [ ] Brute force `O(n²)` থেকে optimal `O(n)` কীভাবে হলো, explain করতে পারি।
- [ ] Time `O(n)` average এবং auxiliary space `O(min(n, k))` বলতে পারি।
- [ ] TypeScript solution না দেখে লিখতে পারি।

### One-line memory trick

> Right দিয়ে window expand করো → duplicate current window-এর ভিতরে থাকলে left jump করাও → latest index update করো → window length দিয়ে maximum update করো।
