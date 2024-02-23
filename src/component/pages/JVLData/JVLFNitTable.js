import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
// import ReactEcharts from "echarts-for-react";
// import { addtoSinglePlotCouponList } from "../../../features/sdata/sdataSlice";

function JVLFNitTable() {
  const jvlfdataset = useSelector((state) => state.jvlfdata.data);
  const idList = useSelector((state) => state.jvlfdata.idList);
  const watchList = useSelector((state) => state.jvlfdata.watchList);
  const dispatch = useDispatch();
  //   const jvldata = _.filter(jvlfdataset, { 'age': 36, 'active': true });
  //   console.log("first");
  //   console.log(jvlfdataset);
  const jvldata = _.filter(jvlfdataset, function (o) {
    return o.SampleID.slice(0, 10) === watchList[watchList.length - 1];
  });
  const [inputNit, setInputNit] = useState("");

  return (
    <div>
      <div className="flex flex-row w-full max-w-xs py-5 items-center px-5">
        <div className="form-control pr-2">
          <input
            type="text"
            placeholder="Input nit"
            className="input input-bordered input-sm w-full max-w-xs"
            onChange={(e) => setInputNit(e.target.value)}
          />
        </div>
      </div>
      {inputNit ? (
        <CDatNit
          nit={inputNit}
          data={jvldata}
          runID={watchList[watchList.length - 1]}
        />
      ) : null}
    </div>
  );
}

function findClosestValuesInObjects(arrOfObjects, target, propertyName) {
  // Sort the array of objects based on the specified property
  arrOfObjects.sort((a, b) => a[propertyName] - b[propertyName]);

  let closestPair = [arrOfObjects[0], arrOfObjects[1]]; // Initialize with the first two elements
  let minDifference = Math.abs(
    arrOfObjects[0][propertyName] + arrOfObjects[1][propertyName] - target
  );

  for (let i = 1; i < arrOfObjects.length - 1; i++) {
    const currentDifference = Math.abs(
      arrOfObjects[i][propertyName] + arrOfObjects[i + 1][propertyName] - target
    );

    if (currentDifference < minDifference) {
      minDifference = currentDifference;
      closestPair = [arrOfObjects[i], arrOfObjects[i + 1]];
    }
  }

  return closestPair;
}

function CDatNit(props) {
  const { nit, data, runID } = props;
  // console.log("input");
  // console.log(data);
  //   console.log(data);
  const newdata = data.map(function (d) {
    // console.log(d)
    let a = _.findLast(d.JVLForwardDetail, function (n) {
      return n["Luminance"] <= nit;
    });
    let b = _.find(d.JVLForwardDetail, function (n) {
      return n["Luminance"] > nit;
    });

    return {
      SampleID: d.SampleID,
      valueA: a,
      valueB: b,
      cd:
        a.CurrentDensity +
        (nit - a.Luminance) *
          ((b.CurrentDensity - a.CurrentDensity) / (b.Luminance - a.Luminance)),
      cie_x: d.Cie_x,
      cie_y: d.Cie_y,
    };
  });

//   console.log(newdata);

  return (
    <>
      <JVLFData2 data={newdata} runID={runID} />
      {/* <JVLFData data={neswdata} /> */}
    </>
  );
}

