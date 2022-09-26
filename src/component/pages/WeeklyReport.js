import PlatePerWeek from "../charts/PlatePerWeek";
import SelectedDopantPlot from "../charts/SelectedDopantPlot";
// import ExampleTable from "../tables/ExampleTable";
import SensorNoiseTable from "../tables/SensorNoiseTable";
import DTSTable from "../tables/DTSTable";
import _ from "lodash";
import React, { useState } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

function WeeklyReport(props) {
  const { data } = props;

  const displayIndex = ["NOPPW", "SDP", "DTS", "R30DSNS"];

  const [selected, setSelected] = useState(["NOPPW"]);
  const isSelected = (name) => selected.indexOf(name) !== -1;
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const DisplayContainer = (d) => {
    switch (d.id) {
      case "NOPPW":
        return <PlatePerWeek data={d} />;
      case "SDP":
        return <SelectedDopantPlot data={d} />;
      case "R30DSNS":
        return <SensorNoiseTable data={d} />;
      case "DTS":
        return <DTSTable data={d} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {displayIndex.map(function (display, index) {
        const d = _.filter(data, { id: display });
        const isItemSelected = isSelected(d[0].id);
        return (
          <div key={display}>
            {d.length > 0 ? (
              <div>
                <div className="flex flex-row justify-between items-center"  onClick={(event) => handleClick(event, d[0].id)}>
                  <h1 className="font-bold text-2xl px-2 underline py-2 ">
                    {" "}
                    {d[0].topic}
                  </h1>
                  <div >
                  {isItemSelected ? <PlusIcon className="h-7 px-5" /> : <MinusIcon className="h-7 px-5" />}
                  </div>
                </div>
                  { isItemSelected ?  DisplayContainer(d[0]) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default WeeklyReport;
