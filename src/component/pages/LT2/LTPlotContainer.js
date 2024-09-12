import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLTData } from "../../../features/ltdata/ltdataSlice";
import _, { filter } from "lodash";
import Plot from "react-plotly.js";
import { ChevronsDown, ChevronsUp, Search, Underline } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { removeListener } from "@reduxjs/toolkit";
import { Link } from "react-router-dom";

class SearchParam {}

function LTPlotContainer() {
  const [mode, setMode] = useState("plate");
  const [plots, setPlots] = useState([]);
  const [x1, setX1] = useState("");
  const [x2, setX2] = useState("");
  const [y1, setY1] = useState("");
  const [y2, setY2] = useState("");
  const [expTitle, setExpTitle] = useState("");

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [batchPlotInput, setBatchPlotInput] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Update Local if url search param updated, only do it when it is fresh
  useEffect(() => {
    // Extract query parameters from the URL
    const modeParam = new URLSearchParams(location.search).get("mode");
    const plotlistParam = new URLSearchParams(location.search).get("plotlist");
    const x1Param = new URLSearchParams(location.search).get("x1");
    const x2Param = new URLSearchParams(location.search).get("x2");
    const y1Param = new URLSearchParams(location.search).get("y1");
    const y2Param = new URLSearchParams(location.search).get("y2");
    const expTitleParam = new URLSearchParams(location.search).get("expTitle");
    // console.log("plotlistParam from searchParam", plotlistParam);
    if (plotlistParam) {
      if (plots.length === 0) {
        const plotsData = plotlistParam.split(",").map((plotData) => {
          const [sampleID, couponList, legend] = plotData.split("|");
          return {
            id: nextId.current++,
            sampleID: sampleID,
            couponList: couponList,
            legend: legend,
          };
          // return { id: nextId.current++, plotId: plotData };
        });

        setPlots(plotsData);
        // console.log("plots load from param", plotsData);
      }
    }

    if (x1Param && x1Param !== x1) setX1(x1Param);
    if (x2Param && x2Param !== x2) setX2(x2Param);
    if (y1Param && y1Param !== y1) setY1(y1Param);
    if (y2Param && y2Param !== y2) setY2(y2Param);
    if (modeParam && modeParam != mode) {
      setMode(modeParam);
    }
    if (expTitleParam && expTitleParam !== expTitle) setExpTitle(expTitleParam);
  }, []);
  // [
  //   plotlistParam,
  //   x1Param,
  //   x2Param,
  //   y1Param,
  //   y2Param,
  //   expTitleParam,
  //   modeParam,
  // ]);

  // Update search param if local changed
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (plots) {
      // console.log("plots to update", plots);
      const plotList = plots
        .map(({ sampleID, couponList, legend }) =>
          [sampleID, couponList, legend].join("|")
        )
        .join(",");
      // console.log(plotList);
      params.set("plotlist", plotList);
    }
    // params.set("plotlist", plots.map(({sampleID, couponList, legend}) => [sampleID,couponList,legend].join("|"))).join(",");
    if (expTitle) params.set("expTitle", expTitle);
    if (x1) params.set("x1", x1);
    if (x2) params.set("x2", x2);
    if (y1) params.set("y1", y1);
    if (y2) params.set("y2", y2);
    if (mode) params.set("mode", mode);
    navigate({ search: params.toString() });
  }, [plots, x1, x2, y1, y2, mode, expTitle]);

  const nextId = useRef(0); // Ref to keep track of the next unique IDa

  // UI function
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "plate" ? "exp" : "plate")); // Toggle between "plate" and "exp"
  };

  const handleResetAndNavigate = () => {
    removeAllPlots();
    navigate("/LT2?plotlist=");
  };

  const addPlot = (plotId) => {
    const newPlotId = nextId.current++;
    setPlots([
      ...plots,
      { id: newPlotId, sampleID: "", couponList: "", legend: "" },
    ]);
  };

  const removePlot = (id) => {
    setPlots(plots.filter((plot) => plot.id !== id));
  };

  const removeAllPlots = () => {
    setPlots([]);
    nextId.current = 0; // Reset the ID counter
  };

  const updatePlotId = (id, sampleID, couponList, legend) => {
    // console.log("updatePlotId", id, sampleID, couponList, legend);
    setPlots((prevPlots) =>
      prevPlots.map((plot) =>
        plot.id === id
          ? {
              ...plot,
              sampleID: sampleID,
              couponList: couponList,
              legend: legend,
            }
          : plot
      )
    );
  };

  const handleInputChange_batchPlot = (event) => {
    setBatchPlotInput(event.target.value);
  };

  const handleBatchPlotSubmit = (e) => {
    e.preventDefault();
    handleBatchPlotButton();
  };

  const handleBatchPlotButton = () => {
    const trimmedInput = batchPlotInput.trim();
    // console.log(batchPlotInput)
    const regex = /^(.{9})(.+)$/; // Base is the first 9 characters, suffix is the rest
    const match = trimmedInput.match(regex);

    if (match) {
      const base = match[1];
      const suffix = match[2];

      const newPlots = [...plots];

      for (const char of suffix) {
        const newPlotId = `${base}${char}`;
        if (!newPlots.some((plot) => plot.plotId === newPlotId)) {
          newPlots.push({
            id: nextId.current++,
            sampleID: newPlotId,
            couponList: "",
            legend: "",
          });
        }
      }
      setPlots(newPlots);
    }
  };

  return (
    <div>
      <div className="font-bold text-5xl">
        <button
          onClick={handleResetAndNavigate}
          className="hover:cursor-pointer bg-transparent"
        >
          LT View
        </button>
      </div>
      <div className="py-5">
        <button
          onClick={() => setMode("plate")}
          className={`px-4 py-2 rounded-lg focus:outline-none ${
            mode === "plate"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Plate Mode
        </button>

        <button
          onClick={() => setMode("exp")}
          className={`ml-2 px-4 py-2 rounded-lg focus:outline-none ${
            mode === "exp"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Exp Mode
        </button>
      </div>
      <div className="pt-5 pb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => addPlot(nextId.current++)}
            >
              Add Plot
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => removeAllPlots()}
            >
              Remove All
            </button>
            {mode === "plate" ? (
              <button
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              >
                {showAdvancedOptions ? (
                  <ChevronsUp className="w-4 h-4" />
                ) : (
                  <ChevronsDown className="w-4 h-4" />
                )}
              </button>
            ) : null}
          </div>

          <div className="flex items-center space-x-2 p-2">
            <div className="flex items-center space-x-1">
              <label className="text-gray-700 font-medium">X:</label>
              <input
                type="text"
                value={x1}
                onChange={(e) => setX1(e.target.value)}
                className="border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-12"
              />
              <input
                type="text"
                value={x2}
                onChange={(e) => setX2(e.target.value)}
                className="border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-12"
              />
            </div>
            <div className="flex items-center space-x-1">
              <label className="text-gray-700 font-medium">Y:</label>
              <input
                type="text"
                value={y1}
                onChange={(e) => setY1(e.target.value)}
                className="border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-12"
              />
              <input
                type="text"
                value={y2}
                onChange={(e) => setY2(e.target.value)}
                className="border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-12"
              />
            </div>
          </div>
        </div>
        {showAdvancedOptions && (
          <div className="p-2 border rounded-md mt-2">
            <div className="flex items-center py-5">
              <form onSubmit={handleBatchPlotSubmit} className="w-full">
                <label className="input input-bordered flex items-center gap-2 w-full">
                  Batch Plot
                  <input
                    type="text"
                    placeholder="H-072224-1234"
                    className="grow focus:outline-none focus:ring-0 w-full flex-1"
                    onChange={handleInputChange_batchPlot}
                    value={batchPlotInput}
                  />
                  <button
                    type="submit"
                    className="btn btn-sm btn-circle btn-outline"
                    // onClick={handleBatchPlotButton}
                  >
                    <Search className="w-5 h-5 p-0" />
                  </button>
                </label>
              </form>
            </div>
          </div>
        )}
      </div>
      {mode === "plate" ? (
        <div>
          {plots.map(({ id, sampleID, couponList, legend }) => (
            <div
              key={id}
              style={{ position: "relative", marginBottom: "10px" }}
            >
              <LTSinglePlot
                sampleID_input={{ sampleID, couponList, legend }}
                plotRange={{ x1, x2, y1, y2 }}
                onSampleIDChange={(newSampleID, newCouponList, newLegend) =>
                  updatePlotId(id, newSampleID, newCouponList, newLegend)
                }
              />
              <button
                onClick={() => removePlot(id)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                X
              </button>
            </div>
          ))}
          <div className="text-center mt-2">
            <button
              onClick={() => addPlot(nextId.current++)}
              style={{
                marginTop: "10px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>
      ) : null}
      {mode === "exp" ? (
        <div>
          <LTExpPlot
            plotsInput={plots}
            plotRange={{ x1, x2, y1, y2 }}
            onSampleIDChange={(id, sampleID, couponList, legend) =>
              updatePlotId(id, sampleID, couponList, legend)
            }
            removePlot={(id) => removePlot(id)}
            onExpTitleChange={(newTitle) => setExpTitle(newTitle)}
          />
        </div>
      ) : null}
    </div>
  );
}

export default LTPlotContainer;

const LTExpPlot = ({
  plotsInput,
  plotRange,
  onSampleIDChange,
  onExpTitleChange,
  removePlot,
}) => {
  console.log("Start the exp plot");
  // console.log(plotsInput);
  const globalPlotRange = plotRange;
  const ltdataStatus = useSelector((state) => state.ltdata.status);
  const ltdataSet = useSelector((state) => state.ltdata.data);
  const dispatch = useDispatch();

  // const [plots, setPlots] = useState([]);
  const [previousPlot, setPreviousPlot] = useState([]);
  const [plotData, setPlotData] = useState([]);
  const [expTitle, setExpTitle] = useState("");
  const [dataFound, setDataFound] = useState(true);
  const [plotted, setPlotted] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    console.log("**********************init Exp plot view");
    if (plotsInput) {
      setPreviousPlot(plotsInput);
      console.log("Set IsFetch = false");
      setIsFetched(false);
    } else {
      setPreviousPlot([]);
    }
  }, [plotsInput]);

  const layout = {
    xaxis: {
      range:
        globalPlotRange.x1 && globalPlotRange.x2
          ? [globalPlotRange.x1, globalPlotRange.x2]
          : "auto",
    },
    yaxis: {
      range:
        globalPlotRange.y1 && globalPlotRange.y2
          ? [globalPlotRange.y1, globalPlotRange.y2]
          : "auto",
    },
  };

  useEffect(() => {
    if (plotsInput.length > 0) {
      // console.log("plots", plotsInput);
      const colorArray = [
        "rgb(55,126,184)",
        "rgb(228,26,28)",
        "rgb(77,175,74)",
        "rgb(152,78,163)",
        "rgb(255,127,0)",
        "rgb(148,139,61)",
        "rgb(160,160,160)",
        "rgb(146,36,40)",
        "rgb(255,215,0)",
        "rgb(0,128,128)",
        "rgb(255,20,147)",
        "rgb(0,0,0)",
      ];
      const markerArray = [0, 1, 5, 2, 3, 4, 6, 7, 8, 9];
      const prcoessedData = plotsInput
        .map((item, index) => {
          const { id, sampleID, couponList, legend } = item;
          const couponArray = couponList.split("").map(Number);

          if (sampleID.length < 10) {
            return {};
          }

          const filteredData = _.filter(ltdataSet, (o) => {
            if (!o.key.startsWith(sampleID)) {
              return false;
            }

            if (couponList.length === 0) {
              return true;
            }
            return couponArray.some((coupon) => o.key.includes(`-${coupon}d`));
          });

          if (filteredData.length === 0) {
            return null; // Skip if no data found
          }

          const processedCouponData = processData(filteredData);

          return processedCouponData.map((couponInfo, couponIndex) => {
            const entry = filteredData.find((item) =>
              item.key.includes(`-${couponInfo.couponID}`)
            );
            const sampleID = entry.key;

            // Create a new sorted array instead of modifying the original
            const sortedData = [...entry.data].sort(
              (a, b) => new Date(a.SampleTime) - new Date(b.SampleTime)
            );
            // console.log(sortedData);

            const group = sortedData;
            const divisor = group[0].Luminance;
            const x = group.map((item) => item.TimeInHours);
            const y = group.map((item) => item.Luminance / divisor);

            return {
              x,
              y,
              type: "scatter",
              mode: "lines+markers",
              name: `${legend}_${sampleID}_LT ${group[0].ChargingCurrentDensity}J`,
              line: {
                color: colorArray[index % colorArray.length], // Use color based on plot index
              },
              marker: {
                symbol: markerArray[couponIndex % markerArray.length], // Use marker based on coupon index
              },
            };
          });
        })
        .flat(); // Flatten the array since map returns an array of arrays

      setPlotData(prcoessedData.filter((item) => item !== null));
      setDataFound(true);
      // console.log("setPlotData", prcoessedData)
    }
  }, [ltdataSet, plotsInput]);

  const handleTitleChange = (e) => {
    setExpTitle(e.target.value);
    onExpTitleChange(e.target.value);
  };

  const addLTData = useCallback(
    (id) => {
      dispatch(fetchLTData(id));
      // setPlotted(false);
    },
    [dispatch]
  );

  useEffect(() => {
    plotsInput.forEach((plot) => {
      const { sampleID } = plot;
      const isLtExists = ltdataSet.some((o) => {
        return o.key.startsWith(sampleID);
      });

      if (
        sampleID !== "" &&
        sampleID.length === 10 &&
        !isLtExists &&
        !isFetched
      ) {
        // Fetch LT data for the sampleID
        addLTData(sampleID);
      }

      setIsFetched(true);
    });
  }, [plotsInput, ltdataSet, addLTData, isFetched]);

  return (
    <div>
      <div className="flex flex-col w-full max-w-3xl items-center px-5 py-4 space-y-4">
        {/* Experiment Title Input */}
        <div className="w-full">
          <input
            type="text"
            placeholder="Experiment Title"
            className="input input-bordered input-sm w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-3xl"
            onChange={handleTitleChange}
            value={expTitle}
          />
        </div>

        {/* Plots Inputs */}
        {plotsInput.map((plot) => (
          <div key={plot.id} className="w-full">
            <div className="flex flex-row w-full items-center space-x-2">
              <div className="w-1/4">
                <input
                  type="text"
                  placeholder="Input Legend"
                  className="input input-bordered input-sm w-full"
                  onChange={(e) =>
                    onSampleIDChange(
                      plot.id,
                      plot.sampleID,
                      plot.couponList,
                      e.target.value
                    )
                  }
                  value={plot.legend}
                />
              </div>
              <div className="w-auto">:</div>
              <div className="w-1/4">
                <input
                  type="text"
                  placeholder="Input ID"
                  className="input input-bordered input-sm w-full"
                  onChange={(e) =>
                    onSampleIDChange(
                      plot.id,
                      e.target.value,
                      plot.couponList,
                      plot.legend
                    )
                  }
                  value={plot.sampleID}
                />
              </div>
              <div className="w-auto">-</div>
              <div className="w-1/4 flex-1">
                <input
                  type="text"
                  placeholder="Coupon List"
                  className="input input-sm input-bordered w-full"
                  onChange={(e) =>
                    onSampleIDChange(
                      plot.id,
                      plot.sampleID,
                      e.target.value,
                      plot.legend
                    )
                  }
                  value={plot.couponList}
                />
              </div>
              <button
                className="btn btn-outline btn-sm text-red-600 ml-2"
                onClick={() => removePlot(plot.id)}
              >
                x
              </button>
            </div>
          </div>
        ))}
      </div>

      {dataFound ? (
        <LtPlotView
          plotData={plotData}
          sampleID={expTitle}
          layout={layout}
          mode={"exp"}
        />
      ) : (
        <LtPlotView plotData={[]} sampleID={""} layout={layout} mode={"exp"} />
      )}
    </div>
  );
};

const LTSinglePlot = ({ sampleID_input, plotRange, onSampleIDChange }) => {
  // console.log("sampleID_input", sampleID_input);
  const globalPlotRange = plotRange;

  const ltdataStatus = useSelector((state) => state.ltdata.status);
  const ltdataSet = useSelector((state) => state.ltdata.data);
  const dispatch = useDispatch();

  const [sampleID, setSampleID] = useState("");
  const [couponList, setCouponList] = useState("");
  const [previousID, setPreviousID] = useState({});
  const [plotData, setPlotData] = useState([]);
  const [dataFound, setDataFound] = useState(true);
  const [plotted, setPlotted] = useState(false);

  // Parse the sampleID_input
  useEffect(() => {
    console.log("**********************init single plot view");
    if (sampleID_input) {
      setSampleID(sampleID_input.sampleID);
      setCouponList(sampleID_input.couponList);
      setPreviousID(sampleID_input);
    } else {
      setSampleID("");
      setCouponList("");
      setPreviousID("");
    }
  }, []);

  const addLTData = useCallback(() => {
    dispatch(fetchLTData(sampleID));
    setPlotted(false);
  }, [dispatch, sampleID]);

  useEffect(() => {
    const isLtExists = ltdataSet.some((o) => {
      return o.key.startsWith(sampleID);
    });

    if (sampleID !== "" && sampleID.length == 10 && !isLtExists) {
      addLTData();
    }
  }, [sampleID, addLTData]);

  const layout = {
    xaxis: {
      range:
        globalPlotRange.x1 && globalPlotRange.x2
          ? [globalPlotRange.x1, globalPlotRange.x2]
          : "auto",
    },
    yaxis: {
      range:
        globalPlotRange.y1 && globalPlotRange.y2
          ? [globalPlotRange.y1, globalPlotRange.y2]
          : "auto",
    },
  };

  useEffect(() => {
    if (sampleID !== "") {
      // const couponArray = couponList.split(',').map(coupon => coupon.trim());
      const couponArray = couponList.split("").map(Number);

      const filteredData = _.filter(ltdataSet, (o) => {
        if (!o.key.startsWith(sampleID)) {
          return false;
        }

        if (couponArray.length === 0) {
          return true;
        }

        return couponArray.some((coupon) => o.key.includes(`-${coupon}d`));
      });
      if (filteredData.length === 0) {
        setDataFound(false);
        return;
      } else {
        setDataFound(true);
      }

      const processedCouponData = processData(filteredData);

      // console.log(processedCouponData)

      const processedData = processedCouponData.map((couponInfo) => {
        // console.log("couponInfo",couponInfo)
        const entry = filteredData.find((item) =>
          item.key.includes(`-${couponInfo.couponID}d${couponInfo.pixelID}`)
        );
        // console.log(entry)
        const sampleID = entry.key;

        const sortedData = [...entry.data].sort(
          (a, b) => new Date(a.SampleTime) - new Date(b.SampleTime)
        );
        const group = sortedData;
        const divisor = group[0].Luminance;
        const x = group.map((item) => item.TimeInHours);
        const y = group.map((item) => item.Luminance / divisor);

        return {
          x,
          y,
          type: "scatter",
          mode: "lines+markers",
          name: `${sampleID}_LT ${group[0].ChargingCurrentDensity}J`,
          line: {
            color: ["rgb(55,126,184)", "rgb(228,26,28)", "rgb(77,175,74)"][
              Math.floor((Number(couponInfo.couponID) - 1) / 3)
            ],
          },
          marker: { symbol: [0, 1, 5][(Number(couponInfo.couponID) - 1) % 3] },
        };
      });

      setPlotData(processedData);
      setPlotted(true);
    }
  }, [ltdataSet, sampleID, couponList, plotted, plotRange]);

  useEffect(() => {
    // console.log("previousID", previousID);
    // console.log(dataFound)
    if (
      dataFound === true &&
      (sampleID !== previousID.sampleID || couponList !== previousID.couponList)
    ) {
      const safeSampleID = sampleID ?? ""; // Fallback to empty string if undefined or null
      const safeCouponList = couponList ?? ""; // Fallback to empty string if undefined or null
      // console.log("safeSampleID", safeSampleID);
      // console.log("safeCouponList", safeCouponList);
      onSampleIDChange(safeSampleID, safeCouponList, "");
      setPreviousID({
        sampleID: safeSampleID,
        couponList: safeCouponList,
        legend: "",
      });
    }
  }, [dataFound, sampleID, previousID, onSampleIDChange, couponList]);

  return (
    <div>
      <div className="flex flex-row w-full max-w-md py-5 items-center px-5">
        <div className="form-control pr-2">
          <input
            type="text"
            placeholder="Input id"
            className="input input-bordered input-sm w-full max-w-xs"
            onChange={(e) => {
              setSampleID(e.target.value);
            }}
            value={sampleID}
          />
        </div>
        <div className="form-control pr-2">-</div>
        <div className="form-control pr-2 flex-1">
          <input
            type="text"
            placeholder=""
            className="input input-sm input-bordered m w-full max-w-xs"
            onChange={(e) => {
              setCouponList(e.target.value);
            }}
            value={couponList}
          />
        </div>
        <button
          className={`btn btn-outline btn-sm ${
            ltdataStatus === "loading" ? "loading" : ""
          }`}
          onClick={addLTData}
        >
          Fetch
        </button>
      </div>
      {dataFound ? (
        <LtPlotView
          plotData={plotData}
          sampleID={sampleID}
          layout={layout}
          mode={"plate"}
        />
      ) : (
        <LtPlotView
          plotData={[]}
          sampleID={sampleID}
          layout={layout}
          mode={"plate"}
        />
      )}
    </div>
  );
};

function processData(data) {
  const result = [];
  const couponMap = new Map();

  data.forEach((item) => {
    const sampleID = item.key;
    const couponID = sampleID.charAt(11);
    const pixelID = sampleID.charAt(13);

    const latestSample = item.data.reduce((latest, current) => {
      return new Date(current.SampleTime) > new Date(latest.SampleTime)
        ? current
        : latest;
    });

    if (
      !couponMap.has(couponID) ||
      new Date(latestSample.SampleTime) >
        new Date(couponMap.get(couponID).SampleTime)
    ) {
      couponMap.set(couponID, { pixelID, SampleTime: latestSample.SampleTime });
    }
  });

  couponMap.forEach((value, key) => {
    result.push({ couponID: key, pixelID: value.pixelID });
  });

  return result;
}

const LtPlotView = ({ plotData, sampleID, layout, mode }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div>
      <Plot
        data={plotData}
        layout={{
          width: screenWidth > 1240 ? 1240 : screenWidth * 0.95,
          height: mode === "plate" ? 500 : 600,
          title: sampleID,
          xaxis: { title: "Time (Hours)", range: layout.xaxis.range },
          yaxis: { title: "Normalized Luminance", range: layout.yaxis.range },
          margin: { t: 50, r: 250 }, // Adjust this value as needed to reduce the distance
          modebar: {
            orientation: "v",
            remove: ["zoomin", "zoomout", "zoom", "lasso", "select"],
            add: ["drawline", "drawrect", "eraseshape"],
          },
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "500px" }}
      />
    </div>
  );
};
