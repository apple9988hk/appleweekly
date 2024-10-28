import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";
import _ from "lodash";
import { StarIcon } from "@heroicons/react/24/outline";

function Parking() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchParking(event) {
    setLoading(true);
    fetch("http://localhost:5005/parking/getParking", {
      method: "GET",
      headers: {
        accept: " application/json, text/javascript, */*; q=0.01",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Failed to fetch data");
        }
      })
      .then((data) => {
        setData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Copy to Local Failed");
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchParking();
  }, []);

  console.log(data);

  return (
    <div>
      <ToastContainer position="bottom-right" />
      Parking
      {data && !loading ? (
        <>
          <div className="p-2 text-right">Total: {data.totalSearchResult}</div>
          <ParkingTable data={data.geoLocationResult} />
        </>
      ) : (
        <div className="text-center py-4">
          <BeatLoader color="#3298e2" />
        </div>
      )}
    </div>
  );
}

export default Parking;

function ParkingTable(props) {
  const { data } = props;
  console.log(data);
  const fav = [
    "bbfa9d85-1d12-4845-9299-f9460a4de159",
    "940a67ff-98ec-475f-b9ea-170890fd39be",
    "c96db2f8-7ac5-40a1-b6d3-b96ad3cf7086",
  ];
  let sorted = data.map((d, index) => {
    return {
      ...d,
      fav: 1 ? fav.includes(d.ItemId) : 0,
    };
  });
  sorted = _.orderBy(sorted, ["fav", "Title"], ["desc", "desc"]);

  console.log(sorted);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Total</th>
              <th>QuickCharger</th>
              <th>SemiQuickCharger</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((d, index) => (
              <tr>
                <td>
                  <div className="w-64 truncate">{d.title}</div>
                  {d.fav ? <StarIcon className="h-5 w-5" /> : <></>}
                </td>
                <td>{d.totalNumberOfCharger}</td>
                <td>
                  {d.totalNumberOfAvailableQuickCharger}/{" "}
                  {d.totalNumberOfQuickCharger}
                </td>
                <td>
                  {d.totalNumberOfAvailableSemiQuickCharger}/{" "}
                  {d.totalNumberOfSemiQuickCharger}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
