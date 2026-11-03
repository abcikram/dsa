# LeetCode 1768 — Merge Strings Alternately

**NeetCode category:** Two Pointers  
**Core technique:** Two Pointers / Alternating Traversal  
**Difficulty:** Easy  
**Language:** TypeScript  
**Problem:** https://leetcode.com/problems/merge-strings-alternately/

---

## 1. Problem Statement — সহজ বাংলায়

তোমাকে দুটি string দেওয়া থাকবে: `word1` এবং `word2`। এগুলোকে alternately merge করতে হবে:

1. `word1`-এর প্রথম character।
2. `word2`-এর প্রথম character।
3. `word1`-এর দ্বিতীয় character।
4. `word2`-এর দ্বিতীয় character।
5. এভাবে চলবে।

কোনো একটি string আগে শেষ হয়ে গেলে অন্য string-এর বাকি characters result-এর শেষে যোগ করতে হবে।

### Examples

```ts
word1 = "abc";
word2 = "pqr";
Output = "apbqcr";
```

```ts
word1 = "ab";
word2 = "pqrs";
Output = "apbqrs"; // word1 আগে শেষ
```

```ts
word1 = "abcd";
word2 = "pq";
Output = "apbqcd"; // word2 আগে শেষ
```

---

## 2. Pattern কী এবং কীভাবে চিনব?

**Pattern: Two Pointers** — দুটি string-এর position track করার জন্য আলাদা pointer রাখব।

Problem-এর clues:
- দুটি string/sequence আছে।
- দুটোর current character alternately নিতে হবে।
- দুই string-এর length আলাদা হতে পারে।
- প্রতিটির position আলাদাভাবে track করতে হবে।

তাই:
- `i` → `word1`-এর index।
- `j` → `word2`-এর index।

**Pattern recognition shortcut:** দুটি sequence পাশাপাশি traverse করতে হবে এবং প্রত্যেকটির position আলাদা করে track করতে হবে → Two Pointers.

---

## 3. তোমার Original Approach — কী ভুল ছিল?

তোমার code:

```ts
class Solution {
  mergeAlternately(word1: string, word2: string): string {
    let i = 0;
    let j = 0;
    let str = "";

    while (
      (word1.length === word2.length) &&
      (i < word1.length || j < word2.length)
    ) {
      str += word1[i] + word2[j];
      i++;
      j++;
    }

    return str;
  }
}
```

### Mistake 1: দুই string-এর length equal ধরে নেওয়া

`word1.length === word2.length`

দুটি string-এর length same হওয়া বাধ্যতামূলক নয়। যেমন `"abc"`-এর length 3, কিন্তু `"pqrs"`-এর length 4। Equality condition false হয়ে loop একবারও চলবে না।

### Mistake 2: দুই string-এর character সবসময় একসঙ্গে access করা

`str += word1[i] + word2[j];`

একটি string আগে শেষ হলে তার index out of bounds হবে। অন্য string-এর বাকি characters তখনও result-এ যোগ করতে হবে।

### Correct idea

দুই string-এর length equal কি না check করব না। প্রতিটি pointer তার নিজের string-এর valid range-এর মধ্যে আছে কি না আলাদাভাবে check করব।

---

## 4. Optimal Approach — Step by Step

Initialize:

```ts
let i = 0;
let j = 0;
let result = "";
```

Loop condition:

```ts
while (i < word1.length || j < word2.length)
```

`||` ব্যবহার করছি, কারণ **যেকোনো একটি string-এ character বাকি থাকলেই** loop চলতে হবে।

প্রতিটি iteration-এ:

```ts
if (i < word1.length) {
  result += word1[i];
  i++;
}

if (j < word2.length) {
  result += word2[j];
  j++;
}
```

অর্থাৎ:
1. `word1`-এ character বাকি থাকলে সেটি add করব।
2. `word2`-এ character বাকি থাকলে সেটি add করব।
3. যে string শেষ হয়েছে, তার `if` block আর execute হবে না।
4. অন্য string-এর বাকি characters add হতে থাকবে।

---

## 5. Optimal TypeScript Solution — String Concatenation

```ts
class Solution {
  mergeAlternately(word1: string, word2: string): string {
    let i = 0;
    let j = 0;
    let result = "";

    while (i < word1.length || j < word2.length) {
      // Take one character from word1 if available.
      if (i < word1.length) {
        result += word1[i];
        i++;
      }

      // Then take one character from word2 if available.
      if (j < word2.length) {
        result += word2[j];
        j++;
      }
    }

    return result;
  }
}
```

