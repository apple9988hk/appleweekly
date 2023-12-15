import FetchS from "./FetchS"
import FetchSDisplay from "./FetchSDisplay"
// import SPlotSingle from "./SPlotSingle"
import SPlotMulti from "./SPlotMulti"

function SData() {
  return (
    <div className="max-w-7xl mx-auto px-5">
        <div className ="font-bold text-3xl">
          SData
        </div>
        
        <FetchS />
        <FetchSDisplay />
        {/* <SPlotSingle /> */}
        <SPlotMulti />
      
    </div>
  )
}

export default SData