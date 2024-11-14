// BarChart.js
import React from "react";
import { Bar } from "@ant-design/plots";

const BarChart = ({ data }) => {
  // Transform data for the bar chart
  const config = {
    data,
    xField: 'amount',
    yField: 'type',
    seriesField: 'type',
    colorField: 'type',
    color: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'], // Custom colors for the types
    xAxis: {
      label: {
        formatter: (v) => `${v}`,
      },
    },
    legend: {
      position: 'top-left',
    },
  };

  return <Bar {...config} />;
};

export default BarChart;
