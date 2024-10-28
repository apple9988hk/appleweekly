import React from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

const DownloadCSV = ({ data, fileName }) => {
  const convertToCSV = (objArray) => {
    let allData = [];

    objArray.forEach((element) => {
      if (element.data && Array.isArray(element.data)) {
        if (allData.length === 0 && element.data.length > 0) {
          // Add headers as the first row
          allData.push(Object.keys(element.data[0]));
        }
        allData = allData.concat(element.data);
      }
    });

    let str = "";
    for (let i = 0; i < allData.length; i++) {
      let line = "";
      for (let index in allData[i]) {
        if (line !== "") line += ",";
        line += allData[i][index];
      }
      str += line + "\r\n";
    }
    return str;
  };

  const downloadCSV = () => {
    const csvData = new Blob([convertToCSV(data)], { type: "text/csv" });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = csvURL;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={downloadCSV}>
      <ArrowDownTrayIcon className="h-5 w-5" />
    </button>
  );
};

export default DownloadCSV;
