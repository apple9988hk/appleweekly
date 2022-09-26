import _ from "lodash";
import React from "react";
import {
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

function exampleReducer(state, action) {
  switch (action.type) {
    case "CHANGE_SORT":
      if (state.column === action.column) {
        return {
          ...state,
          data: _.orderBy(
            state.data,
            [action.column],
            [state.direction === "asc" ? "desc" : "asc"]
          ),
          direction: state.direction === "asc" ? "desc" : "asc",
        };
      }
      return {
        column: action.column,
        data: _.orderBy(state.data, [action.column], ["desc"]),
        direction: "desc",
      };
    default:
      throw new Error();
  }
}

function SortableTable(props) {
  const { state, dispatch } = props;
  const { column, data, direction } = state;

  const titles = [
    { name: "Chamber", header: "Chamber" },
    { name: "sensor", header: "Sensor" },
    { name: "meanOfDepRateRMSPct", header: "Mean RMS error(%)" },
    { name: "spikeNoiseExistPct", header: "Existence of spike noise(%)" },
    { name: "nData", header: "# of Data" },
  ];
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {titles.map((title) => (
                    <th
                      scope="col"
                      className="px-6 py-3 mx-auto text-xs font-medium text-gray-500 uppercase tracking-wider"
                      onClick={() =>
                        dispatch({ type: "CHANGE_SORT", column: title.name })
                      }
                      key={title.name}
                    >
                      <div className="flex items-center justify-center">
                        {title.header}
                        {column === title.name ? (
                          direction === "asc" ? (
                            <ChevronUpIcon className="ml-1 w-5 h-5" />
                          ) : (
                            <ChevronDownIcon className="ml-1 w-5 h-5" />
                          )
                        ) : (
                          <ChevronUpDownIcon className="ml-1 w-5 h-5" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((data) => (
                  <tr key={data.Chamber + "_" + data.sensor}>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                      {data.Chamber}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                      {data.sensor}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                      {data.meanOfDepRateRMSPct}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                      {data.spikeNoiseExistPct}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                      {data.nData}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function SensorNoiseTable(props) {
  const {id, topic, data} = props.data
  const [state, dispatch] = React.useReducer(exampleReducer, {
    column: null,
    data: JSON.parse(data),
    direction: null,
  });
  // console.log(state);
  return (
    <div className = "py-2">
      {/* <h1 className="font-bold text-2xl px-2 underline py-2 "> {topic}</h1> */}
      <SortableTable state={state} dispatch={dispatch} />
    </div>
  );
}

export default SensorNoiseTable;
