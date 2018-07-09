import React, {Component} from 'react'
import './App.css'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'
import { axisLeft, axisBottom } from 'd3-axis'
import d3 from 'd3'
//import d3_scale from 'd3-scale'

class BarChart extends Component {
    constructor(props) {
        super(props)
        this.createBarChart = this.createBarChart.bind(this);
        this.width = 700;
        this.height = 400;
        this.padding = 100;
    }

    componentDidMount() {
        this.createBarChart()
    }

    componentDidUpdate() {
        this.createBarChart()
    }

    createBarChart() {
        const node = this.node;
        /*const dataMax = max(this.props.data)
        const yScale = scaleLinear()
            .domain([0, 1])
            .range([this.height - this.padding, this.padding])
        var axis = axisLeft(scaleLinear());
        

       //  select(node)
       //      .selectAll('rect')
       //      .data(this.props.data)
       //      .enter()
       //      .append('rect')
   
       // select(node)
       //      .selectAll('rect')
       //      .data(this.props.data)
       //      .exit()
       //      .remove()
       
       // select(node)
       //      .selectAll('rect')
       //      .data(this.props.data)
       //      .style('fill', '#fe9922')
       //      .attr('x', (d,i) => i * 25)
       //      .attr('y', d => this.props.size[1]-yScale(d))
       //      .attr('height', d => yScale(d))
       //      .attr('width', 25)

        // select(node)
        //     .append("g")
        //     .attr("transform", "translate(0,30)")
        //     .call(axis);

        // define the x scale (horizontal)
        var mindate = new Date(2012,0,1),
            maxdate = new Date(2012,0,31);

        var x = scaleLinear()
            .rangeRound([0, this.width]);

        var y = scaleLinear()
            .rangeRound([this.height, 0]);

        let d3L = new d3line();
        var line = d3L
            .x(function(d) { return x(d); })
            //.y(function(d) { return y(d.close); });

            
        var xScale = scaleLinear()
            .domain([1, 20000])    // values between for month of january
            .range([this.padding, this.width - this.padding * 2]);   // map these the the chart width = total width minus padding at both sides
        
        let yAxis = axisLeft(yScale);
        let xAxis = axisBottom(xScale);
    
        // // define the y axis
        // var yAxis = axis()
        //     .orient("left")
        //     .scale(yScale);
        
        // // define the y axis
        // var xAxis = axis()
        //     .orient("bottom")
        //     .scale(xScale);
            
        // draw y axis with labels and move in from the size by the amount of padding
        select(node)
            .append("g")
            .attr("class", "yaxis")   // give it a class so it can be used to select only xaxis labels  below
            .attr("transform", `translate(${this.padding},0)`)
            .call(yAxis);
        // draw x axis with labels and move to the bottom of the chart area
        select(node)
            .append("g")
            .attr("class", "xaxis")   // give it a class so it can be used to select only xaxis labels  below
            .attr("transform", "translate(0," + (this.height - this.padding) + ")")
            .call(xAxis);
            
        select(node)
            .select("g")
            .append("path")
            .datum(this.props.data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line);
        //rescale()
        // now rotate text on x axis
        // solution based on idea here: https://groups.google.com/forum/?fromgroups#!topic/d3-js/heOBPQF3sAY
        // first move the text left so no longer centered on the tick
        // then rotate up to get 45 degrees.
       // select(node)
       //      .selectAll(".xaxis text")  // select all the text elements for the xaxis
       //    .attr("transform", function(d) {
       //        return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
       //  });*/

       // set the dimensions and margins of the graph
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;


        // set the ranges
        var x = scaleLinear().range([0, width]);
        var y = scaleLinear().range([height, 0]);

        // define the line
        var valueline = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.close); });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        // // Get the data
        // d3.csv("data.csv", function(error, data) {
        //   if (error) throw error;

        //   // format the data
        //   data.forEach(function(d) {
        //       d.date = parseTime(d.date);
        //       d.close = +d.close;
        //   });

        //   // Scale the range of the data
        //   x.domain(d3.extent(data, function(d) { return d.date; }));
        //   y.domain([0, d3.max(data, function(d) { return d.close; })]);

        //   // Add the valueline path.
        //   svg.append("path")
        //       .data([data])
        //       .attr("class", "line")
        //       .attr("d", valueline);

        //   // Add the X Axis
        //   svg.append("g")
        //       .attr("transform", "translate(0," + height + ")")
        //       .call(d3.axisBottom(x));

        //   // Add the Y Axis
        //   svg.append("g")
        //       .call(d3.axisLeft(y));
        // }

    }


    render() {
        return <svg ref={node => this.node = node}
        width={this.width} height={this.height}>
        </svg>
    }
}

export default BarChart