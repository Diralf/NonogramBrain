import React, { Component } from 'react'
import './App.css'
import rd3 from 'react-d3'
import d3 from 'd3'

var LineChart = rd3.LineChart;

class Series {
    constructor (name) {
        this.name = name;
        this.values = [];
    }
}

class ErrorLine extends Component {
    constructor(props) {
        super(props)
        LineChart = rd3.LineChart;
        console.log(LineChart);
        // this.lineData = [
        // {
        //     name: "series1",
        //     values: [{ x: 0, y: 0 }]
        // },
        // {
        //     name: "series2",
        //     values: [ { x: 0, y: 0 }, { x: 0, y: 0 } ]
        // }
        // ];
        this.state = { lineData: [
        {
            name: "series1",
            values: [{ x: 0, y: 0 }]
        },
        {
            name: "series2",
            values: [ { x: 0, y: 0 }, { x: 0, y: 0 } ]
        }
        ] };

    } 

    componentDidMount() {
        fetch('/api/trainstart')
            .then(response => {
                //console.log(response.json());
                this.getError();
            });
      }

    getError() {
        fetch('/api/trainerror')
            .then(response => response.json())
            .then(json => {
                console.log(json);
                if (json !== false)  {
                    let result = this.state.lineData[0].values.concat(json.map(value => ({x: value.iterations, y: value.error})));
                    console.log(result);
                    let data = this.state.lineData
                    data[0].values = result;

                    this.setState({ lineData: data })
                    

                    this.getError()
                }
            })
            .catch(err =>{
                this.getError()
            })
    }

    render() {
      return <LineChart
        legend={true}
        data={this.state.lineData}
        width={1000}
        height={300}
        title="Line Chart"
        />
   }
}
export default ErrorLine