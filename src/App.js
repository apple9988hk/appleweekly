// import Header from "./component/Header"
import React, { useState, useReducer } from "react";
import WeeklyReport from "./component/pages/WeeklyReport";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import JTable from "./component/pages/JTable/JTable";
import SData from "./component/pages/SData/SData";
import CPPPlot from "./component/charts/CPPPlot";
import JImage from "./component/pages/JImage/JImage"
import Exp from "./component/pages/Exp/Exp"
import RecentPlate from "./component/pages/RecentPlate/RecentPlate"
import LTView from "./component/pages/LT/LTView.js"
import LEPlot from "./component/pages/LEPlot/LEPlot"
import TableTest from "./component/pages/TableTest/TableTest21"
import Jelly from "./component/pages/Jelly/Jelly"


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

const MainView = () => {
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
          JImage
        </div>
        <div
          className={
            "tab tab-lg tab-bordered " + (activeTab === 2 ? "tab-active" : null)
          }
          onClick={() => setActiveTab(2)}
        >
          {" "}
          SData
        </div>
        <div
          className={
            "tab tab-lg tab-bordered " + (activeTab === 3 ? "tab-active" : null)
          }
          onClick={() => setActiveTab(3)}
        >
          {" "}
          LE Plot
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
      {activeTab === 1 ? <div> <JImage/> </div> : null}
      {activeTab === 2 ? <div> <SData/> </div> : null}
      {activeTab === 3 ? <div> <LEPlot/> </div> : null}
    </div>
  );
}

const App = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="jtable" element={<JTable />} />
        <Route path="leplot" element={<LEPlot />} />
        <Route path="sdata" element={<SData />} />
        <Route path="test" element={<CPPPlot/>} />
        <Route path="jimage" element={<JImage/>} />
        <Route path="exp" element={<Exp/>} />
        <Route path="recentplate" element={<RecentPlate/>} />
        <Route path="LT" element={<LTView/>} />
        <Route path="TableTest" element={<TableTest/>} />
        <Route path="Jelly" element={<Jelly/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


