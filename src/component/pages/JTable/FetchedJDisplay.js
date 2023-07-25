import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addtoWatchList } from "../../../features/jdata/jdataSlice";
import { addtoWatchList as addtoWatchListoj } from "../../../features/ojdata/ojdataSlice";

function FetchedJDisplay() {
  const jdataset = useSelector((state) => state.jdata.data);
  const idList = useSelector((state) => state.jdata.idList);

  console.log("jdataset");
  console.log(idList);
  console.log(jdataset);

  return (
    <div>
      <SortableTable data={idList} isMultiJ={false} />
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
      <SortableTable data={idList} isMultiJ={true} />
    </div>
  );
}

function SortableTable(props) {
  const { data, isMultiJ } = props;
  const dispatch = useDispatch();

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
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                      {d["id"]}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                      {d["keywords"]}
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
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                      {d["id"]}
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
