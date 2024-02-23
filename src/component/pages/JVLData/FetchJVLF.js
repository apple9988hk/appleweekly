import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchJVLF } from "../../../features/jvlfdata/jvlfdataSlice";
import { fetchJData } from "../../../features/jdata/jdataSlice";

export default function FetchJVLF() {
  const jvlfdataStatus = useSelector((state) => state.jvlfdata.status);

  const dispatch = useDispatch();
  const [fetchId, setFetchId] = useState("");

  const addjvlfData = () => {
    if (fetchId.length !== 10) {
      console.log("Invalid Id");
    } else {
      dispatch(fetchJVLF(fetchId));
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
      <button
        className={`btn btn-outline btn-sm ${
          jvlfdataStatus === "loading" ? "loading" : ""
        }`}
        onClick={addjvlfData}
      >
        {" "}
        Fetch{" "}
      </button>
    </div>
  );
}
