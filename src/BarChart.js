import React, {Component} from 'react'
import './App.css'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'
import { axisLeft, axisBottom } from 'd3-axis'
import { line } from 'd3-line'

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
        const dataMax = max(this.props.data)
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

        var line = line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.close); });
            
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
       //  });

    }

    render() {
        return <svg ref={node => this.node = node}
        width={this.width} height={this.height}>
        </svg>
    }
}

export default BarChart