# LeetCode 3 — Longest Substring Without Repeating Characters
## Two Optimal Methods: Sliding Window with Set and HashMap

**NeetCode category:** Sliding Window  
**Pattern:** Variable-size Sliding Window  
**Difficulty:** Medium  
**Language:** TypeScript  
**Problem:** https://leetcode.com/problems/longest-substring-without-repeating-characters/

---

## 1. Problem — সহজ বাংলায়

একটি string `s` দেওয়া থাকবে। এমন একটি **longest substring-এর length** return করতে হবে, যেখানে কোনো character repeat করে না।

- **Substring** মানে continuous part of a string।
- Character skip করে মাঝখান বাদ দিয়ে নিলে সেটা substring নয়।
- Current substring/window-এর মধ্যে সব character unique হতে হবে।

```ts
s = "abcabcbb";
Output = 3; // "abc", "bca" অথবা "cab"
```

আরেকটি example:

```ts
s = "abba";
Output = 2; // "ab" অথবা "ba"
```

## 2. Pattern কীভাবে চিনব?

Primary pattern হলো **Variable-size Sliding Window**।

Problem statement-এর clues:

1. **Substring** → continuous range দরকার।
2. **Longest** → maximum window length বের করতে হবে।
3. **Without repeating** → window-এর মধ্যে duplicate character রাখা যাবে না।

দুটি pointer রাখব:

- `left`: current window-এর starting index।
- `right`: current window-এর ending index।

Window valid থাকলে `right` দিয়ে expand করব। Duplicate এলে `left` move করে window valid করব।

Window length:

```ts
const windowLength = right - left + 1;
```

`+1` দরকার, কারণ `left` এবং `right`—দুই endpoint-ই window-এর অংশ।

---

# Method 1 — Sliding Window + Set

## 3. Set approach-এর intuition

`Set`-এ current window-এর সব unique character রাখব।

```ts
const window = new Set<string>();
```

প্রতিটি নতুন character-এর জন্য:

1. `right` pointer দিয়ে character নেব।
2. যদি character আগে থেকেই Set-এ থাকে, duplicate।
3. Duplicate চলে না যাওয়া পর্যন্ত `s[left]` Set থেকে delete করব এবং `left++` করব।
4. Current character Set-এ add করব।
5. Current window length বের করে maximum update করব।

**কেন `while`, `if` নয়?** একবার remove করলেই duplicate চলে যাবে এমন নিশ্চয়তা নেই। Duplicate পুরোপুরি remove না হওয়া পর্যন্ত loop চালাতে হবে।

## 4. Set — Complete TypeScript solution

```ts
class Solution {
  lengthOfLongestSubstring(s: string): number {
    let left = 0;
    let maxLength = 0;

    const window = new Set<string>();

    for (let right = 0; right < s.length; right++) {
      const char = s[right];

      // Remove from the left until the duplicate disappears.
      while (window.has(char)) {
        window.delete(s[left]);
        left++;
      }

      window.add(char);

      const currentLength = right - left + 1;
      maxLength = Math.max(maxLength, currentLength);
    }

    return maxLength;
  }
}
```

## 5. Set — Dry run: `abba`

Index mapping:

```text
Index:   0  1  2  3
String:  a  b  b  a
```

| Right | Character | Set operation | Left | Current window | Length |
|---:|:---:|---|---:|:---:|---:|
| 0 | a | Add `a` | 0 | `a` | 1 |
| 1 | b | Add `b` | 0 | `ab` | 2 |
| 2 | b | Remove `a`, then old `b`; add new `b` | 2 | `b` | 1 |
| 3 | a | Add `a` | 2 | `ba` | 2 |

Right = 2-এ duplicate `b` এলে:

```text
a b b
^   ^
L   R
```

প্রথমে `a` remove হবে, কিন্তু old `b` Set-এ থাকবে। তাই দ্বিতীয়বার loop চলে old `b` remove করবে। তারপর নতুন `b` add হবে।

Final output: `2`।

## 6. Set — Complexity

- **Time:** `O(n)` average. Right pointer সর্বোচ্চ `n` বার move করে, left pointer-ও মোট সর্বোচ্চ `n` বার move করে। Set operations average `O(1)`।
- **Auxiliary Space:** `O(min(n, k))`, যেখানে `k` হলো possible character-set size।

---

# Method 2 — Sliding Window + HashMap

## 7. Map approach-এর intuition

Set শুধু জানায় কোনো character window-এর মধ্যে আছে কি না। কিন্তু **Map character-এর most recent index** store করে। ফলে duplicate পেলে `left` এক এক করে move না করে সরাসরি jump করাতে পারি।

```ts
const lastSeen = new Map<string, number>();
```

Example:

```text
Character: a  b  c
Index:     0  1  2

Map:
a -> 0
b -> 1
c -> 2
```

Duplicate current window-এর মধ্যে থাকলে:

```ts
left = previousIndex + 1;
```

কিন্তু old occurrence যদি current window-এর বাইরে থাকে, `left` move করা যাবে না। তাই `previousIndex >= left` condition দরকার।

