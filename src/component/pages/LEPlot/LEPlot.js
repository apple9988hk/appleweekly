import FetchJ, {FetchOJ} from "./FetchJ"
import FetchedJDisplay, {FetchedJDisplayOJ} from "../JTable/FetchedJDisplay"
import LEPLotChart, {LEPLotChartOJ} from "./LEPlotChart"

function LEplot() {
    return (
        <div className="max-w-7xl mx-auto px-5 pb-10">
            <div className ="font-bold text-3xl">
              LEPlot @10J
            </div>
            
            <FetchJ />
            <FetchedJDisplay/>
            <LEPLotChart />

            <div className ="font-bold text-3xl">
              LEPlot @ 15J
            </div>

            <FetchOJ/>
            <FetchedJDisplayOJ/>
            <LEPLotChartOJ />
            
            {/* <JTableCompare /> */}
          
        </div>
      )
}

export default LEplot