---

## 6. `while` Condition — `||` কেন, `&&` কেন নয়?

Correct:

```ts
while (i < word1.length || j < word2.length)
```

এর অর্থ: `word1`-এ character বাকি আছে **অথবা** `word2`-এ character বাকি আছে। যেকোনো একটিতে character বাকি থাকলেই loop চলবে।

যদি `&&` ব্যবহার করি:

```ts
while (i < word1.length && j < word2.length)
```

তাহলে দুটি condition-ই true হতে হবে। যেকোনো একটি string শেষ হলেই loop বন্ধ হয়ে যাবে; অন্য string-এর বাকি characters বাদ পড়বে।

Example:

```ts
word1 = "ab";
word2 = "pqrs";
```

দুইবার alternating করার পরে `word1` শেষ হবে, কিন্তু `word2`-তে `"rs"` বাকি থাকবে। `&&` দিলে এই `"rs"` আর add হবে না। তাই `||` দরকার।

---

## 7. Full Dry Run — Equal Length

Input:

```ts
word1 = "abc";
word2 = "pqr";
```

Initially: `i = 0`, `j = 0`, `result = ""`।

| Iteration | `i` | `j` | Add from word1 | Add from word2 | Result |
|---:|---:|---:|---|---|---|
| 1 | 0 | 0 | a | p | `ap` |
| 2 | 1 | 1 | b | q | `apbq` |
| 3 | 2 | 2 | c | r | `apbqcr` |

শেষে `i = 3`, `j = 3`; দুটো condition false, loop stop।

Output: `"apbqcr"`।

---

## 8. Full Dry Run — `word1` আগে শেষ

Input:

```ts
word1 = "ab";
word2 = "pqrs";
```

| Iteration | `i` before | `j` before | Action | Result after iteration |
|---:|---:|---:|---|---|
| 1 | 0 | 0 | Add a, then p | `ap` |
| 2 | 1 | 1 | Add b, then q | `apbq` |
| 3 | 2 | 2 | word1 finished; add r only | `apbqr` |
| 4 | 2 | 3 | word1 finished; add s only | `apbqrs` |

শেষে `i = 2` (`word1.length`) এবং `j = 4` (`word2.length`)। দুটো string-ই শেষ, তাই loop stop।

Output: `"apbqrs"`।

### Iteration 3-এ কী হয়েছিল?

```ts
if (i < word1.length) { ... }
```

এখানে `i = 2`, `word1.length = 2`, তাই condition false।

কিন্তু `j = 2`, `word2.length = 4`, তাই দ্বিতীয় `if` true এবং `r` add হয়।

---

## 9. Dry Run — `word2` আগে শেষ

Input:

```ts
word1 = "abcd";
word2 = "pq";
```

| Iteration | Added characters | Result |
|---:|---|---|
| 1 | a + p | `ap` |
| 2 | b + q | `apbq` |
| 3 | c only | `apbqc` |
| 4 | d only | `apbqcd` |

Output: `"apbqcd"`।

---

## 10. Alternative Implementation — Array + `join("")`

JavaScript/TypeScript-এ string immutable। Character জমা করার একটি alternative হলো array-তে `push()` করা, তারপর শেষে `join("")` করা।

```ts
class Solution {
  mergeAlternately(word1: string, word2: string): string {
    let i = 0;
    let j = 0;
    const result: string[] = [];

    while (i < word1.length || j < word2.length) {
      if (i < word1.length) {
        result.push(word1[i]);
        i++;
      }

      if (j < word2.length) {
        result.push(word2[j]);
        j++;
      }
    }

    return result.join("");
  }
}
```

দুটো implementation-ই সঠিক। Array + `join()` character accumulation-এর জন্য একটি পরিষ্কার option; `join()` শেষে final string বানায়।

---

## 11. Complexity Analysis — TC / SC

Let:
- `m = word1.length`
- `n = word2.length`

### Time Complexity: `O(m + n)`

- `word1`-এর প্রতিটি character একবার process হয়।
- `word2`-এর প্রতিটি character একবার process হয়।
- Total character count = `m + n`।

তাই traversal-এর time:

\[\boxed{O(m+n)}\]

### Space Complexity

| Space type | Complexity | Explanation |
|---|---:|---|
| Pointer variables | `O(1)` | শুধু `i`, `j` এবং fixed variables |
| Output string | `O(m+n)` | Final result-এ সব characters রাখতে হবে |
| Total including output | `O(m+n)` | Output length `m+n` |

