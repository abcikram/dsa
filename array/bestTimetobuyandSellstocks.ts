function maxProfit(prices: number[]): number {
  // 7,1,5,3,6,4
  // buy  = 0 => 1
  // sell
  // profit 0=>4 => 5

  let buy = prices[0]!;
  let maxProfit = 0;

  for (let i = 1; i < prices.length; i++) {
    let cost = prices[i]! - buy;
    maxProfit = Math.max(cost, maxProfit);
    buy = Math.min(prices[i]!, buy);
  }

  return maxProfit;
}

console.log(maxProfit([7, 1, 5, 3, 6, 4]));