## 8. Map — Complete TypeScript solution

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

      // Move left only if the old occurrence is in this window.
      if (
        previousIndex !== undefined &&
        previousIndex >= left
      ) {
        left = previousIndex + 1;
      }

      // Always store the latest index.
      lastSeen.set(char, right);

      const currentLength = right - left + 1;
      maxLength = Math.max(maxLength, currentLength);
    }

    return maxLength;
  }
}
```

## 9. Map — Dry run: `abba`

| Right | Character | Previous index | Left after check | Current window | Length |
|---:|:---:|---:|---:|:---:|---:|
| 0 | a | Not found | 0 | `a` | 1 |
| 1 | b | Not found | 0 | `ab` | 2 |
| 2 | b | 1 | 2 | `b` | 1 |
| 3 | a | 0 | 2 | `ba` | 2 |

### Right = 2, character = `b`

- Previous `b` index = 1।
- Current `left = 0)।
- `1 >= 0` true, duplicate current window-এর মধ্যে।
- তাই `left = 1 + 1 = 2)।

### Right = 3, character = `a`

- Previous `a` index = 0।
- Current `left = 2)।
- `0 >= 2` false।
- পুরনো `a) current window-এর বাইরে, তাই `left) পেছনে যাবে না।
- Current window হয় `"ba"`।

Final output: `2`।

## 10. Map-এ `previousIndex >= left` কেন জরুরি?

ভুল:

```ts
if (previousIndex !== undefined) {
  left = previousIndex + 1;
}
```

`abba)-তে শেষের `a) process করার সময়:

```ts
previousIndex = 0;
left = 2;
```

Unconditional update করলে `left = 1` হয়ে পেছনে চলে যাবে। সেটা ভুল।

সঠিক:

```ts
if (
  previousIndex !== undefined &&
  previousIndex >= left
) {
  left = previousIndex + 1;
}
```

Alternative safe expression:

```ts
if (previousIndex !== undefined) {
  left = Math.max(left, previousIndex + 1);
}
```

## 11. Map — Complexity

- **Time:** `O(n)` average. Right একবার পুরো string traverse করে; Map `get` ও `set) average `O(1)`।
- **Auxiliary Space:** `O(min(n, k))), কারণ distinct characters-এর latest index store হয়।

---

## 12. Set vs Map — Direct Comparison

| বিষয় | Set approach | Map approach |
|---|---|---|
| কী store করে? | Current window-এর unique characters | Character এবং latest index |
| Duplicate check | `window.has(char)` | `lastSeen.get(char)` |
| Duplicate এলে | `while` দিয়ে left থেকে character remove | Previous index-এর পরের position-এ left jump |
| Left movement | এক বা একাধিক step | সরাসরি jump |
| Time | `O(n)` average | `O(n)` average |
| Auxiliary space | `O(min(n,k))` | `O(min(n,k))` |
| Main advantage | Logic সহজ; window পরিষ্কারভাবে maintain হয় | Previous index জানা থাকে; direct jump করা যায় |

### কোনটা ব্যবহার করব?

- **Set:** প্রথমে Sliding Window শেখার জন্য ভালো। Window কীভাবে shrink ও expand হয় পরিষ্কার বোঝা যায়।
- **Map:** Previous occurrence-এর index ব্যবহার করে left সরাসরি jump করাতে পারে। Interview-এ খুব common।

দুটোই optimal `O(n)) time solution।

---

## 13. Edge Cases

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

---

## 14. Common Mistakes

1. **Substring বনাম subsequence:** Substring continuous হতে হবে।
2. **Window length:** `right - left + 1); `+1) ভুলবে না।
3. **Set-এ `if` ব্যবহার:** Duplicate চলে না যাওয়া পর্যন্ত `while) দরকার।
4. **Map-এ previous index check না করা:** `previousIndex >= left) না থাকলে left পেছনে যেতে পারে।
5. **Map update ভুলে যাওয়া:** প্রতিটি character-এর পর `lastSeen.set(char, right)) করতে হবে।
6. **Set/Map-এর কাজ গুলিয়ে ফেলা:** Set membership রাখে; Map index রাখে।
7. **Nested `while` দেখে `O(n²)) বলা:** Left pointer মোটে সর্বোচ্চ `n) বার move করে; total time linear।

---

## 15. Interview-ready Explanation

### Set version

> I use a variable-size sliding window and a Set to store the characters currently inside the window. I expand using the right pointer. If the new character already exists, I remove characters from the left until the duplicate disappears. Then I add the new character and update the maximum window length. Each pointer moves only forward, so time is O(n) and auxiliary space is O(min(n, k)).

### Map version

> I use a variable-size sliding window and a HashMap that stores the most recent index of each character. When a repeated character appears inside the current window, I move the left pointer to one position after its previous occurrence. I update the latest index and calculate the current window length. Average time is O(n), with O(min(n, k)) auxiliary space.

---

## 16. Revision Checklist

- [ ] Substring মানে continuous part।
- [ ] কেন এটি Variable-size Sliding Window?
- [ ] Set current window-এর characters কীভাবে রাখে?
- [ ] Set approach-এ duplicate এলে কেন `while)?
- [ ] Map character-এর latest index কীভাবে রাখে?
- [ ] `previousIndex >= left) condition কেন দরকার?
- [ ] `left = previousIndex + 1) কেন?
- [ ] `abba) দুই approach দিয়ে dry run করতে পারি।
- [ ] `right - left + 1) কেন window length?
- [ ] দুই approach-এর Time ও Space complexity explain করতে পারি।

### One-line memory trick

- **Set:** Duplicate থাকলে left থেকে delete করতে করতে duplicate remove করো।
- **Map:** Duplicate current window-এর মধ্যে থাকলে previous index-এর পরের position-এ left jump করাও।

তারপর window length calculate করে maximum update করো।
