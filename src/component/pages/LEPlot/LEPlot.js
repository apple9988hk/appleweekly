import FetchJ from "./FetchJ"
import FetchedJDisplay from "../JTable/FetchedJDisplay"
import LEPLotChart from "./LEPlotChart"

function LEplot() {
    return (
        <div className="max-w-7xl mx-auto px-5">
            <div className ="font-bold text-3xl">
              LEPlot
            </div>
            
            <FetchJ />
            <FetchedJDisplay />
            <LEPLotChart />
            
            {/* <JTableCompare /> */}
          
        </div>
      )
}

export default LEplot