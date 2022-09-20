import PlatePerWeek from "../charts/PlatePerWeek";
import SelectedDopantPlot from "../charts/SelectedDopantPlot";
// import ExampleTable from "../tables/ExampleTable";
import SensorNoiseTable from "../tables/SensorNoiseTable"
import DTSTable from "../tables/DTSTable"
import _ from "lodash";


function WeeklyReport(props) {
  const {data} = props
  const NOPPW = _.filter(data, {"id" : "NOPPW"})
  const SDP = _.filter(data, {"id" : "SDP"})
  const DTS = _.filter(data, {"id" : "DTS"})
  const R30DSNS = _.filter(data, {"id": "R30DSNS"})
  return (
    <div>
      { NOPPW.length > 0 ? <PlatePerWeek data={NOPPW[0]}/> : null}
      { SDP.length > 0 ? <SelectedDopantPlot data={SDP[0]}/> : null}
      { R30DSNS.length > 0 ? <SensorNoiseTable data={R30DSNS[0]}/> : null}
      { DTS.length > 0 ? <DTSTable data={DTS[0]}/> : null}
    </div>
  )
}

export default WeeklyReport

