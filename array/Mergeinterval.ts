function merge(intervals: number[][]): number[][] {
  if (intervals.length <= 1) return intervals;

  //sort of intervals
  intervals.sort((a, b) => a[0] - b[0]);

  //initialte the array
  let result = new Array();

  // initiate the 1st index of intervals
  let newInterval: number[] = intervals[0];

  // push on result
  result.push(newInterval);

  for (let interval of intervals) {
    // so if last element interval is less than newInterval 1st position
    //then overlap [1,3],[1,3]  , 3>1 overlap , so update [1,3]
    // [1,3] , [2,6] , 2<= 3 overlap , max(3,6) = 6 , so => [1,6]
    // [2,6] , [8,10] , 8 !<= 6 so [ [ 1, 6 ], [ 8, 10 ] ]
    // [8,10] [15,18] , 15 !<=10 so [ [ 1, 6 ], [ 8, 10 ], [ 15, 18 ] ]
    if (interval[0] <= newInterval[1]) {
      // console.log(interval,"<<<<", newInterval)
      // means overlap
      // here we do new Inteval 1 st and interval 1st index max , it update
      // matinterval 1st index
      newInterval[1] = Math.max(newInterval[1], interval[1]);
    } else {
      // Disjoint interval
      // add the new interval to the list
      newInterval = interval;
      result.push(newInterval);

      //    console.log("result", result)
    }
  }
  return result;
}





/// more optimized way
function merge(intervals: number[][]): number[][] {
    if(intervals.length <=1) return intervals;

    //sort of intervals
    intervals.sort((a, b) => a[0] - b[0]);
    
    //initialte the array
    let result = new Array();

    // initiate the 1st index of intervals
    let newInterval:number[] = intervals[0];

    // push on result
    result.push(newInterval);
//    [1,3] =newInterval[1] 
//    [2,6] = interval[i][0]
    for(let i=1;i<intervals.length;i++){
        if(intervals[i][0] <= newInterval[1]){
            // overlap 3 > 2
            newInterval[1] = Math.max(newInterval[1], intervals[i][1])
        }else {
            // push new result
            newInterval = intervals[i];
            result.push(newInterval);
        }
    }

    return result;
};