import React, { useState, useEffect, useCallback } from "react";
import RecentJVL from "../Jelly/RecentJVL";
import debounce from "lodash/debounce";

function InstaView() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4 text-center">InstaView</h1>
      <div className="px-4 py-4">
        <RecentJVL />
      </div>
      <InstaViewKeyword />
    </>
  );
}

function InstaViewKeyword() {
  const [plateInfo, setPlateInfo] = useState(null);
  const [error, setError] = useState(null);
  const [runIdFilter, setRunIdFilter] = useState("");
  const [keywordFilter, setKeywordFilter] = useState("");
  const [debouncedRunIdFilter, setDebouncedRunIdFilter] = useState("");
  const [debouncedKeywordFilter, setDebouncedKeywordFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchPlateInfo = useCallback(() => {
    setError(null);
    setPlateInfo(null);
    fetch("http://127.0.0.1:5005/getPlateInfo")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setPlateInfo(data.data);
      })
      .catch((error) => {
        console.error("Error fetching plate info:", error);
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    fetchPlateInfo();
  }, [fetchPlateInfo]);

  // Debounce functions
  const debouncedSetRunIdFilter = useCallback(
    debounce((value) => {
      setDebouncedRunIdFilter(value);
    }, 500),
    []
  );

  const debouncedSetKeywordFilter = useCallback(
    debounce((value) => {
      setDebouncedKeywordFilter(value);
    }, 500),
    []
  );

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  // Update filters with debounce
  const handleRunIdFilterChange = (e) => {
    setRunIdFilter(e.target.value);
    debouncedSetRunIdFilter(e.target.value);
  };

  const handleKeywordFilterChange = (e) => {
    setKeywordFilter(e.target.value);
    debouncedSetKeywordFilter(e.target.value);
  };

  const columns = ["RunID", "Date", "keywords", "emissionSide"];

  const filteredPlateInfo = plateInfo
    ? plateInfo.filter((row) => {
        const runIdMatch =
          !debouncedRunIdFilter ||
          debouncedRunIdFilter
            .split(",")
            .some((filter) =>
              row.RunID?.toLowerCase().includes(filter.trim().toLowerCase())
            );
        const keywordMatch =
          !debouncedKeywordFilter ||
          debouncedKeywordFilter.split(",").some((filter) =>
            (row.keywords || "")
              .toLowerCase()
              .split(",")
              .some((keyword) =>
                keyword
                  .trim()
                  .toLowerCase()
                  .includes(filter.trim().toLowerCase())
              )
          );
        const dateMatch =
          (!startDate || new Date(row.Date) >= new Date(startDate)) &&
          (!endDate || new Date(row.Date) <= new Date(endDate));
        return runIdMatch && keywordMatch && dateMatch;
      })
    : null;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">InstaKeyword</h1>
        <button className="btn btn-primary" onClick={fetchPlateInfo}>
          Refresh Data
        </button>
      </div>
      <div className="mb-4 flex space-x-4">
        <div>
          <label htmlFor="runIdFilter" className="mr-2">
            Filter by RunID:
          </label>
          <input
            type="text"
            id="runIdFilter"
            className="input input-bordered"
            value={runIdFilter}
            onChange={handleRunIdFilterChange}
            placeholder="Enter RunIDs (comma-separated)"
          />
        </div>
        <div>
          <label htmlFor="keywordFilter" className="mr-2">
            Filter by Keyword:
          </label>
          <input
            type="text"
            id="keywordFilter"
            className="input input-bordered"
            value={keywordFilter}
            onChange={handleKeywordFilterChange}
            placeholder="Enter Keywords (comma-separated)"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            className="input input-bordered"
            value={startDate}
            onChange={handleStartDateChange}
          />
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            className="input input-bordered"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
      </div>
      {error ? (
        <p className="text-error">Error: {error}</p>
      ) : filteredPlateInfo ? (
        <div className="overflow-x-auto">
          <div className="text-right p-2 text-sm">
            Showing {filteredPlateInfo.length} rows
          </div>
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPlateInfo.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td key={column}>{row[column] || "N/A"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-info">Loading plate information...</p>
      )}
    </div>
  );
}

export default InstaView;
