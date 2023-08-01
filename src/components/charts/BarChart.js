import React, { Component, useState } from "react";
import Chart from "react-apexcharts";
import { barChartData } from "./chartData";

// class BarChart extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       chartData: [],
//       chartOptions: {},
//     };
//   }

//   componentDidMount() {
//     this.setState({
//       chartData: this.props.chartData,
//       chartOptions: this.props.chartOptions,
//     });
//   }

//   render() {
//     return (
//       <Chart
//         options={this.state.chartOptions}
//         series={this.state.chartData}
//         type='bar'
//         width='100%'
//         height='100%'
//       />
//     );
//   }
// }

const BarChart = (props) => {
  return (
    <Chart
      options={props.chartOptions}
      series={props.chartData}
      type="bar"
      width="100%"
      height="100%"
    />
  );
};

export default BarChart;
