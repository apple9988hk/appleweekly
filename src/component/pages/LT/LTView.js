import FetchLT from "./FetchLT"
import FetchLTDisplay from "./FetchLTDisplay"
import LTPlotSingle from "./LTPlotSingle"

function LTView() {
  return (
    <div className="max-w-7xl mx-auto px-5">
        <div className ="font-bold text-3xl">
          LT View
        </div>
        
        <FetchLT />
        <FetchLTDisplay />
        <LTPlotSingle />
      
    </div>
  )
}

export default LTView


// import FetchS from "./FetchS"
// import FetchSDisplay from "./FetchSDisplay"
// import SPlotSingle from "./SPlotSingle"
