# 143. Reorder List

**LeetCode:** https://leetcode.com/problems/reorder-list/  
**Pattern:** Fast & Slow Pointers + Reverse Linked List + Merge  
**Difficulty:** Medium

## Problem

Given the head of a singly linked list, reorder it in-place:

`L0 → L1 → … → Ln-1 → Ln`

into:

`L0 → Ln → L1 → Ln-1 → L2 → …`

Examples:

```text
Input:  1 → 2 → 3 → 4
Output: 1 → 4 → 2 → 3

Input:  1 → 2 → 3 → 4 → 5
Output: 1 → 5 → 2 → 4 → 3
```

The function modifies the original list and returns nothing (`void`).

## Core idea

Break the problem into three linked-list operations:

1. Find the middle using slow and fast pointers.
2. Reverse the second half.
3. Merge the two halves alternately.

For `1 → 2 → 3 → 4 → 5`:

```text
After splitting:
First:  1 → 2 → 3
Second: 4 → 5

After reversing second half:
First:  1 → 2 → 3
Second: 5 → 4

After merging:
        1 → 5 → 2 → 4 → 3
```

## JavaScript solution

LeetCode provides the `ListNode` definition, so do not redeclare it in the submission.

```javascript
class Solution {
    reorderList(head) {
        if (head === null || head.next === null) {
            return;
        }

        // Step 1: Find the middle
        let slow = head;
        let fast = head.next;

        while (fast !== null && fast.next !== null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        // Step 2: Split the list
        let second = slow.next;
        slow.next = null;

        // Step 3: Reverse the second half
        let prev = null;

        while (second !== null) {
            const temp = second.next;
            second.next = prev;
            prev = second;
            second = temp;
        }

        // Step 4: Merge both halves alternately
        let first = head;
        second = prev;

        while (second !== null) {
            const temp1 = first.next;
            const temp2 = second.next;

            first.next = second;
            second.next = temp1;

            first = temp1;
            second = temp2;
        }
    }
}
```

## Step-by-step explanation

### Step 1: Find the middle

```javascript
let slow = head;
let fast = head.next;

while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
}
```

- `slow` moves one node at a time.
- `fast` moves two nodes at a time.
- When `fast` cannot move two steps, `slow` is at the end of the first half.

We initialise `fast = head.next` so that for an even-length list, `slow` stops at the last node of the first half.

For `1 → 2 → 3 → 4 → 5`, `slow` stops at node `3`.

**Important:** Use `&&`, not `||`. We must check that `fast` exists before accessing `fast.next`. With `||`, the loop could try to access `next` on `null`.

### Step 2: Split the list

```javascript
let second = slow.next;
slow.next = null;
```

Save the start of the second half, then disconnect the first half.

```text
First:  1 → 2 → 3 → null
Second: 4 → 5 → null
```

### Step 3: Reverse the second half

```javascript
let prev = null;

while (second !== null) {
    const temp = second.next;
    second.next = prev;
    prev = second;
    second = temp;
}
```

This is the same pointer-reversal technique used in **LeetCode 206 — Reverse Linked List**.

After reversing:

```text
prev: 5 → 4 → null
```

At the end, `prev` is the new head of the reversed second half.

### Step 4: Merge the two halves

```javascript
let first = head;
second = prev;

while (second !== null) {
    const temp1 = first.next;
    const temp2 = second.next;

    first.next = second;
    second.next = temp1;

    first = temp1;
    second = temp2;
}
```

The temporary variables are essential: save both next pointers before changing any links.

Dry run with:

```text
First:  1 → 2 → 3
Second: 5 → 4
```

**Iteration 1**

- `first = 1`, `second = 5`
- `temp1 = first.next = 2`
- `temp2 = second.next = 4`
- Set `1.next = 5`
- Set `5.next = 2`
- Move `first = 2`, `second = 4`

Merged prefix:

```text
1 → 5 → 2
```

**Iteration 2**

- `first = 2`, `second = 4`
- `temp1 = 3`
- `temp2 = null`
- Set `2.next = 4`
- Set `4.next = 3`
- Move `first = 3`, `second = null`

Final list:

```text
1 → 5 → 2 → 4 → 3
```

The loop stops when the second half is exhausted.

## Complexity analysis

Let `n` be the number of nodes.

| Operation | Time |
|---|---:|
| Find middle | O(n) |
| Split | O(1) |
| Reverse second half | O(n) |
| Merge halves | O(n) |
| **Total** | **O(n)** |

- **Time complexity:** O(n)
- **Auxiliary space complexity:** O(1), because the list is modified in-place and only a fixed number of pointers are used.

## Common mistakes

1. **Using `||` in the fast-pointer condition:** use `fast !== null && fast.next !== null`.
2. **Not saving next pointers before rewiring:** save `temp1` and `temp2` first, or you may lose access to the remaining nodes.
3. **Forgetting to split the list:** `slow.next = null` prevents the first half from remaining connected to the second half during reversal.
4. **Returning a new list:** this problem requires in-place modification and a `void` return.

## Related problems

- [206. Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)
- [876. Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/)
- [21. Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/)

## Key takeaway

Reorder List is not one complicated trick. It combines three reusable linked-list patterns:

**Find middle → Reverse second half → Merge alternately.**
