import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLTData } from "../../../features/ltdata/ltdataSlice";
import _ from "lodash";
import Plot from "react-plotly.js";
import { ChevronsDown } from "lucide-react";

function LTPlotContainer() {
  const [plots, setPlots] = useState([]);
  const [x1, setX1] = useState("");
  const [x2, setX2] = useState("");
  const [y1, setY1] = useState("");
  const [y2, setY2] = useState("");
  const nextId = useRef(0); // Ref to keep track of the next unique ID

  const addPlot = () => {
    setPlots([...plots, nextId.current++]); // Add a new plot with a unique ID
  };

  const removePlot = (id) => {
    setPlots(plots.filter((plotId) => plotId !== id)); // Remove the plot with the given ID
  };

  const addPlotFromButton = () => {
    addPlot(); // Reuse the addPlot function to add a new plot
  };

  return (
    <div className="pt-5  pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm" onClick={addPlot}>
            Add Plot
          </button>
          <button>
            <ChevronsDown className="w-4 h-4" />
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

      {plots.map((plotId) => (
        <div
          key={plotId}
          style={{ position: "relative", marginBottom: "10px" }}
        >
          <LTSinglePlot sampleID_input="" plotRange={{ x1, x2, y1, y2 }} />
          <button
            onClick={() => removePlot(plotId)}
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
          onClick={addPlotFromButton}
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

const LTSinglePlot = ({ sampleID_input, plotRange }) => {
  const globalPlotRange = plotRange
  const ltdataStatus = useSelector((state) => state.ltdata.status);
  const ltdataSet = useSelector((state) => state.ltdata.data);

  const [sampleID, setSampleID] = useState(sampleID_input);
  const [plotData, setPlotData] = useState([]);
  const [dataFound, setDataFound] = useState(true);
  const [plotted, setPlotted] = useState(false);

  const dispatch = useDispatch();

  const addLTData = () => {
    dispatch(fetchLTData(sampleID));
    // console.log("setPlot as False")
    setPlotted(false);
  };

  const layout = {
    xaxis: {
      range: globalPlotRange.x1 && globalPlotRange.x2 ? [globalPlotRange.x1, globalPlotRange.x2] : 'auto'
    },
    yaxis: {
      range: globalPlotRange.y1 && globalPlotRange.y2 ? [globalPlotRange.y1, globalPlotRange.y2] : 'auto'
    }
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
      }

      const processedData = filteredData.map((entry, index) => {
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
              Math.floor(index / 3)
            ],
          },
          marker: { symbol: [0, 1, 5][index % 3] },
          displayModeBar: true,
        };
      });
      // console.log("processedData",processedData)
      setPlotData(processedData);
      setPlotted(true);
    }
  }, [ltdataSet, sampleID, plotted, plotRange]);

  // console.log("plotData", plotData);

  return (
    <div>
      <div className="flex flex-row w-full max-w-xs py-5 items-center px-5">
        <div className="form-control pr-2">
          <input
            type="text"
            placeholder="Input id"
            className="input input-bordered input-sm w-full max-w-xs"
            onChange={(e) => setSampleID(e.target.value)}
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
        <LtPlotView plotData={plotData} sampleID={sampleID} layout={layout}/>
      ) : (
        <LtPlotView plotData={[]} sampleID={sampleID} layout={layout}/>
      )}
    </div>
  );
};

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
          width: screenWidth > 1240 ? 1240 : screenWidth,
          height: 500,
          title: sampleID,
          xaxis: { title: "Time (Hours)", range: layout.xaxis.range},
          yaxis: { title: "Normalized Luminance", range: layout.yaxis.range },
          margin: { t: 30 }, // Adjust this value as needed to reduce the distance
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "500px" }}
      />
    </div>
  );
};
