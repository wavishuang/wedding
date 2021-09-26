import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const DoughnutChart = (props) => (
  <>
    <Doughnut data={props.chartData} />
  </>
);

export default DoughnutChart;