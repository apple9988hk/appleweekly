import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import ReactEcharts from "echarts-for-react";
import { addtoSinglePlotCouponList } from "../../../features/sdata/sdataSlice";

function SPlotSingle() {
  const sdataset = useSelector((state) => state.sdata.data);
  const idList = useSelector((state) => state.sdata.idList);
  const watchList = useSelector((state) => state.sdata.watchList);
  const plotList = useSelector((state) => state.sdata.singlePlotCouponList);
  const dispatch = useDispatch();
  const plotId = watchList.slice(-1)[0];
  const dataToPlot = _.filter(sdataset, function (o) {
    return o.Title.slice(0, 10) === plotId;
  });

  return (
    <div>
      {" "}
      {watchList.length > 0 ? (
        <PlotContainer
          data={dataToPlot}
          dispatch={dispatch}
          plotList={plotList}
        />
      ) : null}
    </div>
  );
}

export default SPlotSingle;

function PlotContainer(props) {
  const { data, dispatch, plotList } = props;

  // console.log("PlotList");
  // console.log(plotList)

  let filtered = _.filter(data, function (o) {
    return plotList.includes(o.Title.slice(-3));
  });

  return (
    <div className="py-2">
      <STable data={data} dispatch={dispatch} plotList={plotList} />
      <SingleLinePlot filtered={filtered} />
    </div>
  );
}

function SingleLinePlot(props) {
  const { filtered } = props;
  const option = {
    xAxis: {
      min: 380,
      max: 1040,
    },
    yAxis: {
      min: 0,
    },
    tooltip: {
      trigger: "axis",
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
        dataZoom: {
        },
      },
    },
    dataZoom: [
      {
        type: "inside",
        throttle: 50,
      },
    ],
    grid: {
      top: 50,
      left: 15,
      right: 15,
      height: 350,
    },
    series: filtered.map(function (d) {
      return {
        name: d.Title,
        data: d.SpectralDetail.map(function (d) {
          return [d.Wavelength, d.RadianceData];
        }),
        showSymbol: false,
        type: "line",
      };
    }),

  }
  const option_normalized = {
    xAxis: {
      min: 380,
      max: 1040,
    },
    yAxis: {
      min: 0,
    },
    tooltip: {
      trigger: "axis",
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
        dataZoom: {
        },
      },
    },
    dataZoom: [
      {
        type: "inside",
        throttle: 50,
      },
    ],
    grid: {
      top: 50,
      left: 15,
      right: 15,
      height: 350,
    },
    series: filtered.map(function (d) {
      let max = _.maxBy(d.SpectralDetail, "RadianceData")
      return {
        name: d.Title,
        data: d.SpectralDetail.map(function (d) {
          return [d.Wavelength, d.RadianceData/max.RadianceData];
        }),
        showSymbol: false,
        type: "line",
      };
    }),

  }
  return (
    <div>

      <ReactEcharts
        option={option}
        notMerge ={true}
        style={{ height: "500px", width: "100%" }}
      />
            <div className="font-bold"> Normalized </div>
      <ReactEcharts
        option={option_normalized}
        notMerge ={true}
        style={{ height: "500px", width: "100%" }}
      />
    </div>
  );
}

function STable(props) {
  const { data, dispatch, plotList } = props;
  const coupons = data.map((d) => d.Title.slice(0, 12));
  let unique = [...new Set(coupons)];
  // const [plotList, setPlotList] = useState(unique.map((d) => d + "d4"));
  // console.log(watchList)
  function toggleDot(dot) {
    dispatch(addtoSinglePlotCouponList(dot));
  }
  // console.log(plotList);
  return (
    <div className="overflow-x-auto w-full">
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th>Coupon</th>
            <th>d1</th>
            <th>d2</th>
            <th>d3</th>
            <th>d4</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {unique.map(function (d) {
            return (
              <tr>
                <td>
                  <div className="flex items-center space-x-3"> {d} </div>
                </td>

                {["1", "2", "3", "4"].map(function (e) {
                  let isChecked = plotList.includes(d.slice(-1) + "d" + e);
                  return (
                    <td>
                      <div>
                        <input
                          type="checkbox"
                          className="toggle w-4 h-4"
                          defaultChecked={isChecked}
                          onClick={() => toggleDot(d.slice(-1)+ "d" + e)}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
