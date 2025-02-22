import React from "react";
import ReactEcharts from "echarts-for-react";

function ChartPlot(props) {
  const { Qe, RunID, Voltage, date, keyword, material } = props.data;
  // console.log(props.data)
  const option = {
    title: {
      text: material,
      subtext: keyword,
      left: "center",
      align: "right",
    },

    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        animation: false,
        label: {
          backgroundColor: "#505765",
        },
      },
      formatter: function (params) {
        var res = RunID[params[0].dataIndex] + "<br/>" + params[0].name;
        for (var i = 0, l = params.length; i < 2; i++) {
          res +=
            '<br/> <span style="font-weight:bold;">' +
            params[i].seriesName +
            "</span> :" +
            params[i].value;
        }
        return res;
      },
    },
    legend: {
      data: ["EQE", "Voltage"],
      left: 10,
    },
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: 0,
        start: 50,
        end: 100,
      },
      {
        show: true,
        xAxisIndex: 0,
        type: "slider",
        top: "85%",
        start: 50,
        end: 100,
      },
    ],
    grid: {
      top: "15%",
      bottom: "20%",
    },
    xAxis: [
      {
        type: "category",
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          onZero: false,
        },
        data: date,
      },
    ],
    yAxis: [
      {
        name: "EQE",
        type: "value",
        scale: true,
      },
      {
        name: "Voltage",
        type: "value",
        scale: true,
      },
    ],
    series: [
      {
        name: "EQE",
        type: "line",
        smooth: true,
        data: Qe,
        runId: RunID,
      },
      {
        name: "Voltage",
        yAxisIndex: 1,
        type: "line",
        smooth: true,
        data: Voltage,
        runId: RunID,
      },
    ],
  };

  return (
    <ReactEcharts option={option} style={{ height: "650px", width: "100%" }} />
  );
}

function SelectedDopantPlot(props) {
  const dataset = props.data;
  const { id, topic, data } = dataset;
  return (
    <div className="py-2">
      {/* <h1 className="font-bold text-2xl px-2 underline py-2 "> {topic}</h1> */}
      {data.map((d) => (
        <ChartPlot key={d.material} data={d} />
      ))}
    </div>
  );
}

export default SelectedDopantPlot;
