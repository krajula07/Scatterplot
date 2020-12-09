// Set the dimensions of the canvas / graph

const margin = {top: 10, right: 20, bottom: 50, left: 50};
const width = 800 - margin.left - margin.right;
const height = 470 - margin.top - margin.bottom;

// parse the date / time
const parseTime = d3.timeParse("%Y");

// set the ranges
const xScale = d3.scaleLog()
                 .range([0, width]);
const yScale = d3.scaleLinear()
                  .range([height, 0]);
const radiusScale=d3.scaleSqrt();

// define the line
const valueline = d3.line()
                    .x(function(d) { return xScale(d.date); })
                    .y(function(d) { return yScale(d.close); });

// append the svg object to the body of the page
// append a g (group) element to 'svg' and
// move the g element to the top+left margin
var svg = d3.select(".center").append("svg")
                           .attr("width", width + margin.left + margin.right)
                           .attr("height", height + margin.top + margin.bottom)
                           .append("g")
                           .attr("transform", `translate(${margin.left},${margin.top})`);

// Get the data
d3.tsv("data/gapminderDataFiveYear.tsv").then(data => {
  data=data.filter(function(d){ return  (+d.year == 1952 || +d.year == 2007) }) ;
    // format the data such that strings are converted to their appropriate types
    data.forEach(function(d) {

      d.country=d.country;
      d.year=+d.year;
        d.pop=+d.pop;
        d.continent=d.continent;
        d.lifeExp=+d.lifeExp;
        d.gdpPercap=+d.gdpPercap;

    });
    console.log(data);

    // Set scale domains based on the loaded data
    xScale.domain(d3.extent(data, function(d) { return d.gdpPercap; }));
    yScale.domain([28.75, d3.max(data, function(d) { return d.lifeExp; })]);
    radiusScale

      .domain(d3.extent(data,function(d) { return d.pop; }))
      .range([4,10]);
    var accent = d3.scaleOrdinal(d3.schemeAccent);
    var colorscale = d3.scaleOrdinal(d3.schemeCategory10).domain(["1952","2007"])


    // Add the valueline
  //  svg.append("path")
    //    .data([data])
    //    .attr("class", "line")
    //    .attr("d", valueline);

    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")

        .attr('fill-opacity', 0.8)
        .attr("cx", function(d) { return xScale(d.gdpPercap); })
        .attr("cy", function(d) { return yScale(d.lifeExp); })
        .style("fill", function (d) { return colorscale(d.year);} )
        .attr("r", function (d) {return radiusScale(d.pop);});





        svg.append("text")
        .style("font-size","14px")
        .style("font-weight", "bold")
        .style("font-family","sans-serif")
        .style("font-weight", "700")  
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", width/2)
    .attr("y", height +35)
    .text("GDP per capita");

    svg.append("text")
    .style("font-size","14px")
    .style("font-weight", "bold")
    .style("font-weight", "700")
    .style("font-family","sans-serif")
.attr("class", "y label")
.attr("text-anchor", "middle")
.attr("x", -height/2)
.attr("y", -35)


.attr("transform", "rotate(-90)")
.text("life expectancy");



// Handmade legend
svg.append("rect")
  .attr("x",width-25)
  .attr("y",120)
  .attr("width", 10)
  .attr("height", 10)
  .style("fill", colorscale(1952));
svg.append("rect")
  .attr("x",width-25)
  .attr("y",135)
  .attr("width", 10)
  .attr("height", 10)
  .style("fill", colorscale(2007))
svg.append("text")
  .attr("x", width-10)
  .attr("y", 130)
  .text("1952")
  .style("font-size", "11px")
  .attr("alignment-baseline","middle")
svg.append("text")
  .attr("x", width-10)
  .attr("y", 145)
  .text("2007")
  .style("font-size", "11px")
  .attr("alignment-baseline","middle")

svg.append("text")
.style("font-size","16px")
.style("font-weight", "bold")
.style("font-weight", "700")
.style("font-family","sans-serif")
        .attr("x", (width / 2))
        .attr("y", 10 - (margin.top / 2))
        .attr("text-anchor", "middle")

        .style("text-decoration", "underline")
        .text("GDP vs Life Expectancy(1952,2007)");
    // Add the axes
    const yAxis = d3.axisLeft(yScale);
    svg.append("g")

        .call(yAxis);
    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis.ticks(11,".0s"));


});
