function calculateWater() {
    const inputStr = document.getElementById('blockInput').value;
    const heights = inputStr.split(',').map(n => parseInt(n.trim()));

    if (!heights.every(h => !isNaN(h) && h >= 0)) {
        alert("Please enter valid non-negative integers separated by commas");
        return;
    }
    
    const waterUnits = computeWaterUnits(heights);
   
    document.getElementById('result').textContent = `${waterUnits} Units`;
  
    createVisualization(heights);
}

function computeWaterUnits(heights) {
    const n = heights.length;
    if (n <= 2) return 0; // Need at least 3 blocks to trap water
    
    let totalWater = 0;
    
    const leftMax = new Array(n).fill(0);
    leftMax[0] = heights[0];
    for (let i = 1; i < n; i++) {
        leftMax[i] = Math.max(leftMax[i-1], heights[i]);
    }
   
    const rightMax = new Array(n).fill(0);
    rightMax[n-1] = heights[n-1];
    for (let i = n-2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i+1], heights[i]);
    }
   
    for (let i = 0; i < n; i++) {
        // Water at current position = min(leftMax, rightMax) - current height
        const waterAtPosition = Math.min(leftMax[i], rightMax[i]) - heights[i];
        if (waterAtPosition > 0) {
            totalWater += waterAtPosition;
        }
    }
    
    return totalWater;
}

function createVisualization(heights) {
    const n = heights.length;
    if (n === 0) return;
    
    const waterLevels = new Array(n).fill(0);
    const leftMax = new Array(n).fill(0);
    const rightMax = new Array(n).fill(0);
    
    leftMax[0] = heights[0];
    for (let i = 1; i < n; i++) {
        leftMax[i] = Math.max(leftMax[i-1], heights[i]);
    }
    
    rightMax[n-1] = heights[n-1];
    for (let i = n-2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i+1], heights[i]);
    }
    
    for (let i = 0; i < n; i++) {
        const waterLevel = Math.min(leftMax[i], rightMax[i]);
        waterLevels[i] = waterLevel > heights[i] ? waterLevel : heights[i];
    }
    
    // Setting dimensions for SVG
    const blockWidth = 50;
    const unitHeight = 30;
    const maxHeight = Math.max(...waterLevels);
    const svgWidth = blockWidth * n;
    const svgHeight = unitHeight * (maxHeight + 1); // +1 for empty space at top
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
    svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    
    for (let i = 0; i <= maxHeight; i++) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        const y = svgHeight - i * unitHeight;
        line.setAttribute("x1", 0);
        line.setAttribute("y1", y);
        line.setAttribute("x2", svgWidth);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "#ddd");
        line.setAttribute("stroke-width", "1");
        svg.appendChild(line);
    }
    
    for (let i = 0; i <= n; i++) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        const x = i * blockWidth;
        line.setAttribute("x1", x);
        line.setAttribute("y1", 0);
        line.setAttribute("x2", x);
        line.setAttribute("y2", svgHeight);
        line.setAttribute("stroke", "#ddd");
        line.setAttribute("stroke-width", "1");
        svg.appendChild(line);
    }
    
    for (let i = 0; i < n; i++) {
        const blockHeight = heights[i];
        const waterHeight = waterLevels[i] - blockHeight;
       
        if (blockHeight > 0) {
            const block = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            block.setAttribute("x", i * blockWidth);
            block.setAttribute("y", svgHeight - blockHeight * unitHeight);
            block.setAttribute("width", blockWidth);
            block.setAttribute("height", blockHeight * unitHeight);
            block.setAttribute("class", "block");
            svg.appendChild(block);
        }
        
        if (waterHeight > 0) {
            const water = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            water.setAttribute("x", i * blockWidth);
            water.setAttribute("y", svgHeight - (blockHeight + waterHeight) * unitHeight);
            water.setAttribute("width", blockWidth);
            water.setAttribute("height", waterHeight * unitHeight);
            water.setAttribute("class", "water");
            svg.appendChild(water);
        }
    }
    
    const vizContainer = document.getElementById('visualization');
    vizContainer.innerHTML = '';
    vizContainer.appendChild(svg);
}

window.onload = function() {
    document.getElementById('blockInput').value = "0,4,0,0,0,6,0,6,4,0";
    calculateWater();
};