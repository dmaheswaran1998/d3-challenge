var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data/data.csv").then(function(StateData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    StateData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(StateData, d => d.poverty), d3.max(StateData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(StateData, d => d.healthcare), d3.max(StateData, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);
    
    //
    var circlesGroup = chartGroup.selectAll("circle")
      .data(StateData)
      .enter()
      .append("circle"); //append the circles 

    var text=chartGroup.selectAll("text2")
      .data(StateData)
      .enter()
      .append("text");
      
    var circleAttributes= circlesGroup
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", 10)
      .attr("class", "stateCircle");

      
    var textLabels = text
      .attr("dx",d => xLinearScale(d.poverty))
      .attr("dy",d => yLinearScale(d.healthcare)+3)
      .text( function (d) { return (d.abbr)})
      .classed("stateText", true)
      .style("font-size", "9px")
      .style("font-weight", "800")
    
      chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("font-weight", "bold")
      .attr("class", "aText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "aText")
      .style("font-weight", "bold")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);  
    
})

