const properties = {
    T: { // Theatre
      buildTime: 5,
      landSize: 2,
      earning: 1500,
      name: "Theatre"
    },
    P: { // Pub
      buildTime: 4,
      landSize: 1,
      earning: 1000,
      name: "Pub"
    },
    C: { // Commercial Park
      buildTime: 10,
      landSize: 3,
      earning: 3000,
      name: "Commercial Park"
    }
  };
function maxProfit(n) {
    
    const memo = Array(n + 1).fill(null);
    
    function dp(timeLeft) {
     
      if (timeLeft <= 0) {
        return { profit: 0, buildings: [] };
      }
      
      
      if (memo[timeLeft]) {
        return memo[timeLeft];
      }
      
      let maxProfit = 0;
      let bestBuildingSequence = [];
      
      
      for (const [type, prop] of Object.entries(properties)) {
        
        if (prop.buildTime <= timeLeft) {
         
          const remainingTime = timeLeft - prop.buildTime;
          
          const result = dp(remainingTime);
          
          const profit = remainingTime * prop.earning + result.profit;
          
          if (profit > maxProfit) {
            maxProfit = profit;
            bestBuildingSequence = [type, ...result.buildings];
          }
        }
      }
      
      memo[timeLeft] = { profit: maxProfit, buildings: bestBuildingSequence };
      return memo[timeLeft];
    }
    
    const result = dp(n);
    
    const counts = { T: 0, P: 0, C: 0, earnings: result.profit };
    result.buildings.forEach(type => counts[type]++);
    
    return counts;
  }
  
  const testCases = [
    { timeUnit: 7, expectedEarnings: 3000 },
    { timeUnit: 8, expectedEarnings: 4500 },
    { timeUnit: 13, expectedEarnings: 16500 }
  ];
 
  for (const test of testCases) {
    const result = maxProfit(test.timeUnit);
    console.log(`Time Unit: ${test.timeUnit}`);
    console.log(`Earnings: $${result.earnings}`);
    console.log(`Solution: T: ${result.T} P: ${result.P} C: ${result.C}`);
    console.log("-------------------");
  }