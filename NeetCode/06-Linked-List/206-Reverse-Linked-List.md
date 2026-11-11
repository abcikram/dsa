# NeetCode 150 — Linked List Notes

> Linked List fundamentals and Reverse Linked List (LeetCode 206). Examples use TypeScript.

## 1. What is a Linked List?

A **Linked List** is a linear data structure made of nodes. Each node stores a value and a reference to the next node. Nodes do not need to occupy contiguous memory locations.

```text
head
 |
 v
[10] -> [20] -> [30] -> null
```

- **Head:** reference to the first node.
- **Tail:** last node; in a singly linked list its `next` is `null`.
- **Next:** reference to the next node.
- **Traversal:** visiting nodes, starting from the head.
- **null:** marks the end of a normal singly linked list.

An empty list has `head = null`.

## 2. Node Structure in TypeScript

```typescript
class ListNode {
    val: number;
    next: ListNode | null;

    constructor(val: number = 0, next: ListNode | null = null) {
        this.val = val;
        this.next = next;
    }
}
```

- `val: number`: the node stores a number.
- `next: ListNode | null`: next is either another node or null.
- `ListNode | null` is a TypeScript union type.

## 3. Creating and Connecting Nodes

```typescript
const node1 = new ListNode(10);
const node2 = new ListNode(20);
const node3 = new ListNode(30);

node1.next = node2;
node2.next = node3;

const head: ListNode | null = node1;
```

Result: `10 -> 20 -> 30 -> null`. The head provides access to the entire list.

## 4. Types of Linked Lists

### Singly Linked List
Each node points only to the next node: `10 -> 20 -> 30 -> null`. Traversal is forward only.

### Doubly Linked List
Each node has `prev` and `next` references: `null <- 10 <-> 20 <-> 30 -> null`. Traversal is possible in both directions.

### Circular Singly Linked List
The last node points back to the first node instead of null.

### Circular Doubly Linked List
Nodes have both previous and next references, and the first and last nodes are connected in both directions.

## 5. Array vs Linked List

| Feature / Operation | Array | Singly Linked List |
|---|---:|---:|
| Access by index | O(1) | O(n) |
| Search by value | O(n) | O(n) |
| Insert at beginning | O(n), shifting | O(1) |
| Delete at beginning | O(n), shifting | O(1) |
| Insert after a known node | Not generally O(1) | O(1) |
| Memory layout | Contiguous (conceptually) | Nodes may be non-contiguous |
| Per-element next reference | No | Yes |

**Tail insertion:** O(1) if a tail reference is maintained; otherwise O(n) to find the tail.

## 6. Traversal

```typescript
function printList(head: ListNode | null): void {
    let current = head;

    while (current !== null) {
        console.log(current.val);
        current = current.next;
    }
}
```

1. Start at head.
2. Process current.
3. Move with `current = current.next`.
4. Stop when current becomes null.

Moving the local `current` reference does not modify the list.

## 7. Common Operation Complexities

| Operation | Time | Notes |
|---|---:|---|
| Access by index | O(n) | Traverse from head |
| Search | O(n) | May visit every node |
| Insert at head | O(1) | Update new node and head |
| Delete at head | O(1) | Move head to next |
| Insert after known node | O(1) | Update references |
| Delete after known previous node | O(1) | Update previous.next |
| Insert at tail | O(1) / O(n) | Depends on maintained tail reference |

## 8. Important NeetCode Interview Patterns

