var svgWidth = 1000;
var svgHeight = 700;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis="healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(StateData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(StateData, d => d[chosenXAxis]) * 0.8,
      d3.max(StateData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

function yScale(StateData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(StateData, d => d[chosenYAxis]) * 0.8,
      d3.max(StateData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating xAxis and yAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCirclesX(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderCirclesY(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}


function renderCircleTextX(circleText, newXScale, chosenXAxis) {

  circleText.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]));

  return circleText;
}

function renderCircleTextY(circleText, newYScale, chosenYAxis) {

  circleText.transition()
    .duration(1000)
    .attr("dy", d => newYScale(d[chosenYAxis]));

  return circleText;
}


// function used for updating circles group with new tooltip


// Retrieve data from the CSV file and execute everything below
d3.csv("data/data.csv").then(function(StateData, err) {
  if (err) throw err;

  // parse data
  StateData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age= +data.age
    data.income=+data.income;
    data.healthcare = +data.healthcare;
    data.smokes= +data.smokes
    data.obesity=+data.obesity
  });

  // xLinearScale and yLinear Scale function above csv import
  var xLinearScale = xScale(StateData, chosenXAxis);
  var yLinearScale = yScale(StateData, chosenYAxis);



  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis= chartGroup.append("g")
    .classed("y-axis", true)  
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(StateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("class", "stateCircle");
  //
  
  var circleText = chartGroup.selectAll("text2")
  .data(StateData)
  .enter()
  .append("text")
  .attr("dx",d => xLinearScale(d[chosenXAxis]))
  .attr("dy",d => yLinearScale(d[chosenYAxis])+3)
  .text( function (d) { return (d.abbr)})
  .classed("stateText", true)
  .style("font-size", "9px")
  .style("font-weight", "800")
  

  // Create group for two x-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (median)");
  
  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (median)");  

  // append y axis
  var ylabelsGroup=chartGroup.append("g")
    .attr("transform", "rotate(-90)")
    
  var healthcareLabels =ylabelsGroup.append("text")
    .attr("y", -40)
    .attr("x", 0 - (height / 2))
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%)"); 

  var smokesLabels =ylabelsGroup.append("text")
    .attr("y", -60)
    .attr("x", 0 - (height / 2))
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");   
  
  var obesityLabels =ylabelsGroup.append("text")
    .attr("y", -80)
    .attr("x", 0 - (height / 2))
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obesity (%)");   

  // updateToolTip function above csv import

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(StateData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);

        //update Circle text new values

        circleText=renderCircleTextX(circleText,xLinearScale, chosenXAxis);

        // updates tooltips with new info

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);  
        }
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);  
        }
        if (chosenXAxis === "income") {
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);  
        }
      }
    });
    ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(StateData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);

        //update Circle text new values

        circleText=renderCircleTextY(circleText,yLinearScale, chosenYAxis);

        // updates tooltips with new info

        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          healthcareLabels
            .classed("active", true)
            .classed("inactive", false);
          smokesLabels
            .classed("active", false)
            .classed("inactive", true);
          obesityLabels
            .classed("active", false)
            .classed("inactive", true);
        }
        if (chosenYAxis === "smokes") {
          smokesLabels
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabels
            .classed("active", false)
            .classed("inactive", true);
          obesityLabels
            .classed("active", false)
            .classed("inactive", true);  
        }
        if (chosenYAxis === "obesity") {
          obesityLabels
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabels
            .classed("active", false)
            .classed("inactive", true);
          smokesLabels
            .classed("active", false)
            .classed("inactive", true);  
        }
      }
    });
}).catch(function(error) {
  console.log(error);
});
