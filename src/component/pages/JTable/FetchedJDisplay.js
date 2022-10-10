import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addtoWatchList } from "../../../features/jdata/jdataSlice";


function FetchedJDisplay() {
const jdataset = useSelector((state) => state.jdata.data);

console.log("jdataset")
console.log(jdataset)

  return (
    <div>
        <SortableTable data ={jdataset} />
      {/* {jdataset.map((item, index) => {
        return <p key={item.id}>{item.keywords}</p>;
      })} */}
    
    </div>
  )
}


function SortableTable(props) {
    const { data } = props;
    const dispatch = useDispatch();
  
    return (
      <div className="flex flex-col">
        {/* <div> 
        <button onClick={() => dispatch(addtoWatchList(1))} > 1 </button> <br/>
        <button onClick={() => dispatch(addtoWatchList(2))} > 2 </button> <br/>
        <button onClick={() => dispatch(addtoWatchList(3))} > 3 </button>
        </div> */}
        <div className="flex-grow overflow-auto">
          <table className="relative w-full border">
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map(function (d, index) {
                return (
                  <tr key={index} onClick={() => dispatch(addtoWatchList(d['id'])) } >
                    <td
                        className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center"
                    >
                        {d['id']}
                    </td>
                    <td
                        className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center"
                    >
                        {d['keywords']}
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

export default FetchedJDisplay

