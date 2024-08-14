import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExpCondition = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);

  const [formData, setFormData] = useState({
    runID: "",
    temp: "",
    cd: "",
    lt: "",
    endTime: "",
  });

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleFetch = async () => {
    if (!formData.runID) {
      setError("Please enter a runID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://127.0.0.1:5005/get_exp_details/?query=${formData.runID}`
      );

      // Assign alternating colors based on split changes
      let currentColor = 'bg-white';
      let prevSplit = null;
      const coloredData = response.data.data.map((item, index) => {
        if (index === 0 || item.split !== prevSplit) {
          currentColor = currentColor === 'bg-white' ? 'bg-gray-100' : 'bg-white';
        }
        prevSplit = item.split;
        return { ...item, color: currentColor };
      });
      
      setData(coloredData);


      // setData(response.data.data);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleFetch();
    }
  };

  const handleCheckboxChange = (couponId) => {
    setCheckedItems((prevCheckedItems) =>
      prevCheckedItems.includes(couponId)
        ? prevCheckedItems.filter((id) => id !== couponId)
        : [...prevCheckedItems, couponId]
    );
  };

  const handleChange = async () => {
    const toastId = toast.loading("Starting update...");
    const payload = {
      ...formData,
      couponToChange: checkedItems,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5005/change_exp_details",
        payload
      );
      toast.update(toastId, {
        render: response.data.message,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      console.log("Change response:", response.data);
    } catch (err) {
      console.error("Failed to change data:", err);
      toast.update(toastId, {
        render: "Failed to change data",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="py-6">
      <ToastContainer position="bottom-right" />
      <div className="font-bold text-xl">Exp Condition</div>
      <div className="flex items-center mb-4 py-6">
        <input
          type="text"
          value={formData.runID}
          onChange={handleInputChange("runID")}
          onKeyPress={handleKeyPress}
          placeholder="Enter runID"
          className="border border-gray-300 p-2 mr-2 rounded-md"
        />
        <button
          onClick={handleFetch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Fetch
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 mb-4">
        {[
          { label: "Temp", key: "temp", placeholder: "Temp" },
          { label: "CD", key: "cd", placeholder: "CD" },
          { label: "LT", key: "lt", placeholder: "LT%" },
          { label: "End Time", key: "endTime", placeholder: "End Time" },
        ].map((input) => (
          <label key={input.key} className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-700">
              {input.label}
            </span>
            <input
              type="text"
              value={formData[input.key]}
              onChange={handleInputChange(input.key)}
              placeholder={input.placeholder}
              className="input input-bordered w-full"
            />
          </label>
        ))}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        data.length > 0 && (
          <table className="min-w-full bg-white border border-gray-300 text-center">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Select</th>
                <th className="py-2 px-4 border-b">Experiment Test UID</th>
                <th className="py-2 px-4 border-b">Coupon ID</th>
                <th className="py-2 px-4 border-b">Temp</th>
                <th className="py-2 px-4 border-b">CD</th>
                <th className="py-2 px-4 border-b">LT%</th>
                <th className="py-2 px-4 border-b">End Time</th>
                <th className="py-2 px-4 border-b">Split</th>
                <th className="py-2 px-4 border-b">Emission Side</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.couponId} className={`border-b ${item.color}`}>
                  <td className="py-2 px-4">
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(item.couponId)}
                      onChange={() => handleCheckboxChange(item.couponId)}
                    />
                  </td>
                  <td className="py-2 px-4">{item.experimentTestUid}</td>
                  <td className="py-2 px-4">{item.couponId}</td>
                  <td className="py-2 px-4">{item.Temp}</td>
                  <td className="py-2 px-4">{item.CD}</td>
                  <td className="py-2 px-4">{item["LT%"]}</td>
                  <td className="py-2 px-4">{item.EndTime}</td>
                  <td className="py-2 px-4">{item.split}</td>
                  <td className="py-2 px-4">{item["Emission Side"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      <button
        onClick={handleChange}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
      >
        Change
      </button>
    </div>
  );
};

export default ExpCondition;
