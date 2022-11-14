import React from "react";
import ReactEcharts from "echarts-for-react";

function CPPPlot(props) {
  const {data} = props
  const option = {
    xAxis: {
      type: "time",
      scale: true,
    },
    yAxis: [
      {
        name: "Pressure",
        scale: true,
        axisLabel: {
          formatter: function (value) {
            return value.toExponential(3);
          },
        },
      },
      {
        name: "Cryo Temp",
        scale: true,
      },
    ],
    legend: {
      data: ['c1-Pressure', 'c2-Pressure', 'c1-Cryo Temp', 'c2-Cryo Temp'],
      animation: false,
  },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#505765",
        },
      },
    },
    dataZoom: [
      {
        startValue: "2022-06-01",
      },
      {
        type: "inside",
      },
    ],
    series: [
      {
        name: "c1-Pressure",
        type: "line",
        data: data["data"]["c1p"],
        animation: false,
        showSymbol: false,
      },
      {
        name: "c2-Pressure",
        type: "line",
        data: data["data"]["c2p"],
        animation: false,
        showSymbol: false,
      },
      {
        name: "c1-Cryo Temp",
        type: "line",
        yAxisIndex: 1,
        data: data["data"]["c1t"],
        animation: false,
        showSymbol: false,
      },
      {
        name: "c2-Cryo Temp",
        type: "line",
        yAxisIndex: 1,
        data: data["data"]["c2t"],
        animation: false,
        showSymbol: false,
      },
    ],
    animation: false
  };

  return (
    <div className="py-2">
      <ReactEcharts
        option={option}
        style={{ height: "500px", width: "100%" }}
      />
    </div>
  );
}

export default CPPPlot;