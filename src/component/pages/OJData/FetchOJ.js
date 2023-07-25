import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOJData } from "../../../features/ojdata/ojdataSlice";


export default function FetchJMultiJ() {
  // const jdataset = useSelector((state) => selectRSById(state, stockId));
  const ojstatus = useSelector((state) => state.ojdata.status);

  const dispatch = useDispatch();
  const [fetchId, setFetchId] = useState("");

  const addData = () => {
    if (fetchId.length !== 10) {
      console.log("Invalid Id")
    } else {
      dispatch(fetchOJData(fetchId));
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
      <button className = {`btn btn-outline btn-sm ${ojstatus === 'loading' ? "loading" : ''}`}  onClick={addData} > Fetch </button>
    </div>
  );
}
