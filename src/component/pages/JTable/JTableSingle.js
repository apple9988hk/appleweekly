import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

function JTableSingle() {
    const watchList = useSelector((state) => state.jdata.watchList);
  return (
    <div>
        {
            watchList.map((item,index) => {
                return(
                    <div key={index} > {item} </div>
                )
            })
        }
    </div>
  )
}

export default JTableSingle