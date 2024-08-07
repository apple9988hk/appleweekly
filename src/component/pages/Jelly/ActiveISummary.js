import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";

function ActiveISummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleSelectedFiles = (files) => {
    setSelectedFiles(files);
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
    fetchActiveISum();
  }, []);

  // async function copyToLocal(event) {
  //   event.preventDefault();
  //   fetch("http://127.0.0.1:5005/copy_isum_to_local/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(
  //       selectedFiles.map((d, index) => {
  //         return { name: data[d].name };
  //       })
  //     ),
  //   })
  //     .then((data) => {
  //       // console.log(data);
  //       toast.success("Copy to Local Successfully!");
  //     })
  //     .catch((error) => {
  //       toast.error("Copy to Local Failed");
  //     });
  // }

  // async function copyToLocal(event) {
  //   event.preventDefault();
  //   const response = await toast.promise(
  //     fetch("http://127.0.0.1:5005/copy_isum_to_local/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(
  //         selectedFiles.map((d, index) => {
  //           return { name: data[d].name };
  //         })
  //       ),
  //     }).then((response) => {
  //       if (response.status === 200) {
  //         return response.json();
  //       } else {
  //         throw new Error("Failed to fetch data");
  //       }
  //     }),
  //     {
  //       pending: 'Start copying',
  //       success: 'Copy to Local Successfully! 👌',
  //       error: 'Copy to Local Failed 🤯'
  //     }
  //   );
  //   console.log(response)
  // }

  async function copyToLocal(event) {
    event.preventDefault();
    console.log(selectedFiles);
    const id = toast.loading("Start copying");
    if (selectedFiles.length === 0) {
      toast.update(id, {
        render: "No file selected",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      return;
    } else {
      fetch("http://127.0.0.1:5005/copy_isum_to_local/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          selectedFiles.map((d, index) => {
            return { name: data[d].name };
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
        .then((data) => {
          toast.update(id, {
            render: `${data["message"]}`,
            type: "success",
            isLoading: false,
            autoClose: 5000,
          });
          console.log(data);
        });
    }
  }

  async function createShortCut(event) {
    event.preventDefault();
    console.log(selectedFiles);
    const id = toast.loading("Creating Short Cut");
    if (selectedFiles.length === 0) {
      toast.update(id, {
        render: "No file selected",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      return;
    } else {
      fetch("http://127.0.0.1:5005/create_short_cut/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          selectedFiles.map((d, index) => {
            return { name: data[d].name };
          })
        ),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            toast.error("Create short cut Failed");
            throw new Error("Create short cut Failed");
          }
        })
        .then((data) => {
          console.log(data)
          if (Array.isArray(data["messages"])) {
            // If it's a list, iterate over each message
            data["messages"].forEach((message) => {
              toast.update(id, {
                render: message,
                type: "success",
                isLoading: false,
                autoClose: 5000,
              });
              // toast(message, {
              //   type: "success",
              //   autoClose: 5000,
              // });
            });
          } else {
            // If it's a single string, handle it as a single message
            toast.update(id, {
              render: data["messages"],
              type: "success",
              isLoading: false,
              autoClose: 5000,
            });
          }
          console.log(data);
        });
    }
  }

  return (
    <>
      <ToastContainer position="bottom-right" />
      <div className="font-bold text-xl">ActiveISummary</div>

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

      {/* <>
        <DirectorySelector />
      </> */}

      {/* <div className="p-2 flex flex-col  justify-between gap-2"> */}
      <div className="flex w-full justify-between">
        <button className="btn" onClick={copyToLocal}>
          Copy to local
        </button>
        <button className="btn"> Open Selected Files</button>
        <button className="btn" onClick={createShortCut}>
          Create ShortCut
        </button>
        <button className="btn" onClick={fetchActiveISum}>
          {" "}
          Refresh
        </button>
      </div>
    </>
  );
}

export default ActiveISummary;

function ActiveISumTable(props) {
  const { data, handleSelectedFiles } = props;
  const [selectedRows, setSelectedRows] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [showAllEntries, setShowAllEntries] = useState(false);

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
  const handleShowAllToggle = () => {
    setShowAllEntries(!showAllEntries);
  };

  const entriesToShow = showAllEntries ? data : data.slice(0, 10);

  const isRowSelected = (rowIndex) => {
    // Check if the index is in the selectedRows array
    return selectedRows.indexOf(rowIndex.toString()) !== -1;
  };

  return (
    <div className="overflow-x-auto w-full">
      <div className="flex justify-end mb-2">
        <button
          className="btn btn-xs bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700"
          onClick={handleShowAllToggle}
        >
          {showAllEntries ? "Show Less" : "Show All"}
        </button>
      </div>
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
            <th>time</th>
            <th>path</th>
          </tr>
        </thead>
        <tbody>
          {entriesToShow.map((item, index) => (
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

function DirectorySelector() {
  const [directoryPath, setDirectoryPath] = useState("");

  const handleSelectDirectory = (event) => {
    const directoryPath = event.target.files[0].path;
    setDirectoryPath(directoryPath);
  };

  return (
    <div>
      <label htmlFor="directory-selector">Select Directory:</label>
      <input
        id="directory-selector"
        type="file"
        directory
        webkitdirectory
        onChange={handleSelectDirectory}
      />
      {directoryPath && <p>Selected Directory: {directoryPath}</p>}
    </div>
  );
}
