
// const missingNumber = (arr:number[], N:number):number => {
//     for(let i =1;i<=N;i++){
//         let flag = 0;
//         for(let j=0;j<arr.length;j++){
//             if(arr[j] == i){
//                 flag = 1;
//                 break;
//             }
//         }
        
//         if(flag===0){
//             return i
//         }
//     }
//     return -1
// }


// const missingNumber = (arr:number[], N:number):number => {
//     let totalSum = N*(N+1)/2;
//     let sumOfElem = 0;
//     for(let i=0;i<arr.length;i++){
//         sumOfElem = sumOfElem + arr[i] 
//     }
//     return totalSum - sumOfElem
// }

// Tc :- O(N) , SC : O(1)




/// Optimal solution :- 
const missingNumber = (arr:number[], N:number):number => {
    let xor1 = 0;
    let xor2 = 0;
    for(let i=0;i<arr.length;i++){
        xor2 = xor2 ^ arr[i];
        xor1 = xor1 ^ (i+1)
    }
    
    xor1 = xor1 ^ N
    
    return xor1 ^ xor2
}

// Tc :- O(N) , SC : O(1)


Note :-  XOR avoids integer overflow and works at the bit level.
 Since duplicate values cancel out using XOR properties, it is safer and more reliable for large inputs compared to arithmetic sum.

console.log(missingNumber([1,2,3,4,5,6,8],8))