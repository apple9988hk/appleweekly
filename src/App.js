// import Header from "./component/Header"
import React, { useState, useReducer } from "react";
import WeeklyReport from "./component/pages/WeeklyReport";

const initialState = {
  data: [],
};

function importedDataReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_MESSAGE": {
      return {
        ...state,
        data: action.state,
      };
    }
    default: {
      return state;
    }
  }
}

function ImportData(props) {
  const { state, dispatch } = props;
  let fileReader;

  const handleFileRead = (e) => {
    const content = fileReader.result;
    const content2 = JSON.parse(content);
    // console.log(content2)
    dispatch({
      type: "ADD_MESSAGE",
      state: content2,
    });
  };

  const handleFileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  return (
    <div>
      <input
        type="file"
        id="file"
        className="input-file"
        accept=".json"
        onChange={(e) => handleFileChosen(e.target.files[0])}
      />
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [state, dispatch] = useReducer(importedDataReducer, initialState);
  let importedData = state.data;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="tabs pb-5">
        <div
          className={
            "tab tab-lg tab-bordered " + (activeTab === 0 ? "tab-active" : null)
          }
          onClick={() => setActiveTab(0)}
        >
          {" "}
          Weekly Summary
        </div>
        {/* <div className="tab tab-lg tab-bordered tab-active" > */}
        <div
          className={
            "tab tab-lg tab-bordered " + (activeTab === 1 ? "tab-active" : null)
          }
          onClick={() => setActiveTab(1)}
        >
          {" "}
          Experimental
        </div>
      </div>
      {activeTab === 0 ? (
        <div>
          <div className = "px-2">
            <ImportData state={state} dispatch={dispatch} />
          </div>
          {importedData.length > 0 ? (
            <WeeklyReport data={importedData} />
          ) : (
            <div className="px-2 italic text-lg text-orange-500">Import Data to view report </div>
          )}
        </div>
      ) : null}
      {/* <hr className="py-10" /> */}
      {activeTab === 1 ? <div> Experimental </div> : null}
    </div>
  );
}

export default App;
