


function eraseOverlapIntervals(intervals: number[][]): number {
    if(intervals.length === 0) return 0;
    
    // sort by the end time
    intervals.sort((a, b) => a[1] - b[1]);

    let removeCount = 0 ;
    let prevEnd = intervals[0][1] // previous end is least sort intervals 1st index's last element 

    for(let i=1;i<intervals.length;i++){ // start from 1st index
        // put start => intervals 1st element, end => intervals 2nd element 
        let start = intervals[i][0];
        let end = intervals[i][1];

        if(start<prevEnd){ // we compare start with prevEnd 
            // means ovelap
            // console.log("start", start, "end", end , "prevEnd", prevEnd)
            removeCount++
        } else {
            // update prevEnd with current end
            prevEnd = end
        }


    }
    
    return removeCount
};


https://chatgpt.com/share/697efd1d-080c-8013-90f2-61bc5229a75f