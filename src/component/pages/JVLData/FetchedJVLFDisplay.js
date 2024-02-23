import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addtoWatchList } from "../../../features/jvlfdata/jvlfdataSlice";

function FetchedJVLFDisplay() {
  const jvlfdataset = useSelector((state) => state.jvlfdata.data);
  const idList = useSelector((state) => state.jvlfdata.idList);

  // console.log("jvlfdataset");
  // console.log(idList)
  // console.log(jvlfdataset);

  return (
    <div>
      <SortableTable data={idList} />
    </div>
  );
}

function SortableTable(props) {
  const { data } = props;
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-auto">
        Fetched Plate Data
        <table className="relative w-full border">
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map(function (d, index) {
              return (
                <tr
                  key={index}
                  onClick={() => dispatch(addtoWatchList(d['id']))}
                >
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                    {d['id']}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                    {d["keywords"]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FetchedJVLFDisplay;
