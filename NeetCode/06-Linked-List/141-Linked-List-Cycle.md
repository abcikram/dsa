# 141 — Linked List Cycle

## Pattern

**Linked List + Fast & Slow Pointers (Floyd's Cycle Detection)**

Given the head of a linked list, determine whether the list contains a cycle.

A cycle means some node's `next` points back to a previous node instead of eventually reaching `null`.

## Example

Cycle exists:

```text
3 → 2 → 0 → -4
    ↑         |
    └─────────┘
```

Here, the `next` pointer of node `-4` points back to the **same node 2**.

No cycle:

```text
1 → 2 → 3 → null
```

## Approach — Floyd's Cycle Detection

Use two pointers:

- `slow` moves one node at a time.
- `fast` moves two nodes at a time.

If a cycle exists, the fast pointer will eventually catch the slow pointer **at the same node**.

If there is no cycle, fast will reach `null`.

## TypeScript Solution

```ts
class Solution {
  hasCycle(head: ListNode | null): boolean {
    let slow = head;
    let fast = head;

    while (fast !== null && fast.next !== null) {
      slow = slow!.next;
      fast = fast.next.next;

      if (slow === fast) {
        return true;
      }
    }

    return false;
  }
}
```

## Understand the Code

1. Start both pointers at `head`.
2. Check `fast !== null && fast.next !== null` before moving two steps. This prevents accessing `next` on null.
3. Move slow by one step: `slow = slow!.next`.
4. Move fast by two steps: `fast = fast.next.next`.
5. Compare node references: `slow === fast`. Same node means a cycle exists.
6. If fast reaches null, the list has no cycle.

**Important:** Compare nodes (`slow === fast`), not values (`slow.val === fast.val`). Two different nodes can contain the same value.

## Dry Run — Cycle Exists

Input structure:

```text
3 → 2 → 0 → -4
    ↑         |
    └─────────┘
```

Remember: `-4.next = node 2`. The pointer returns to the **same node 2**, not to a new node that merely has value 2.

### Start

```text
slow = node 3
fast = node 3
```

### Step-by-step movement

| Step | Slow moves 1 step | Fast moves 2 steps | Positions after movement |
|---:|---|---|---|
| Start | — | — | slow = 3, fast = 3 |
| 1 | 3 → 2 | 3 → 2 → 0 | slow = 2, fast = 0 |
| 2 | 2 → 0 | 0 → -4 → 2 | slow = 0, fast = 2 |
| 3 | 0 → -4 | 2 → 0 → -4 | slow = -4, fast = -4 |

### Why is fast at 2 in Step 2?

At the start of Step 2:

- slow is at node 2.
- fast is at node 0.

Now move them:

```text
Slow: 2 → 0                 (1 step)

Fast: 0 → -4 → 2            (2 steps)
              └───────┘
              cycle link
```

Fast goes from node 0 to node -4, then follows `-4.next` back to the **original node 2**.

So after Step 2:

```text
slow = node 0
fast = node 2
```

This is normal: fast can revisit a node because the list contains a cycle.

### Step 3 — They meet

```text
Slow: 0 → -4                (1 step)

Fast: 2 → 0 → -4            (2 steps)
```

Now both pointers refer to the same node `-4`.

```ts
if (slow === fast) {
  return true;
}
```

**Result: `true` — cycle detected.**

## Pointer Movement Diagram

```text
                3 → 2 → 0 → -4
                    ↑         |
                    └─────────┘

Start:              slow, fast at 3

After step 1:       slow at 2
                    fast at 0

After step 2:       slow at 0
                    fast at 2  ← fast looped back!

After step 3:       slow at -4
                    fast at -4 ← same node
```

## Dry Run — No Cycle

Input:

```text
1 → 2 → 3 → null
```

- Start: slow = 1, fast = 1.
- Step 1: slow = 2, fast = 3.
- Next loop check: `fast.next === null`, so the loop stops.
- Return `false`.

## Why Does the Fast Pointer Catch the Slow Pointer?

Inside a cycle, both pointers keep moving around the same loop. Fast moves two steps while slow moves one, so fast gains one node on slow per iteration. Eventually, fast catches slow.

## Common Mistakes

1. **Checking only `fast !== null`:** also check `fast.next !== null` before moving two steps.
2. **Comparing values:** `slow.val === fast.val` is not reliable; compare node references.
3. **Moving fast by one step:** both pointers would move at the same speed, so this detection logic would fail.
4. **Thinking fast cannot revisit a node:** with a cycle, following `next` can bring fast back to a node it has already visited.

## Complexity

- **Time:** `O(n)` — each pointer traverses at most a linear number of nodes before they meet or fast reaches null.
- **Space:** `O(1)` — only two pointers are used.

## Interview Explanation

“I use Floyd's cycle detection with slow and fast pointers. Slow advances one node and fast advances two nodes. If there is a cycle, fast eventually meets slow at the same node. If fast or fast.next becomes null, there is no cycle.”

## Quick Revision

- [ ] Slow moves one step.
- [ ] Fast moves two steps.
- [ ] Check both `fast` and `fast.next` before moving.
- [ ] Compare node references, not values.
- [ ] Same node means cycle; reaching null means no cycle.
