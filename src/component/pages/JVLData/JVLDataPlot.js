import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import ReactEcharts from "echarts-for-react";

function JVLDataPlot() {
  const jvlfdataset = useSelector((state) => state.jvlfdata.data);
  const idList = useSelector((state) => state.jvlfdata.idList);
  const watchList = useSelector((state) => state.jvlfdata.watchList);
  const dispatch = useDispatch();
  //   const jvldata = _.filter(jvlfdataset, { 'age': 36, 'active': true });
  //   console.log("first");
  //   console.log(jvlfdataset);
  const jvldata = _.filter(jvlfdataset, function (o) {
    return o.SampleID.slice(0, 10) === watchList[watchList.length - 1];
  });
  console.log(jvldata);

  return (
    <div>
      <hr />
      {jvldata.length > 0 ? <JVLPlotView data={jvldata} /> : <div>No data</div>}
    </div>
  );
}

function JVLPlotView({ data }) {
  return (
    <div>
      <JVLChart data={data} x="CurrentDensity" y="Luminance" />
      <JVLChart data={data} x="Luminance" y="Qe" />
      <JVLChart data={data} x="CurrentDensity" y="Qe" />
      <JVLChart data={data} x="CurrentDensity" y="PD" />
      <JVLChart data={data} x="Voltage" y="PD" />
    </div>
  );
}

function JVLChart({ data, x, y }) {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    const formattedData = data.map((item) => {
      return {
        name: item.SampleID,
        type: "line",
        data: item.JVLForwardDetail.filter((detail) => detail[x] > 0.1).map(
          (detail) => [detail[x], detail[y]]
        ),
      };
    });
    setChartData(formattedData);
  }, [data, x, y]);

  const option = {
    title: {
      text: `${y} vs ${x}`,
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: x === "Luminance" || x === "CurrentDensity" ? "log" : "value",
      name: x,
    },
    yAxis: {
      type: "value",
      name: y,
    },
    legend: {
      orient: "vertical",
      left: "right",
    },
    toolbox: {
      left: "center",
      itemSize: 25,
      top: 30,
      feature: {
        dataZoom: {},
      },
    },
    dataZoom: [
      {
        type: "inside",
        throttle: 50,
      },
    ],
    series: chartData,
  };

  return (
    <div>
      <ReactEcharts
        option={option}
        notMerge={true}
        style={{ height: "600px", width: "100%" }}
      />
    </div>
  );
}

export default JVLDataPlot;
