import React, { useState, useEffect } from "react";

function ActiveISummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([])

  const handleCopyToLocal = (files) => {
    setSelectedFiles(files)
  };

  async function fetchActiveISum() {
    setLoading(true);
    fetch("http://127.0.0.1:5005/getActiveISummary")
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Failed to fetch data");
        }
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchActiveISum()
  }, []);

  async function copyToLocal(event) {
    event.preventDefault();
    console.log ( JSON.stringify(selectedFiles ))
    const response = await fetch("http://127.0.0.1:5005/copy_isum_to_local/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedFiles )
    });
    const json = await response.json();
    console.log(json);
  }


  return (
    <>
      <div>ActiveISummary</div>
      {/* Filter */}
      <div className ="p-2">{data && !loading ? <ActiveISumTable data={data} handleCopyToLocal={handleCopyToLocal} /> : <button className="btn loading">loading</button>}</div>
      <div className ="p-2 flex flex-col  justify-between gap-2">
        <button className="btn" onClick = {copyToLocal} >Copy to local</button>
        <button className="btn" > Open Selected Files</button> 
        <button className="btn" onClick = {fetchActiveISum}> Refresh</button> 
      </div>
    </>
  );
}

export default ActiveISummary;

function ActiveISumTable(props) {
  const { data, handleCopyToLocal } = props;
  const [selectedRows, setSelectedRows] = useState([]);
  const handleRowClick = (e) => {
    let row = e.target.value;
    const selectedIndex = selectedRows.indexOf(row);
    if (selectedIndex === -1) {
      // If not, add the row to the selectedRows array
      setSelectedRows([...selectedRows, row]);
    } else {
      // If yes, remove the row from the selectedRows array
      const newSelectedRows = [...selectedRows];
      newSelectedRows.splice(selectedIndex, 1);
      setSelectedRows(newSelectedRows);
    }
    handleCopyToLocal(selectedRows)
  };

  const isRowSelected = (rowIndex) => {
    // Check if the index is in the selectedRows array
    return selectedRows.indexOf(rowIndex.toString()) !== -1;
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="table table-compact w-full">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>name</th>
            <th>time</th>
            <th>path</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr>
              <th>
                <label>
                  <input
                    type="checkbox"
                    id={index}
                    value={index}
                    className="checkbox"
                    checked={isRowSelected(index)}
                    onChange={handleRowClick}
                  />
                </label>
              </th>
              <td>{item.name}</td>
              <td>{item.time}</td>
              <td>{item.dpath}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
