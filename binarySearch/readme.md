🧠 How to Choose the Right Pattern?
| Problem Type        | Pattern                 |
| ------------------- | ----------------------- |
| Find value          | Classic                 |
| Insert position     | Lower Bound             |
| Range queries       | Lower + Upper           |
| Min / Max answer    | Binary Search on Answer |
| True / False switch | First True              |

🧠 Golden Rules to Remember

✔ If searching in array → low <= high
✔ If searching answer space → low < high
✔ If monotonic → binary search applies
✔ Minimum valid → return low
✔ Maximum valid → return high


``when minimum and maximum valid values are needed then we use binary search on answer pattern.``


Pattern Reminder (Memorize This)
// MINIMUM valid answer
while (low < high) {
    mid = low + (high - low) / 2;

    if (isValid(mid)) high = mid;
    else low = mid + 1;
}
return low;