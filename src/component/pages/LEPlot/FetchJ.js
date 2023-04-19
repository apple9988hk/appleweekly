import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchJData } from "../../../features/jdata/jdataSlice";

export default function FetchJ() {
  // const jdataset = useSelector((state) => selectRSById(state, stockId));
  const jdataStatus = useSelector((state) => state.jdata.status);

  const dispatch = useDispatch();
  const [fetchId, setFetchId] = useState("");

  const addJData = () => {
    let idList = fetchId.split(",");
    idList.forEach((d) => {
      if (d.length !== 10) {
        console.log("Invalid Id");
      } else {
        dispatch(fetchJData(d));
      }
    });
  };

  return (
    <div className="flex flex-row w-full max-w-lg py-5 items-center px-5">
      <div className="form-control pr-2 w-full">
        <input
          type="text"
          placeholder="Input id"
          className="input input-bordered input-sm w-full max-w-2xl"
          onChange={(e) => setFetchId(e.target.value)}
        />
      </div>
      <button
        className={`btn btn-outline btn-sm ${
          jdataStatus === "loading" ? "loading" : ""
        }`}
        onClick={addJData}
      >
        {" "}
        Fetch{" "}
      </button>
    </div>
  );
}
