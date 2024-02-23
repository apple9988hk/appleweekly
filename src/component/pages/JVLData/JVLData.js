import FetchJVLF from "./FetchJVLF"
import FetchedJVLFDisplay from "./FetchedJVLFDisplay"
import JVLFNitTable from "./JVLFNitTable"
// import LEPLotChart, {LEPLotChartOJ} from "./LEPlotChart"

function LEplot() {
    return (
        <div className="max-w-7xl mx-auto px-5 pb-10">
            <div className ="font-bold text-3xl">
              JVLData Cal
            </div>

            <FetchJVLF/>
            <FetchedJVLFDisplay/>
            <JVLFNitTable />
          
        </div>
      )
}

export default LEplot