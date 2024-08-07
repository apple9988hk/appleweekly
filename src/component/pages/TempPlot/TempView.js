import React from 'react'
import TempPlotContainer from "./TempPlotContainer";

function TempView() {
  return (
    <div className="max-w-7xl mx-auto px-0 md:px-5">
      {/* <div className="font-bold text-2xl">
          Temp View
      </div> */}
      <TempPlotContainer />
    </div>
  )
}

export default TempView