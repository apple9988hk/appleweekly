import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";
import { RefreshCw } from "lucide-react";

function RecentJVL() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchMaster() {
    setLoading(true);
    fetch("http://localhost:5005/recentJVL")
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Failed to fetch data");
        }
      })
      .then((data) => {
        if (data.n === 0) {
          setData([]);
        } else {
          setData(data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        toast.error("Failed to fetch data");
      });
  }

  // useEffect(() => {
  //   fetchMaster();
  // }, []);

  return (
    <>
      <ToastContainer position="bottom-right" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Recent JVL</h1>
        {/* <div className="font-bold text-xl">Recent JVL</div> */}
        <button
          onClick={fetchMaster}
          className="btn btn-primary btn-sm"
          disabled={loading}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>
      <div className="p-2">
        {data && !loading ? (
          <>
            <RecentJVLtable data={data} />
            <div className="p-2 text-right">Total {data.length} iSummary</div>
          </>
        ) : (
          <div className="text-center py-4">
            <BeatLoader color="#3298e2" />
          </div>
        )}
      </div>
    </>
  );
}

function RecentJVLtable(props) {
  const { data } = props;
  return (
    <div className="overflow-x-auto w-full">
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th className="w-24">Date</th>
            <th className="w-24">RunID</th>
            <th className="w-24">Tester</th>
            <th className="w-16">Count</th>
            <th>Keywords</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="whitespace-nowrap">{item.Date}</td>
              <td
                className={`whitespace-nowrap ${
                  item.RunID.length >= 9 && item.RunID[8] !== "-"
                    ? "bg-gray-200"
                    : ""
                }`}
              >
                {item.RunID}
              </td>
              <td className="whitespace-nowrap">{item.Tester}</td>
              <td className="text-center">{item.Count}</td>
              <td className="whitespace-normal break-words">{item.keywords}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentJVL;
