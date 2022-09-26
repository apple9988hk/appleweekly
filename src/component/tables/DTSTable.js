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
        ...state,
        column: action.column,
        data: _.orderBy(state.data, [action.column], ["desc"]),
        direction: "desc",
      };
    case "Filter_MATERIAL": {
        const string = action.text;
        return {
          ...state,
          materialFilter: string,
        };
      }
  
    default:
      throw new Error();
  }
}

function SortableTable(props) {
  const { state, dispatch, titles } = props;
  const { column, data, direction } = state;

  // console.log(data)

  let newdata = data

  if (state.materialFilter !== "") {
    newdata = data.filter((d) => {
      return (
        (typeof d.DEP_MATERIAL === "string" &&
          d.DEP_MATERIAL.toLowerCase().includes(state.materialFilter.toLowerCase()))
      );
    });
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <table className="relative w-full border">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {titles.map((title) => (
                <th
                  scope="col"
                  className=" px-6 py-3 mx-auto text-xs font-medium text-gray-500 bg-gray-100 uppercase"
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
            {newdata.map(function (d, index) {
              return (
                <tr key={index}>
                  {titles.map(function (title, index) {
                    return (
                      <td
                        key={index}
                        className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center"
                      >
                        {d[title["name"]]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DTSTable(props) {
  const { id, topic, data, titles } = props.data;
  const [state, dispatch] = React.useReducer(exampleReducer, {
    column: null,
    data: JSON.parse(data),
    direction: null,
    materialFilter: "",
  });
  function handleInputChange (e) {
    console.log(e.target.value)
    dispatch({
      type: "Filter_MATERIAL",
      text:  e.target.value ,
    });
  }

  return (
    <div className="py-2">
      {/* <h1 className="font-bold text-2xl px-2 underline py-2 "> {topic}</h1> */}
      <div id="input" className="mx-2 my-2 max-w-lg">
        <input type="text" placeholder="Material Filter" className="input input-bordered input-sm px-4 py-3 w-full max-w-xs" onChange = {handleInputChange}/>
      </div>

      <SortableTable state={state} dispatch={dispatch} titles={titles} />
    </div>
  );
}

export default DTSTable;
