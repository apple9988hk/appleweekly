import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addtoWatchList } from "../../../features/ltdata/ltdataSlice";

function FetchLTDisplay() {
    const ltdataset = useSelector((state) => state.ltdata.data);
    const idList = useSelector((state) => state.ltdata.idList);

    console.log("first")
    
    // const [idList, setIdList] = useState([]);
  
    // const idList = [
    //   ...new Set(jdataset.map(({ SampleID }) => SampleID.slice(0, 10))),
    // ];
  
    // console.log("jdataset");
    console.log(idList)
    console.log(ltdataset);
  
    return (
      <div>
        <SortableTable data={idList} />
      </div>
    );
}


function SortableTable(props) {
    const { data } = props;
    const dispatch = useDispatch();
    function handleClick(id) {
      dispatch(addtoWatchList(id));
    }
  
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
                    onClick={() => handleClick(d['id'])}
                  >
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                      {d['id']}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-left">
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
  

export default FetchLTDisplay