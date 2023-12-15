import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSData } from "../../../features/sdata/sdataSlice";
import _ from "lodash";

export default function FetchJ() {
  // const jdataset = useSelector((state) => selectRSById(state, stockId));
  const sdataStatus = useSelector((state) => state.sdata.status);
  const idList = useSelector((state) => state.sdata.idList);

  const dispatch = useDispatch();
  const [fetchId, setFetchId] = useState("");

  const addSData = () => {
    console.log()
    if (fetchId.length !== 10) {
      console.log("Invalid Id")
    } else {
      if (_.find(idList, { 'id': fetchId }) === undefined){
        dispatch(fetchSData(fetchId));
      } else {
        console.log("Id feteched")
      }
    }
  };

  return (
    <div className="flex flex-row w-full max-w-xs py-5 items-center px-5">
      <div className="form-control pr-2">
        <input
          type="text"
          placeholder="Input id"
          className="input input-bordered input-sm w-full max-w-xs"
          onChange={(e) => setFetchId(e.target.value)}
        />
      </div>
      <button className = {`btn btn-outline btn-sm ${sdataStatus === 'loading' ? "loading" : ''}`}  onClick={addSData} > Fetch </button>
    </div>
  );
}
