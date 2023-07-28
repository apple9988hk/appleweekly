import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchJData } from "../../../features/jdata/jdataSlice";
import { fetchOJData } from "../../../features/ojdata/ojdataSlice";

export default function FetchJ() {
  // const jdataset = useSelector((state) => selectRSById(state, stockId));
  const jdataStatus = useSelector((state) => state.jdata.status);

  const dispatch = useDispatch();
  const [fetchId, setFetchId] = useState("");

  const addJData = () => {
    let idList = fetchId.split(",");
    idList.forEach((d) => {
      console.log(d);
      if (d.trim().length !== 10) {
        console.log("Invalid Id");
      } else {
        dispatch(fetchJData(d.trim()));
      }
    });
  };

  return (
    <div>
      <div className="flex flex-row w-full max-w-lg py-5 items-start px-5">
        <div className="form-control pr-2 w-full">
          <input
            type="text"
            placeholder="Input id"
            className="input input-bordered input-sm w-full max-w-2xl"
            onChange={(e) => setFetchId(e.target.value)}
          />
          <span className="label-text-alt px-1">
            Ex: H-041123-1,H-041123-2,H-041123-3{" "}
          </span>
        </div>
        <button
          className={`btn btn-outline btn-sm ${
            jdataStatus === "loading" ? "loading" : ""
          } py pt-0`}
          onClick={addJData}
        >
          {" "}
          Fetch{" "}
        </button>
      </div>
    </div>
  );
}

function FetchOJ() {
  // const jdataset = useSelector((state) => selectRSById(state, stockId));
  const ojstatus = useSelector((state) => state.ojdata.status);

  const dispatch = useDispatch();
  const [fetchId, setFetchId] = useState("");

  const addJData = () => {
    let idList = fetchId.split(",");
    idList.forEach((d) => {
      console.log(d);
      if (d.trim().length !== 10) {
        console.log("Invalid Id");
      } else {
        dispatch(fetchOJData(d.trim()));
      }
    });
  };

  return (
    <div>
      <div className="flex flex-row w-full max-w-lg py-5 items-start px-5">
        <div className="form-control pr-2 w-full">
          <input
            type="text"
            placeholder="Input id"
            className="input input-bordered input-sm w-full max-w-2xl"
            onChange={(e) => setFetchId(e.target.value)}
          />
          <span className="label-text-alt px-1">
            Ex: H-072523-Y,H-072623-X{" "}
          </span>
        </div>
        <button
          className={`btn btn-outline btn-sm ${
            ojstatus === "loading" ? "loading" : ""
          } py pt-0`}
          onClick={addJData}
        >
          {" "}
          Fetch{" "}
        </button>
      </div>
    </div>
  );
}

export { FetchOJ };