function JVLFData(props) {
  const { data } = props;
  //   console.log(data)
  return (
    <div className="overflow-x-auto w-full">
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th>id</th>
            <th>cd</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map(function (d) {
            return (
              <tr>
                <td>
                  <div className="flex items-center space-x-3">
                    {d.SampleID}
                  </div>
                </td>
                <td>
                  <div className="flex items-center space-x-3">
                    {Math.round(d.cd * 10000) / 10000}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function JVLFData2(props) {
  const { data, runID } = props;
  //   console.log(data);
  //   console.log(runID);
  let resArray = [];
  const couponList = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const dotList = ["1", "2", "3", "4"];
  for (let i = 0; i < couponList.length; i++) {
    const c = couponList[i];
    let buffer = {};
    buffer["SampleID"] = runID + "-" + c;
    buffer["cie_x"] = _.filter(data, { SampleID: runID + "-" + c + "d4" })[0]
      .cie_x
      ? _.filter(data, { SampleID: runID + "-" + c + "d4" })[0].cie_x
      : _.filter(data, { SampleID: runID + "-" + c + "d3" })[0].cie_x
      ? _.filter(data, { SampleID: runID + "-" + c + "d3" })[0].cie_x
      : _.filter(data, { SampleID: runID + "-" + c + "d2" })[0].cie_x
      ? _.filter(data, { SampleID: runID + "-" + c + "d2" })[0].cie_x
      : _.filter(data, { SampleID: runID + "-" + c + "d1" })[0].cie_x
      ? _.filter(data, { SampleID: runID + "-" + c + "d1" })[0].cie_x
      : null;
    buffer["cie_y"] = _.filter(data, { SampleID: runID + "-" + c + "d4" })[0]
      .cie_y
      ? _.filter(data, { SampleID: runID + "-" + c + "d4" })[0].cie_y
      : _.filter(data, { SampleID: runID + "-" + c + "d3" })[0].cie_y
      ? _.filter(data, { SampleID: runID + "-" + c + "d3" })[0].cie_y
      : _.filter(data, { SampleID: runID + "-" + c + "d2" })[0].cie_y
      ? _.filter(data, { SampleID: runID + "-" + c + "d2" })[0].cie_y
      : _.filter(data, { SampleID: runID + "-" + c + "d1" })[0].cie_y
      ? _.filter(data, { SampleID: runID + "-" + c + "d1" })[0].cie_y
      : null;
    for (let j = 0; j < dotList.length; j++) {
      let d = dotList[j];
      let cd = _.filter(data, { SampleID: runID + "-" + c + "d" + d })[0].cd;
      buffer[`d${dotList[j]}`] = Math.round(cd * 1000) / 1000;
    }

    let lt_cd = 0;

    if (buffer["cie_y"] >= 0.04 && buffer["cie_y"] <= 0.063) {
      lt_cd = buffer["d4"]
        ? buffer["d4"]
        : buffer["d3"]
        ? buffer["d3"]
        : buffer["d2"]
        ? buffer["d2"]
        : buffer["d1"]
        ? buffer["d1"]
        : null;
    } else {
      lt_cd = 20;
    }

    buffer["LT_CD"] = Math.round(lt_cd * 10) / 10;

    resArray.push(buffer);
  }

//   console.log(resArray);

  //   const tableComponent = ["1", "2", "3","4","5","6","7","8","9"].map(function (c) {
  //     // console.log(c)
  //     return (
  //       <tr>
  //         <td> {`${runID}-${c}`} </td>
  //         <td>
  //             {
  //                 _.filter(data, { "SampleID": runID + "-" + c + "d4" })[0].cie_x ?
  //                 _.filter(data, { "SampleID": runID + "-" + c + "d4" })[0].cie_x : (
  //                     _.filter(data, { "SampleID": runID + "-" + c + "d3" })[0].cie_x ?
  //                     _.filter(data, { "SampleID": runID + "-" + c + "d3" })[0].cie_x : (
  //                         _.filter(data, { "SampleID": runID + "-" + c + "d2" })[0].cie_x ?
  //                         _.filter(data, { "SampleID": runID + "-" + c + "d2" })[0].cie_x : (
  //                             _.filter(data, { "SampleID": runID + "-" + c + "d1" })[0].cie_x ?
  //                             _.filter(data, { "SampleID": runID + "-" + c + "d1" })[0].cie_x : null
  //                         )
  //                     )
  //                 )
  //             }
  //         </td>
  //         <td>
  //             {
  //                 _.filter(data, { "SampleID": runID + "-" + c + "d4" })[0].cie_y ?
  //                 _.filter(data, { "SampleID": runID + "-" + c + "d4" })[0].cie_y : (
  //                     _.filter(data, { "SampleID": runID + "-" + c + "d3" })[0].cie_y ?
  //                     _.filter(data, { "SampleID": runID + "-" + c + "d3" })[0].cie_y : (
  //                         _.filter(data, { "SampleID": runID + "-" + c + "d2" })[0].cie_y ?
  //                         _.filter(data, { "SampleID": runID + "-" + c + "d2" })[0].cie_y : (
  //                             _.filter(data, { "SampleID": runID + "-" + c + "d1" })[0].cie_y ?
  //                             _.filter(data, { "SampleID": runID + "-" + c + "d1" })[0].cie_y : null
  //                         )
  //                     )
  //                 )
  //             }
  //         </td>
  //         {["1", "2", "3", "4"].map(function (d) {
  //             const cd = _.filter(data, { "SampleID": runID + "-" + c + "d" + d })[0].cd
  //             return(
  //                 <td>
  //                     {Math.round(cd* 1000) / 1000}
  //                 </td>
  //             )
  //         })}
  //       </tr>
  //     );
  //   });

  return (
    <div className="overflow-x-auto w-full">
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th>Coupon</th>
            <th>CIE_X(d4)</th>
            <th>CIE_Y(d4)</th>
            <th>d1</th>
            <th>d2</th>
            <th>d3</th>
            <th>d4</th>
            <th>LT_CD</th>
          </tr>
        </thead>
        {/* <tbody> {tableComponent} </tbody> */}
        <tbody>
          {resArray.map(function (d) {
            return (
              <tr >
                <td>{d.SampleID}</td>
                <td>{d.cie_x}</td>
                <td className={`${d.cie_y >=0.04 && d.cie_y<0.06 ? 'bg-yellow-200' : null}`}>{d.cie_y}</td>
                <td>{d.d1}</td>
                <td>{d.d2}</td>
                <td>{d.d3}</td>
                <td>{d.d4}</td>
                <td>{d.LT_CD}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// className="bg-yellow-200"

export default JVLFNitTable;
