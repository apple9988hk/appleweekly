import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLTData } from "../../../features/ltdata/ltdataSlice";
import _ from "lodash";
import Plot from "react-plotly.js";


function FetchLT() {
  const ltdataStatus = useSelector((state) => state.ltdata.status);

  const dispatch = useDispatch();
  const [fetchId, setFetchId] = useState("H-072224-2");

  const [plotData, setPlotData] = useState([]);

  const addLTData = () => {
    dispatch(fetchLTData(fetchId));
  };
  return (
    <div>
      <div className="flex flex-row w-full max-w-xs py-5 items-center px-5">
        H-072224-2
        <div className="form-control pr-2">
          <input
            type="text"
            placeholder="Input id"
            className="input input-bordered input-sm w-full max-w-xs"
            onChange={(e) => setFetchId(e.target.value)}
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
    </div>
  );
}

export default FetchLT;

