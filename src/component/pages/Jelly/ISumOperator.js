import React, {useState} from "react";
import { ToastContainer, toast } from "react-toastify";

function ISumOperator() {
    const [isumDir, setIsumDir] = useState("");


    const findMaster = async () => {
        console.log(isumDir)
        fetch("http://127.0.0.1:5005/findMaster/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({input_str :isumDir})
          })
            .then((data) => {
              console.log(data.json());
              toast.success("Copy to Local Successfully!");
            })
            .catch((error) => {
              toast.error("Copy to Local Failed");
            });
    }

  return (
    <div>
      <div className="font-bold text-xl">iSummary Operator</div>
      <div className="w-full pt-5 pb-2 items-center">
        <div className="form-control pr-2">
          <input
            type="text"
            placeholder="Input id"
            className="input input-bordered input-sm w-full"
            onChange={(e) => setIsumDir(e.target.value)}
          />
        </div>
        <button className={`btn btn-outline btn-sm `} onClick={findMaster} >Fetch</button>
      </div>
    </div>
  );
}

export default ISumOperator;