import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import ReactEcharts from "echarts-for-react";

function LEPLotChart(props) {
  const jdataset = useSelector((state) => state.jdata.data);
  const idList = useSelector((state) => state.jdata.idList);
  const watchList = useSelector((state) => state.jdata.watchList);
  const [colorSetting, setColorSetting] = useState([]);
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
    "BI",
  ];
  const handleInputChange = (e) => {
    const colorsArray = e.target.value
      .split("")
      .map((color) => parseInt(color));
    setColorSetting(colorsArray);
  };
  return (
    <div>
      <>
        {watchList.map((item, index) => {
          return <div key={index}> {item} </div>;
        })}
      </>

      <div className="form-control pr-2 w-full py-5">
        <input
          type="text"
          placeholder="Input color Setting"
          className="input input-bordered input-sm w-full max-w-2xl"
          onChange={(e) => handleInputChange(e)}
        />
        <span className="label-text-alt px-1">Ex: 111222333 </span>
      </div>

      <LEChart
        data={jdataset}
        idList={idList}
        cd={10}
        colorSetting={colorSetting}
      />

      <BIChart
        data={jdataset}
        idList={idList}
        cd={10}
        colorSetting={colorSetting}
      />
      <>
        {watchList.length > 0 ? (
          <JTableSingleTable
            dataToShow={dataToShow}
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

function LEPLotChartOJ(props) {
  const { cd } = props;
  const ojdataset = useSelector((state) => state.ojdata.data);
  const idList = useSelector((state) => state.ojdata.idList);
  const watchList = useSelector((state) => state.ojdata.watchList);
  const [colorSetting, setColorSetting] = useState([]);
  const dataToShow = [
    "Title",
    "CurrentDensity",
    "CIE_X",
    "CIE_Y",
    "Luminance",
    "LE",
    "BI",
  ];
  const handleInputChange = (e) => {
    const colorsArray = e.target.value
      .split("")
      .map((color) => parseInt(color));
    setColorSetting(colorsArray);
  };
  return (
    <div>
      <>
        {watchList.map((item, index) => {
          return <div key={index}> {item} </div>;
        })}
      </>

      <div className="form-control pr-2 w-full py-5">
        <input
          type="text"
          placeholder="Input color Setting"
          className="input input-bordered input-sm w-full max-w-2xl"
          onChange={(e) => handleInputChange(e)}
        />
        <span className="label-text-alt px-1">Ex: 111222333 </span>
      </div>

      <LEChart
        data={ojdataset}
        idList={idList}
        cd={cd}
        colorSetting={colorSetting}
      />
      <BIChart
        data={ojdataset}
        idList={idList}
        cd={cd}
        colorSetting={colorSetting}
      />
      <>
        {watchList.length > 0 ? (
          <JTableSingleTable
            dataToShow={dataToShow}
            data={_.filter(ojdataset, function (o) {
              return (
                o.Title.slice(0, 10) === watchList[watchList.length - 1]
                // && o.CurrentDensity === cd
              );
            })}
          />
        ) : null}
      </>
    </div>
  );
}

function LEChart(props) {
  const { data, idList, cd, colorSetting } = props;
  console.log(data.length, "length");
  // console.log(
  //   "data",
  //   _.filter(data, function (o) {
  //     return o.Title.includes("H-121024-F");
  //   }).map((o) => ({ Title: o.Title, CurrentDensity: o.CurrentDensity }))
  // );
  let newSeries = [];
  let isColorSetting = colorSetting !== undefined ? true : false;
  const colorOption = [
    "#5470c6",
    "#91cc75",
    "#fac858",
    "#ee6666",
    "#73c0de",
    "#3ba272",
    "#fc8452",
    "#9a60b4",
    "#ea7ccc",
  ];
  if (cd === 10) {
    idList.forEach(function (id, index) {
      let filtered = _.filter(data, function (o) {
        return o.SampleID.slice(0, 10) === id.id;
      });
      const seriesConfig = {
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
      };
      if (
        isColorSetting &&
        colorOption[colorSetting[index] - 1] !== undefined
      ) {
        seriesConfig.color = colorOption[colorSetting[index] - 1];
      }
      newSeries.push(seriesConfig);
    });
  } else {
    const cdList = String(cd)
      .split(",")
      .map((num) => parseFloat(num));
    // console.log("cdList", cdList);
    cdList.forEach((currentCd) => {
      idList.forEach(function (id, index) {
        let filtered = _.filter(data, function (o) {
          // console.log(o.CurrentDensity, cd);
          return (
            o.Title.slice(0, 10) === id.id &&
            parseFloat(o.CurrentDensity) === parseFloat(currentCd)
          );
        });
        // console.log(filtered, "filtered");
        const seriesConfig = {
          name: id.id + "_" + currentCd + "J",
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
          cd: currentCd,
        };
        if (
          isColorSetting &&
          colorOption[colorSetting[index] - 1] !== undefined
        ) {
          seriesConfig.color = colorOption[colorSetting[index] - 1];
        }
        newSeries.push(seriesConfig);
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
        saveAsImage: {},
      },
    },
    brush: {},
    legend: {
      // data: idList.map((id) => id.id),
      data: newSeries.map((series) => series.name),
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
          showMinLabel: false,
          showMaxLabel: false,
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
          symbolSize: [8],
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

function BIChart(props) {
  const { data, idList, cd, colorSetting } = props;
  let newSeries = [];
  let isColorSetting = colorSetting !== undefined ? true : false;
  const colorOption = [
    "#5470c6",
    "#91cc75",
    "#fac858",
    "#ee6666",
    "#73c0de",
    "#3ba272",
    "#fc8452",
    "#9a60b4",
    "#ea7ccc",
  ];
  if (cd === 10) {
    idList.forEach(function (id, index) {
      let filtered = _.filter(data, function (o) {
        return o.SampleID.slice(0, 10) === id.id;
      });
      const seriesConfig = {
        name: id.id,
        type: "scatter",
        emphasis: {
          focus: "series",
        },
        symbolSize: 5,
        data: filtered.map((d) => [
          d.Cie_y,
          d.BI,
          d.SampleID,
          Number(d.SampleID.slice(11, 12)),
        ]),
      };
      if (
        isColorSetting &&
        colorOption[colorSetting[index] - 1] !== undefined
      ) {
        seriesConfig.color = colorOption[colorSetting[index] - 1];
      }
      newSeries.push(seriesConfig);
    });
  } else {
    const cdList = String(cd)
      .split(",")
      .map((num) => parseFloat(num));
    // console.log("cdList", cdList);
    cdList.forEach((currentCd) => {
      idList.forEach(function (id, index) {
        let filtered = _.filter(data, function (o) {
          // console.log(o.CurrentDensity, cd);
          return (
            o.Title.slice(0, 10) === id.id &&
            parseFloat(o.CurrentDensity) === parseFloat(currentCd)
          );
        });
        // console.log(id.id, currentCd);
        const seriesConfig = {
          name: id.id + "_" + currentCd + "J",
          type: "scatter",
          emphasis: {
            focus: "series",
          },
          symbolSize: 5,
          data: filtered.map((d) => [
            d.CIE_Y,
            d.BI,
            d.Title,
            Number(d.Title.slice(11, 12)),
          ]),
        };
        if (
          isColorSetting &&
          colorOption[colorSetting[index] - 1] !== undefined
        ) {
          seriesConfig.color = colorOption[colorSetting[index] - 1];
        }
        newSeries.push(seriesConfig);
      });
    });
  }
  const option = {
    title: {
      text: "BI vs CIE_Y",
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
          "CIE_Y: " +
          parseFloat(params.value[1]).toFixed(3) +
          " " +
          "BI: " +
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
        saveAsImage: {},
      },
    },
    brush: {},
    legend: {
      data: newSeries.map((id) => id.name),
      left: "center",
      bottom: 10,
    },
    xAxis: [
      {
        type: "value",
        name: "CIE_Y",
        scale: true,
        axisLabel: {
          formatter: "{value}",
          showMinLabel: false,
          showMaxLabel: false,
        },
        nameLocation: "middle",
        nameGap: 30,
      },
    ],
    yAxis: [
      {
        type: "value",
        name: `BI @${cd}J [cd/A]`,
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
          symbolSize: [8],
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
  // console.log(rawData);
  // console.log(dataToShow);
  const sortedData = _.orderBy(data, ["CurrentDensity", "Title"]);
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
    return (stat[d] = _.meanBy(sortedData, d));
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
              {sortedData.map(function (d, index) {
                return (
                  <tr key={sortedData.SampleID}>
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
