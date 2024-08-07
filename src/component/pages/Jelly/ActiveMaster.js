import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";

function ActiveMaster() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleSelectedFiles = (files) => {
    setSelectedFiles(files);
  };

  async function fetchMaster() {
    setLoading(true);
    fetch("http://127.0.0.1:5005/getActiveMaster/")
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Failed to fetch data");
        }
      })
      .then((data) => {
        // console.log(data)
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
      });
  }

  useEffect(() => {
    fetchMaster();
  }, []);

  async function openMaster(event) {
    event.preventDefault();
    console.log(selectedFiles)
    const id = toast.loading("Start Opening")
    if (selectedFiles.length === 0){
      toast.update(id, { render:"No file selected", type: "error", isLoading: false, autoClose: 5000})
      return 
    } else {
      fetch("http://127.0.0.1:5005/open_master/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          selectedFiles.map((d, index) => {
            return { name: data[d].path };
          })
        ),
      })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          toast.error("Copy to Local Failed");
          throw new Error("Failed to fetch data");
        }
      })
      .then((data)=> {
        toast.update(id, { render: `${data['message']}`, type: "success", isLoading: false, autoClose: 5000 });
        console.log(data)
      })
    }
  }

  async function openFolder(event) {
    event.preventDefault();
    console.log(selectedFiles)
    const id = toast.loading("Opening Folder")
    if (selectedFiles.length === 0){
      toast.update(id, { render:"No file selected", type: "error", isLoading: false, autoClose: 5000})
      return 
    } else {
      fetch("http://127.0.0.1:5005/open_folder/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          selectedFiles.map((d, index) => {
            return { name: data[d].path };
          })
        ),
      })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          toast.error("Open Folder Failed");
          throw new Error("Open Folder Failed");
        }
      })
      .then((data)=> {
        toast.update(id, { render: `${data['message']}`, type: "success", isLoading: false, autoClose: 5000 });
        console.log(data)
      })
    }
  }

  async function openLifeFolder() {
    const id = toast.loading("Opening Life Folder")
    fetch("http://127.0.0.1:5005/open_Life_Folder/")
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          toast.error("Open Folder Failed");
          throw new Error("Failed to open life folder");
        }
      })
      .then((data) => {
        toast.update(id, { render: `${data['message']}`, type: "success", isLoading: false, autoClose: 5000 });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Open Folder Failed");
      });
  }

  console.log(data)
  return (
    <>
      <ToastContainer position="bottom-right" />
      <div className ="font-bold text-xl">Active Master</div>

      {/* Filter */}
      <div className="p-2">
        {data && !loading ? (
          <>
            <ActiveISumTable
              data={data}
              handleSelectedFiles={handleSelectedFiles}
            />
            <div className="p-2 text-right">Total {data.length} iSummary</div>
          </>
        ) : (
          <div className="text-center py-4">
            <BeatLoader color="#3298e2" />
          </div>
        )}
      </div>

      {/* <div className="p-2 flex flex-col  justify-between gap-2"> */}
      <div className="flex w-full justify-between" >
        <button className="btn" onClick={openMaster}>
          Open Master
        </button>
        <button className="btn" onClick={openFolder}>
          Open Folder
        </button>
        <button className="btn" onClick={openLifeFolder}>
          Open Life
        </button>
        <button className="btn" onClick={fetchMaster}>
          {" "}
          Refresh
        </button>
      </div>

    </>
  );
}


function ActiveISumTable(props) {
    const { data, handleSelectedFiles } = props;
    const [selectedRows, setSelectedRows] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    const handleRowClick = (e) => {
      let row = e.target.value;
      const selectedIndex = selectedRows.indexOf(row);
      if (selectedIndex === -1) {
        // If not, add the row to the selectedRows array
        setSelectedRows([...selectedRows, row]);
        handleSelectedFiles([...selectedRows, row]);
      } else {
        // If yes, remove the row from the selectedRows array
        const newSelectedRows = [...selectedRows];
        newSelectedRows.splice(selectedIndex, 1);
        setSelectedRows(newSelectedRows);
        handleSelectedFiles(newSelectedRows);
      }
    };
  
    const handleCheckAll = () => {
      // console.log("first");
      setCheckAll(!checkAll);
      if (!checkAll) {
        setSelectedRows(data.map((d, index) => index.toString()));
        handleSelectedFiles(data.map((d, index) => index.toString()));
      } else {
        setSelectedRows([]);
        handleSelectedFiles([]);
      }
      // setTableData(tableData.map(item => ({ ...item, isChecked: !isChecked })));
    };
    // console.log(selectedRows);
  
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
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={checkAll}
                    onChange={handleCheckAll}
                  />
                </label>
              </th>
              <th>name</th>
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
                <td>{item.path}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  

export default ActiveMaster;
