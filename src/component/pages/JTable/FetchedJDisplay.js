import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addtoWatchList,
  move_id_up,
  move_id_down,
} from "../../../features/jdata/jdataSlice";
import {
  addtoWatchList as addtoWatchListoj,
  move_id_up as move_id_up_oj,
  move_id_down as move_id_down_oj,
} from "../../../features/ojdata/ojdataSlice";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

function FetchedJDisplay() {
  const jdataset = useSelector((state) => state.jdata.data);
  const idList = useSelector((state) => state.jdata.idList);

  console.log("jdataset");
  console.log(idList);
  console.log(jdataset);

  return (
    <div>
      <SortableTable data={idList} isMultiJ={false} move_id_down={move_id_down} move_id_up={move_id_up}/>
    </div>
  );
}

function FetchedJDisplayOJ() {
  const ojdataset = useSelector((state) => state.ojdata.data);
  const idList = useSelector((state) => state.ojdata.idList);

  console.log("ojdataset");
  console.log(idList);
  console.log(ojdataset);

  return (
    <div>
      <SortableTable data={idList} isMultiJ={true} move_id_down={move_id_down_oj} move_id_up={move_id_up_oj}/>
    </div>
  );
}

function SortableTable(props) {
  const { data, isMultiJ, move_id_up, move_id_down } = props;
  const dispatch = useDispatch();
  const handleMoveUp = (elementName) => {
    dispatch(move_id_up(elementName));
  };
  const handleMoveDown = (elementName) => {
    dispatch(move_id_down(elementName));
  };

  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-auto">
        Fetched Plate Data
        <table className="relative w-full border">
          {isMultiJ ? (
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map(function (d, index) {
                return (
                  <tr
                    key={index}
                    onClick={() => dispatch(addtoWatchListoj(d["id"]))}
                  >
                    <td className="flex justify-around items-center py-2 px-4 whitespace-nowrap text-sm text-gray-500 text-center w-max">
                      <span className="px-2">{d["id"]} </span>
                      <button
                        className="btn btn-xs btn-circle"
                        onClick={() => handleMoveUp(d["id"])}
                      >
                        <ChevronUpIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="btn btn-xs btn-circle"
                        onClick={() => handleMoveDown(d["id"])}
                      >
                        <ChevronDownIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map(function (d, index) {
                return (
                  <tr
                    key={index}
                    onClick={() => dispatch(addtoWatchList(d["id"]))}
                  >
                    <td className="flex justify-around items-center py-2 px-4 whitespace-nowrap text-sm text-gray-500 text-center w-max">
                      <span className="px-2">{d["id"]} </span>
                      <button
                        className="btn btn-xs btn-circle"
                        onClick={() => handleMoveUp(d["id"])}
                      >
                        <ChevronUpIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="btn btn-xs btn-circle"
                        onClick={() => handleMoveDown(d["id"])}
                      >
                        <ChevronDownIcon className="h-4 w-4" />
                      </button>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                      {d["keywords"]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}

export default FetchedJDisplay;
export { FetchedJDisplayOJ };
