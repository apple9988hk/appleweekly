import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";

function OJTable() {
  const ojdataset = useSelector((state) => state.ojdata.data);
  const idList = useSelector((state) => state.ojdata.idList);
  const watchList = useSelector((state) => state.ojdata.watchList);
  var cdList = useSelector((state) => state.ojdata.cdList);
  cdList =
    cdList.length > 0
      ? _.sortBy(cdList, function (o) {
          return o.cd;
        })
      : [];
  const [selectedCD, setSelectedCD] = useState(
    cdList.length > 0 ? cdList[0] : 0
  );

  // console.log(
  //   _.filter(ojdataset, function (o) {
  //     return o.Title.slice(0, 10) === watchList[0];
  //   })
  // );
  return (
    <div>
      OJTable
      <>
        <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
          {cdList.map((cd) => (
            <button className="btn"> {cd.cd} </button>
          ))}
        </ul>
      </>
      <>
        {watchList.map((item, index) => {
          return <div key={index}> {item} </div>;
        })}
      </>
      <>
        {watchList.length > 0 ? (
          <OJTableSingle
            data={_.filter(ojdataset, function (o) {
              return (
                o.Title.slice(0, 10) === watchList[watchList.length - 1] &&
                o.CurrentDensity === 15
              );
            })}
          />
        ) : null}{" "}
        */
      </>
    </div>
  );
}

function OJTableSingle(props) {
  const { data } = props;
  // console.log(data);
  const dataToShow = ["Title", "CurrentDensity", "CIE_X", "CIE_Y", "Luminance"];
  let stat = {};
  dataToShow.map(function (d, index) {
    // console.log(d);
    return (stat[d] = _.meanBy(data, d));
  });
  // console.log(stat);
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <table className="relative w-full border">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {dataToShow.map((title) => (
                <th
                  scope="col"
                  className=" px-6 py-3 mx-auto text-xs font-medium text-gray-500 bg-gray-100"
                  key={title}
                >
                  <div className="flex items-center justify-center">
                    {title}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <>
              <tr>
                {dataToShow.map(function (d, index) {
                  return (
                    <td
                      key={index}
                      className="px-6 py-2 whitespace-nowrap text-sm bg-yellow-200 text-center"
                    >
                      {d === "Title"
                        ? "Average"
                        : Math.round(stat[d] * 1000) / 1000}
                    </td>
                  );
                })}
              </tr>
              {data.map(function (d, index) {
                return (
                  <tr key={data.SampleID}>
                    {dataToShow.map(function (title, index) {
                      return (
                        <td
                          key={index}
                          className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center"
                        >
                          {Math.round(d[title] * 1000) / 1000
                            ? Math.round(d[title] * 1000) / 1000
                            : d[title]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OJTable;
