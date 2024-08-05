import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLTData } from "../../../features/ltdata/ltdataSlice";
import _, { filter } from "lodash";
import Plot from "react-plotly.js";
import { ChevronsDown, ChevronsUp, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { removeListener } from "@reduxjs/toolkit";

function LTPlotContainer() {
  const [plots, setPlots] = useState([]);
  console.log("plots", plots)
  const [x1, setX1] = useState("");
  const [x2, setX2] = useState("");
  const [y1, setY1] = useState("");
  const [y2, setY2] = useState("");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [batchPlotInput, setBatchPlotInput] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameters from the URL
  const plotlistParam = new URLSearchParams(location.search).get("plotlist");
  const x1Param = new URLSearchParams(location.search).get("x1");
  const x2Param = new URLSearchParams(location.search).get("x2");
  const y1Param = new URLSearchParams(location.search).get("y1");
  const y2Param = new URLSearchParams(location.search).get("y2");

  const nextId = useRef(0); // Ref to keep track of the next unique IDa

  const addPlot = (plotId) => {
    const newPlotId = nextId.current++;
    setPlots([...plots, { id: newPlotId, plotId: "" }]);
  };

  const removePlot = (id) => {
    setPlots(plots.filter((plot) => plot.id !== id));
  };

  const removeAllPlots = () => {
    setPlots([]);
    nextId.current = 0; // Reset the ID counter
  };

  useEffect(() => {
    console.log("plotlistParam" , plotlistParam)
    if (plotlistParam) {
      const plotIds = plotlistParam.split(",").map((id) => id.trim());
      setPlots(plotIds.map((plotId, index) => ({ id: index, plotId })));
      nextId.current = plotIds.length;
    } else {
      removeAllPlots()
      // setPlots([])
      // nextId.current = 0
    }

    if (x1Param) setX1(x1Param);
    if (x2Param) setX2(x2Param);
    if (y1Param) setY1(y1Param);
    if (y2Param) setY2(y2Param);
  }, [plotlistParam, x1Param, x2Param, y1Param, y2Param]);

  const updateURLParams = () => {
    const params = new URLSearchParams(location.search);
    params.set("plotlist", plots.map((plot) => plot.plotId).join(","));
    if (x1) params.set("x1", x1);
    if (x2) params.set("x2", x2);
    if (y1) params.set("y1", y1);
    if (y2) params.set("y2", y2);
    navigate({ search: params.toString() });
  };

  useEffect(() => {
    updateURLParams();
    // console.log(plots);
  }, [plots, x1, x2, y1, y2]);

  // Callback function to update plotId
  const updatePlotId = (id, newPlotId) => {
    // console.log("updatePlotId", id, newPlotId)
    setPlots((prevPlots) =>
      prevPlots.map((plot) =>
        plot.id === id ? { ...plot, plotId: newPlotId } : plot
      )
    );
  };

  const handleInputChange_batchPlot = (event) => {
    setBatchPlotInput(event.target.value);
  };

  const handleBatchPlotSubmit = (e) => {
    e.preventDefault();
    handleBatchPlotButton()
  }

  const handleBatchPlotButton = () => {
    const trimmedInput = batchPlotInput.trim();
    console.log(batchPlotInput)
    const regex = /^(.{9})(.+)$/; // Base is the first 9 characters, suffix is the rest
    const match = trimmedInput.match(regex);

    if (match) {
      const base = match[1];
      const suffix = match[2];

      const newPlots = [...plots];

      for (const char of suffix) {
        const newPlotId = `${base}${char}`;
        if (!newPlots.some((plot) => plot.plotId === newPlotId)) {
          newPlots.push({ id: nextId.current++, plotId: newPlotId });
        }
      }
      setPlots(newPlots);
    }
  };

  return (
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
            onClick={() => removeAllPlots}
          >
            Remove All
          </button>
          <button onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
            {showAdvancedOptions ? (
              <ChevronsUp className="w-4 h-4" />
            ) : (
              <ChevronsDown className="w-4 h-4" />
            )}
          </button>
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

      {plots.map(({ id, plotId }) => (
        <div key={id} style={{ position: "relative", marginBottom: "10px" }}>
          <LTSinglePlot
            sampleID_input={plotId}
            plotRange={{ x1, x2, y1, y2 }}
            onSampleIDChange={(newSampleID) => updatePlotId(id, newSampleID)}
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
  );
}

export default LTPlotContainer;

const LTSinglePlot = ({ sampleID_input, plotRange, onSampleIDChange }) => {
  const globalPlotRange = plotRange;
  const ltdataStatus = useSelector((state) => state.ltdata.status);
  const ltdataSet = useSelector((state) => state.ltdata.data);
  const [sampleID, setSampleID] = useState(sampleID_input);
  const [plotData, setPlotData] = useState([]);
  const [dataFound, setDataFound] = useState(true);
  const [plotted, setPlotted] = useState(false);
  const dispatch = useDispatch();

  const addLTData = useCallback(() => {
    dispatch(fetchLTData(sampleID));
    setPlotted(false);
  }, [dispatch, sampleID]);

  // Use useEffect to fetch data on mount and when sampleID changes
  useEffect(() => {
    if (sampleID !== "" && sampleID.length >= 10) {
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
    // console.log("process and plot")
    if (sampleID !== "") {
      const filteredData = _.filter(ltdataSet, (o) => {
        return (
          o.key === sampleID ||
          o.data.some((item) => item.SampleID.slice(0, 10) === sampleID)
        );
      });

      if (filteredData.length === 0) {
        setDataFound(false);
        return;
      } else {
        setDataFound(true);
        // onSampleIDChange(sampleID);
      }

      const processedCouponData = processData(filteredData);

      const processedData = processedCouponData.map((couponInfo) => {
        const entry = filteredData.find(
          (item) => item.key.charAt(11) === couponInfo.couponID
        );
        const sampleID = entry.key;
        const group = entry.data;
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

      // console.log("processedData",processedData)
      setPlotData(processedData);
      setPlotted(true);
    }
  }, [ltdataSet, sampleID, plotted, plotRange]);

  useEffect(() => {
    if (dataFound === true) {
      // console.log("update sampleID", sampleID)
      onSampleIDChange(sampleID);
    }
  }, [dataFound]);
  // console.log("plotData", plotData);

  return (
    <div>
      <div className="flex flex-row w-full max-w-xs py-5 items-center px-5">
        <div className="form-control pr-2">
          <input
            type="text"
            placeholder="Input id"
            className="input input-bordered input-sm w-full max-w-xs"
            onChange={(e) => {
              setSampleID(e.target.value);
              // onSampleIDChange(e.target.value);
            }}
            value={sampleID}
          />
        </div>
        <button
          className={`btn btn-outline btn-sm ${
            ltdataStatus === "loading" ? "loading" : ""
          }`}
          onClick={addLTData}
        >
          {" "}
          Fetch{" "}
        </button>
      </div>
      {dataFound ? (
        <LtPlotView plotData={plotData} sampleID={sampleID} layout={layout} />
      ) : (
        <LtPlotView plotData={[]} sampleID={sampleID} layout={layout} />
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

const LtPlotView = ({ plotData, sampleID, layout }) => {
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
          height: 500,
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
