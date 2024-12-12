import FetchJ, { FetchOJ } from "./FetchJ";
import FetchedJDisplay, { FetchedJDisplayOJ } from "../JTable/FetchedJDisplay";
import LEPLotChart, { LEPLotChartOJ } from "./LEPlotChart";
import { useState } from "react";

function LEplot() {
  const [cd, setCd] = useState(15);
  return (
    <div className="max-w-7xl mx-auto px-5 pb-10">
      <div className="font-bold text-3xl">LEPlot @10J</div>

      <FetchJ />
      <FetchedJDisplay />
      <LEPLotChart />

      <div className="font-bold text-3xl">LEPlot @ {cd}J</div>

      <FetchOJ cd={cd} setCd={setCd} />
      <FetchedJDisplayOJ />
      <LEPLotChartOJ cd={cd} />

      {/* <JTableCompare /> */}
    </div>
  );
}

export default LEplot;
