import _ from "lodash";
import React from "react";
import {
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

const people = [
  {
    "name": "Jane Cooper",
    "title": "Regional Paradigm Technician",
    "department": "Optimization",
    "role": 2,
    "email": "jane.cooper@example.com",
    "image": "https://bit.ly/33HnjK0",
  },
  {
    "name": "John Doe",
    "title": "Regional Paradigm Technician",
    "department": "Optimization",
    "role": 1,
    "email": "john.doe@example.com",
    "image": "https://bit.ly/3I9nL2D",
  },
  {
    "name": "Veronica Lodge",
    "title": "Regional Paradigm Technician",
    "department": "Optimization",
    "role": 3,
    "email": "veronica.lodge@example.com",
    "image": "https://bit.ly/3vaOTe1",
  },
  // More people...
];

function exampleReducer(state, action) {
  switch (action.type) {
    case "CHANGE_SORT":
      if (state.column === action.column) {
        return {
          ...state,
          data: _.orderBy( state.data, [action.column], [state.direction === "ascending" ? "desc" : "asc"] ),
          direction:
            state.direction === "ascending" ? "descending" : "ascending",
        };
      }
      return {
        column: action.column,
        data: _.orderBy( state.data, [action.column], ["desc"] ),
        direction: "ascending",
      };
    default:
      throw new Error();
  }
}

function SortableTable(props) {
  const { state, dispatch } = props;
  const { column, data, direction } = state;
  const titles = [
    { name: "name", header: "NAME" },
    { name: "title", header: "TITLE" },
    { name: "status", header: "STATUS" },
    { name: "role", header: "ROLE" },
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      onClick={() =>
                        dispatch({ type: "CHANGE_SORT", column: title.name })
                      }
                      key={title.name}
                    >
                      <div class="flex items-center">
                        {title.header}
                        {column === title.name ? (
                          direction === "ascending" ? (
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
                {data.map((person) => (
                  <tr key={person.email}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={person.image}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {person.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {person.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {person.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {person.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 inline-flex text-xs leading-5
                    font-semibold rounded-full bg-green-100 text-green-800"
                      >
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.role}
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

function ExampleTable() {
  const [state, dispatch] = React.useReducer(exampleReducer, {
    column: null,
    data: people,
    direction: null,
  });
  console.log(state.data)
  return <SortableTable state={state} dispatch={dispatch} />;
}

export default ExampleTable;
