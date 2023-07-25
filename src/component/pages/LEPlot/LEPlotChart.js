import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import ReactEcharts from "echarts-for-react";

function LEPLotChart() {
  const jdataset = useSelector((state) => state.jdata.data);
  const idList = useSelector((state) => state.jdata.idList);
  const watchList = useSelector((state) => state.jdata.watchList);
  const dataToShow = [
    "SampleID",
    "Wvl_nm",
    "HalfWidth",
    "Cie_x",
    "Cie_y",
    "Voltage",
    "Cdm2",
    "Qe",
    "CdA",
    "LmW",
  ];
  return (
    <div>
      <>
        {watchList.map((item, index) => {
          return <div key={index}> {item} </div>;
        })}
      </>
      <LEChart data={jdataset} idList={idList} cd={10} />
      <>
        {watchList.length > 0 ? (
          <JTableSingleTable dataToShow = {dataToShow}
            data={_.filter(jdataset, function (o) {
              return (
                o.SampleID.slice(0, 10) === watchList[watchList.length - 1]
              );
            })}
          />
        ) : null}
      </>
    </div>
  );
}

function LEPLotChartOJ() {
  const ojdataset = useSelector((state) => state.ojdata.data);
  const idList = useSelector((state) => state.ojdata.idList);
  const watchList = useSelector((state) => state.ojdata.watchList);
  const dataToShow = [
    "Title",
    "CIE_X",
    "CIE_Y",
    "Luminance",
    "LE"
  ];
  return (
    <div>
      <>
        {watchList.map((item, index) => {
          return <div key={index}> {item} </div>;
        })}
      </>
      <LEChart data={ojdataset} idList={idList} cd={15} />
      <>
        {watchList.length > 0 ? (
          <JTableSingleTable
            dataToShow = {dataToShow}
            data={_.filter(ojdataset, function (o) {
              return (
                o.Title.slice(0, 10) === watchList[watchList.length - 1] && o.CurrentDensity === 15
              );
            })}
          />
        ) : null}
      </>
    </div>
  );
}

function LEChart(props) {
  const { data, idList, cd } = props;
  let newSeries = [];
  if (cd === 10) {
    idList.forEach(function (id) {
      let filtered = _.filter(data, function (o) {
        return o.SampleID.slice(0, 10) === id.id;
      });
      newSeries.push({
        name: id.id,
        type: "scatter",
        emphasis: {
          focus: "series",
        },
        symbolSize: 5,
        data: filtered.map((d) => [
          d.Cie_x,
          d.CdA,
          d.SampleID,
          Number(d.SampleID.slice(11, 12)),
        ]),
      });
    });
  } else {
    idList.forEach(function (id) {
      let filtered = _.filter(data, function (o) {
        return o.Title.slice(0, 10) === id.id && o.CurrentDensity === 15;
      });
      newSeries.push({
        name: id.id,
        type: "scatter",
        emphasis: {
          focus: "series",
        },
        symbolSize: 5,
        data: filtered.map((d) => [
          d.CIE_X,
          d.LE,
          d.Title,
          Number(d.Title.slice(11, 12)),
        ]),
      });
    });
  }
  const option = {
    title: {
      text: "LE vs CIE_X",
    },
    grid: {
      left: "3%",
      right: "7%",
      bottom: "12.5%",
      containLabel: true,
    },
    tooltip: {
      formatter: function (params) {
        return (
          params.value[2] +
          " :<br/>" +
          "CIE_X: " +
          parseFloat(params.value[1]).toFixed(3) +
          " " +
          "LE: " +
          parseFloat(params.value[0]).toFixed(3)
        );
      },
      axisPointer: {
        show: true,
        type: "cross",
        lineStyle: {
          type: "dashed",
          width: 1,
        },
      },
    },
    toolbox: {
      feature: {
        dataZoom: {},
        brush: {
          type: ["rect", "polygon", "clear"],
        },
      },
    },
    brush: {},
    legend: {
      data: idList.map((id) => id.id),
      left: "center",
      bottom: 10,
    },
    xAxis: [
      {
        type: "value",
        name: "CIE_X",
        scale: true,
        axisLabel: {
          formatter: "{value}",
        },
        nameLocation: "middle",
        nameGap: 30,
      },
    ],
    yAxis: [
      {
        type: "value",
        name: `LE @${cd}J [cd/A]`,
        scale: true,
        axisLabel: {
          formatter: "{value}",
        },
        nameLocation: "middle",
        nameGap: 40,
      },
    ],
    series: newSeries,
    visualMap: [
      {
        left: 10,
        type: "piecewise",
        splitNumber: 3,
        dimension: 3,
        min: 1,
        max: 9,
        inRange: {
          symbol: ["circle", "square", "triangle"],
        },
        formatter: function (value, value2) {
          return "c" + Math.ceil(value) + "- c" + Math.floor(value2);
        },
        itemHeight: 8,
        itemWidth: 9,
        textStyle: {
          fontSize: 9,
        },
      },
    ],
  };
  return (
    <div className="pb-10">
      <ReactEcharts
        option={option}
        notMerge={true}
        style={{ height: "500px", width: "100%" }}
      />
    </div>
  );
}

function JTableSingleTable(props) {
  const { data, dataToShow } = props;
  // console.log(data);
  // const dataToShow = [
  //   "SampleID",
  //   "Wvl_nm",
  //   "HalfWidth",
  //   "Cie_x",
  //   "Cie_y",
  //   "Voltage",
  //   "Cdm2",
  //   "Qe",
  //   "CdA",
  //   "LmW",
  // ];
  let stat = {};
  dataToShow.map(function (d, index) {
    // console.log(d);
    return (stat[d] = _.meanBy(data, d));
  });
  // console.log(stat);
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <table className="relative w-full border">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {dataToShow.map((title) => (
                <th
                  scope="col"
                  className=" px-6 py-3 mx-auto text-xs font-medium text-gray-500 bg-gray-100"
                  key={title}
                >
                  <div className="flex items-center justify-center">
                    {title}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <>
              <tr>
                {dataToShow.map(function (d, index) {
                  return (
                    <td
                      key={index}
                      className="px-6 py-2 whitespace-nowrap text-sm bg-yellow-200 text-center"
                    >
                      {d === "SampleID"
                        ? "Average"
                        : Math.round(stat[d] * 1000) / 1000}
                    </td>
                  );
                })}
              </tr>
              {data.map(function (d, index) {
                return (
                  <tr key={data.SampleID}>
                    {dataToShow.map(function (title, index) {
                      return (
                        <td
                          key={index}
                          className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center"
                        >
                          {Math.round(d[title] * 1000) / 1000
                            ? Math.round(d[title] * 1000) / 1000
                            : d[title]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LEPLotChart;
export { LEPLotChartOJ };
