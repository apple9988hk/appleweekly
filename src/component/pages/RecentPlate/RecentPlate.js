import React, { useEffect, useState } from "react";
import axios from "axios";
import { dataTool } from "echarts";

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
}

function ResentPlate() {
  const [fetched, setFetched] = useState([]);
  const fetchRecent = async () => {
    const snapshot = await axios.get(`http://127.0.0.1:80/getRecentRuns/`);
    setFetched(snapshot.data);
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  useEffect(() => {
    if (fetched["data"]) {
      console.log(fetched);
    }
  }, [fetched]);

  return (
    <div className="w-full mx-auto px-5">
      <div className="font-bold text-3xl">Recent Plate</div>
      {fetched.data ? (
        <PlateTable data={fetched["data"]} />
      ) : // fetched['data'].map(function(d, index){
      //    let dDate = timeConverter(d.SampleDate)
      //     return <div> {d.SampleID.slice(0,10)}  {dDate}</div>;
      //   })
      null}
    </div>
  );
}

function PlateTable(props) {
  const { data } = props;
  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-auto">
        <table className="relative w-full border">
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map(function (d, index) {
              let dDate = timeConverter(d.SampleDate);
              return (
                <tr key={index}>
                  <td> {index} </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-left"> {d.SampleID.slice(0, 10)} </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-left"> {dDate} </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-left"> {d.keywords}v</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResentPlate;