Interview-এ সাধারণত বলবে:
- **Time:** `O(m+n)`
- **Space:** `O(m+n)` including output.

Output বাদ দিয়ে pointer variables-এর auxiliary space `O(1)`। Array + `join()` version-এ temporary character array-ও `O(m+n)` space নেয়।

---

## 12. Common Mistakes

### Mistake 1: দুই string-এর length equal ধরে নেওয়া

ভুল:

```ts
word1.length === word2.length
```

দুটি string-এর length আলাদা হতে পারে।

### Mistake 2: `&&` ব্যবহার করা

ভুল:

```ts
while (i < word1.length && j < word2.length)
```

একটি string শেষ হলেই loop বন্ধ হয়ে যাবে। সঠিক:

```ts
while (i < word1.length || j < word2.length)
```

### Mistake 3: দুই character সবসময় একসঙ্গে access করা

ভুল:

```ts
result += word1[i] + word2[j];
```

সঠিক: দুই string-এর জন্য আলাদা `if` guard।

### Mistake 4: Pointer increment ভুলে যাওয়া

প্রতিটি character add করার পর সংশ্লিষ্ট pointer increment করতে হবে।

### Mistake 5: Remaining characters বাদ দেওয়া

একটি string শেষ হলেও অন্য string-এর বাকি characters add করতে হবে।

### Mistake 6: `void` return type ব্যবহার করা

এই problem-এ final merged string return করতে হবে। তাই return type `string`, `void` নয়।

---

## 13. Edge Cases

| `word1` | `word2` | Output | Reason |
|---|---|---|---|
| `"abc"` | `"pqr"` | `"apbqcr"` | Equal lengths |
| `"ab"` | `"pqrs"` | `"apbqrs"` | word1 shorter |
| `"abcd"` | `"pq"` | `"apbqcd"` | word2 shorter |
| `"a"` | `"b"` | `"ab"` | One character each |
| `"abc"` | `""` | `"abc"` | word2 empty |
| `""` | `"xyz"` | `"xyz"` | word1 empty |
| `""` | `""` | `""` | Both empty |

---

## 14. Interview-এ Approach কীভাবে চিনবে?

নিজেকে প্রশ্ন করবে:

1. দুটি string বা sequence আছে? — হ্যাঁ।
2. দুটির current positions আলাদা করে track করতে হবে? — হ্যাঁ।
3. Alternately elements নিতে হবে? — হ্যাঁ।
4. একটি sequence আগে শেষ হলেও অন্যটির বাকি elements নিতে হবে? — হ্যাঁ।

তাই **Two Pointers** ব্যবহার করব।

### Interview-ready explanation

> I use two pointers, one for each string. In every iteration, I append one character from the first string if it is available, then one character from the second string if it is available. I continue while either string has characters remaining. This naturally handles different string lengths. Every character is processed once, so the time complexity is O(m+n). The output requires O(m+n) space.

---

## 15. Related Two Pointers Practice

| Problem | Main technique |
|---|---|
| 1768. Merge Strings Alternately | Two Pointers / Alternating traversal |
| 88. Merge Sorted Array | Three Pointers / Merge from right |
| 26. Remove Duplicates from Sorted Array | Slow & Fast / Read & Write |
| 27. Remove Element | Slow & Fast / In-place overwrite |
| 283. Move Zeroes | Slow & Fast / In-place overwrite |
| 167. Two Sum II | Two Pointers from both ends |

---

## 16. Final Revision Checklist

- [ ] Problem statement বুঝি: alternately merge করতে হবে।
- [ ] কেন এটি Two Pointers pattern?
- [ ] `i` এবং `j`-এর কাজ explain করতে পারি।
- [ ] কেন `word1.length === word2.length` check করব না?
- [ ] কেন `while` condition-এ `||` ব্যবহার করছি?
- [ ] কেন দুইটি আলাদা `if` guard দরকার?
- [ ] একটি string আগে শেষ হলে অন্য string-এর বাকি characters কীভাবে add হয়?
- [ ] Equal এবং unequal length examples dry run করতে পারি।
- [ ] `+=` এবং array + `join("")` implementation লিখতে পারি।
- [ ] Time `O(m+n)` এবং output space `O(m+n)` explain করতে পারি।

### One-line Memory Trick

> `i` word1 থেকে নেবে, `j` word2 থেকে নেবে → যেটাতে character বাকি আছে সেটি add করবে → `||` দিয়ে loop চালাবে যতক্ষণ অন্তত একটি string বাকি।
