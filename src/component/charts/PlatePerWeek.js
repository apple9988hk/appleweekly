import React from "react";
import ReactEcharts from "echarts-for-react";

function PlatePerWeek(props) {
  const { data } = props;
  const plotData = data.data;
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["BE", "TE"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "20%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: plotData["date"],
    },
    yAxis: {
      type: "value",
    },
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0, 1],
        start: 50,
        end: 100,
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: "slider",
        top: "85%",
        start: 50,
        end: 100,
      },
    ],
    series: [
      {
        name: "BE",
        type: "bar",
        stack: "Stack 1",
        label: {
          show: true,
          position: "insideBottom",
        },
        data: plotData["BE"],
      },
      {
        name: "TE",
        type: "bar",
        stack: "Stack 1",
        label: {
          show: true,
          position: "insideTop",
        },
        data: plotData["TE"],
      },
    ],
  };
  return (
    <div className = "py-2">
      <h1 className="font-bold text-2xl px-2 underline py-2 "> {data.topic}</h1>
      <ReactEcharts
        option={option}
        style={{ height: "500px", width: "100%" }}
      />
    </div>
  );
}

export default PlatePerWeek;