- **Two pointers:** two references traverse the list, possibly at different speeds.
- **Fast and slow pointers:** slow moves one step, fast moves two. Used to find the middle and detect cycles (Floyd's algorithm).
- **Dummy node:** temporary node before head; simplifies insertion/deletion edge cases.
- **Pointer reversal:** change the direction of next references.
- **Hash map:** store node-related information; useful in Copy List with Random Pointer.

---

# Problem 1 — Reverse Linked List

- **Platform:** LeetCode / NeetCode
- **LeetCode:** 206
- **Difficulty:** Easy
- **Pattern:** Pointer manipulation / Iteration

## 9. Problem Statement

Given the head of a singly linked list, reverse the list and return the new head.

Example 1:

```text
Input:  0 -> 1 -> 2 -> 3 -> null
Output: 3 -> 2 -> 1 -> 0 -> null
```

Example 2:

```text
Input:  null
Output: null
```

Constraints:
- 0 <= number of nodes <= 1000
- -1000 <= Node.val <= 1000

## 10. Core Idea: Three References

We do not change node values. We reverse each node's `next` reference.

| Reference | Responsibility |
|---|---|
| `prev` | Previous node in the reversed portion |
| `current` | Node currently being processed |
| `next` | Temporarily saves the remaining unreversed list |

Initially: `prev = null`, `current = head`.

## 11. The Four Steps

Repeat while `current !== null`.

**Step 1 — Save the next node**

```typescript
const next: ListNode | null = current.next;
```

Save the rest of the list before changing `current.next`, otherwise we may lose access to the remaining nodes.

**Step 2 — Reverse the current pointer**

```typescript
current.next = prev;
```

**Step 3 — Move prev forward**

```typescript
prev = current;
```

**Step 4 — Move current forward**

```typescript
current = next;
```

**Order matters:** save `next` before overwriting `current.next`.

## 12. Complete TypeScript Solution

> NeetCode/LeetCode generally provides the `ListNode` definition. Do not redeclare it in your submission unless the platform asks you to.

```typescript
class Solution {
    reverseList(head: ListNode | null): ListNode | null {
        let prev: ListNode | null = null;
        let current: ListNode | null = head;

        while (current !== null) {
            // 1. Save the next node
            const next: ListNode | null = current.next;

            // 2. Reverse the pointer
            current.next = prev;

            // 3. Move prev forward
            prev = current;

            // 4. Move current forward
            current = next;
        }

        // prev is the new head
        return prev;
    }
}
```

## 13. Step-by-Step Dry Run

Input: `0 -> 1 -> 2 -> 3 -> null`

Initial state: `prev = null`, `current = 0`.

### Iteration 1
- Before: current = 0, prev = null
- Save: next = 1
- Reverse: 0.next = null
- Move: prev = 0, current = 1
- Reversed portion: `null <- 0`; remaining: `1 -> 2 -> 3 -> null`

### Iteration 2
- Before: current = 1, prev = 0
- Save: next = 2
- Reverse: 1.next = 0
- Move: prev = 1, current = 2
- Reversed portion: `null <- 0 <- 1`; remaining: `2 -> 3 -> null`

### Iteration 3
- Before: current = 2, prev = 1
- Save: next = 3
- Reverse: 2.next = 1
- Move: prev = 2, current = 3
- Reversed portion: `null <- 0 <- 1 <- 2`; remaining: `3 -> null`

### Iteration 4
- Before: current = 3, prev = 2
- Save: next = null
- Reverse: 3.next = 2
- Move: prev = 3, current = null
- Reversed list: `null <- 0 <- 1 <- 2 <- 3`

The loop stops because current is null. Return prev, which points to node 3, the new head.

Output: `3 -> 2 -> 1 -> 0 -> null`.

### Dry-Run Summary

| Iteration | Current before | Next saved | Prev after update | Current after update |
|---:|---:|---:|---:|---:|
| Initial | 0 | — | null | 0 |
| 1 | 0 | 1 | 0 | 1 |
| 2 | 1 | 2 | 1 | 2 |
| 3 | 2 | 3 | 2 | 3 |
| 4 | 3 | null | 3 | null |

## 14. Why Return prev?

When the loop ends, `current === null`. The `prev` reference points to the last processed node, which is now the first node of the reversed list. Returning current would return null, which is wrong for a non-empty list.

## 15. Edge Cases

**Empty list:** input null. The loop does not execute; return null.

**One node:** `10 -> null`. It remains unchanged; return the same node.

**Multiple nodes:** `10 -> 20 -> 30 -> null` becomes `30 -> 20 -> 10 -> null`.

## 16. Complexity Analysis

Let n be the number of nodes.

- **Time: O(n)** — each node is visited exactly once.
- **Auxiliary space: O(1)** — only prev, current, and next references are used; no additional list or array is created.

## 17. Common Mistakes

1. Not saving next first: the remaining list can become inaccessible.
2. Returning current: it is null when the loop ends.
3. Forgetting to update prev: the reversed portion will not grow.
4. Forgetting to update current: the loop will not progress.
5. Wrong return type: use `ListNode | null` because an empty input returns null.
6. Redeclaring ListNode on the platform: NeetCode generally supplies it.

## 18. Interview Questions

**Q1. Why do we need three references?**  
prev tracks the reversed portion, current is the node being processed, and next saves the remaining list.

**Q2. Why save next before reversing the pointer?**  
Because `current.next = prev` overwrites the original next reference.

**Q3. Why return prev?**  
It points to the new head after all nodes have been processed.

**Q4. Can we solve it recursively?**  
Yes. The recursive solution uses O(n) call-stack space, while the iterative solution uses O(1) auxiliary space.

**Q5. Does this algorithm create new nodes?**  
No. It reuses the existing nodes and changes their next references.

## 19. Revision Checklist

- [ ] I understand node, head, next, and null.
- [ ] I can explain singly and doubly linked lists.
- [ ] I understand traversal.
- [ ] I can compare arrays and linked lists.
- [ ] I understand the three-reference technique.
- [ ] I can dry-run Reverse Linked List without looking at the solution.
- [ ] I can implement the iterative solution in TypeScript from memory.
- [ ] I know why the solution is O(n) time and O(1) auxiliary space.
- [ ] I understand why the function returns prev.

## Key Takeaway

Remember this sequence:

```typescript
const next = current.next;
current.next = prev;
prev = current;
current = next;
```

**Save → Reverse → Move prev → Move current**

This pointer-manipulation pattern is fundamental to many Linked List interview problems.
