import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addtoWatchList } from "../../../features/ojdata/ojdataSlice";

function FetchedOJDisplay() {
  const ojdataset = useSelector((state) => state.ojdata.data);
  const idList = useSelector((state) => state.ojdata.idList);
  // const [idList, setIdList] = useState([]);

  // const idList = [
  //   ...new Set(jdataset.map(({ SampleID }) => SampleID.slice(0, 10))),
  // ];

  console.log("ojdataset");
  console.log(idList)
  console.log(ojdataset);

  return (
    <div>
      <SortableTable data={idList} />
      {/* {jdataset.map((item, index) => {
        return <p key={item.id}>{item.keywords}</p>;
      })} */}
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

export default FetchedOJDisplay;
