# NeetCode Roadmap — DSA Notes

This folder organizes problem notes by the **NeetCode 150 pattern roadmap**. Each problem is stored inside its primary pattern/category folder. Where a problem combines techniques, its note mentions the secondary technique in the Pattern section instead of duplicating the same file across folders.

## Pattern folders

| # | NeetCode category | Notes currently available |
|---:|---|---|
| 01 | Arrays & Hashing | [Flatten Array — Recursion](01-Arrays-and-Hashing/Flatten-Array-Recursion.md) |
| 02 | Two Pointers | [11 — Container With Most Water](02-Two-Pointers/11-Container-With-Most-Water.md), [15 — 3Sum](02-Two-Pointers/15-3Sum.md), [26 — Remove Duplicates from Sorted Array](02-Two-Pointers/26-Remove-Duplicates-from-Sorted-Array.md), [42 — Trapping Rain Water](02-Two-Pointers/42-Trapping-Rain-Water.md), [88 — Merge Sorted Array](02-Two-Pointers/88-Merge-Sorted-Array.md), [1768 — Merge Strings Alternately](02-Two-Pointers/1768-Merge-Strings-Alternately.md) |
| 03 | Sliding Window | [209 — Minimum Size Subarray Sum](03-Sliding-Window/209-Minimum-Size-Subarray-Sum.md), [3 — Longest Substring (Set vs Map)](03-Sliding-Window/3-Longest-Substring-Set-vs-Map.md), [121 — Best Time to Buy and Sell Stock](03-Sliding-Window/121-Best-Time-to-Buy-and-Sell-Stock.md), [424 — Longest Repeating Character Replacement](03-Sliding-Window/424-Longest-Repeating-Character-Replacement.md), [567 — Permutation in String (HashMap)](03-Sliding-Window/567-Permutation-in-String-HashMap.md) |
| 04 | Stack | [20 — Valid Parentheses](04-Stack/20-Valid-Parentheses.md), [150 — Evaluate Reverse Polish Notation](04-Stack/150-Evaluate-Reverse-Polish-Notation.md), [155 — Min Stack (English)](04-Stack/155-Min-Stack.md), [155 — Min Stack (বাংলা)](04-Stack/155-Min-Stack-Bangla.md) |
| 05 | Binary Search | [69 — Sqrt(x)](05-Binary-Search/69-Sqrt-x.md) |
| 06 | Linked List | — |
| 07 | Trees | — |
| 08 | Tries | — |
| 09 | Heap / Priority Queue | — |
| 10 | Backtracking | — |
| 11 | Graphs | — |
| 12 | Advanced Graphs | — |
| 13 | 1-D Dynamic Programming | — |
| 14 | 2-D Dynamic Programming | — |
| 15 | Greedy | — |
| 16 | Intervals | — |
| 17 | Math & Geometry | [48 — Rotate Image](17-Math-and-Geometry/48-Rotate-Image.md) |
| 18 | Bit Manipulation | — |

## Current pattern coverage

- **Arrays & Hashing:** Flatten Nested Array (recursive DFS).
- **Two Pointers:** 3Sum, Container With Most Water, Trapping Rain Water, Remove Duplicates from Sorted Array, Merge Strings Alternately.
- **Stack:** Valid Parentheses (matching brackets with LIFO), Evaluate Reverse Polish Notation (operand stack + expression evaluation), Min Stack (store each value with the minimum so far).
- **Binary Search:** Sqrt(x) (binary search on answer / monotonic predicate; also includes brute force and Newton's method).
- **Sliding Window:** Minimum Size Subarray Sum (variable-size window + shrink while valid), Longest Substring Without Repeating Characters (Set + HashMap), Best Time to Buy and Sell Stock (running minimum + greedy one-pass), Longest Repeating Character Replacement (frequency count), Permutation in String (fixed-size window + frequency HashMap).
- **Math & Geometry / Matrix:** Rotate Image (transpose + reverse each row).

## Conventions

- File names start with the LeetCode problem number when applicable; foundational technique notes use a descriptive name.
- Keep the complete explanation, dry run, TypeScript solution, complexity, common mistakes, and revision checklist in each problem note.
- Put a problem in its main NeetCode pattern folder; describe secondary patterns in the note instead of duplicating the same file across folders.

## Add a new problem

Create the appropriate numbered folder if it does not exist, then add a file such as:

```text
NeetCode/02-Two-Pointers/16-3Sum-Closest.md
```
