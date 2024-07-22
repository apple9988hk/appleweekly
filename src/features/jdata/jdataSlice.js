import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import _ from "lodash";
// const axios = require("axios");
const API_URL = "https://jvldata.udc.local/getPlotData";
// const https = require('https');
const axios = require("axios");
// const https = require('https');

const initialState = {
  data: [],
  idList: [],
  status: "idle",
  error: null,
  watchList: [],
};

export const fetchJData = createAsyncThunk("users/fetchJData", async (id) => {
  let newdata = {};
  const snapshot = await axios.get(
    `http://tmdata.udc.local/api/spectral/log/${id}`
  );
  const snapshot2 = await axios.get(
    `http://tmdata.udc.local/api/jvl/summary/${id}`
  );
  let keyword = ""
  try {
    const keyword = await axios.post(
      "http://ltquickview/api/v1.0/data/keywords",
      JSON.stringify([{ sampleID: id + "-1d1" }])
    );
  } catch (error) {
    console.error("Error fetching keywords:", error);
    keyword = ""; // Set keyword to an empty string if there is an error
  }
  let merged = snapshot.data.map(function (d) {
    console.log(snapshot2.data);
    console.log(d.SampleID);
    let e = _.filter(snapshot2.data, function (o) {
      return o.Filename === d.SampleID;
    });
    // console.log(e)
    // console.log(d)
    // console.log(d.CdA/ e[0].Cie_y)
    return {
      ...d,
      ...e[0],
      BI: d.CdA / e[0].Cie_y,
    };
  });
  // console.log("merged")
  // console.log(merged)

  newdata["data"] = merged;
  newdata["id"] = id;
  if (keyword === ""){
    newdata["keywords"] = ""
    newdata["substrate"] = ""
  } else {
    newdata["keywords"] = keyword.data[0]["keywords"];
    newdata["substrate"] = keyword.data[0]["substrate"];
  }
  // console.log(newdata)
  return newdata;
});

// http://tmdata.udc.local/api/jvl/forward/H-091523aB

export const fetchSpectral = createAsyncThunk(
  "users/fetchSpectral",
  async (id) => {
    let newdata = {};
    const snapshot = await axios.get(
      `http://tmdata.udc.local/api/spectral/${id}`
    );
    let keyword = ""
    try {
      const keyword = await axios.post(
        "http://ltquickview/api/v1.0/data/keywords",
        JSON.stringify([{ sampleID: id + "-1d1" }])
      );
    } catch (error) {
      console.error("Error fetching keywords:", error);
      keyword = ""; // Set keyword to an empty string if there is an error
    }
    let merged = snapshot.data.map(function (d) {
      console.log(snapshot.data);
      console.log(d.SampleID);
      return {
        ...d,
      };
    });
    // console.log("merged")
    // console.log(merged)

    newdata["data"] = merged;
    newdata["id"] = id;
    newdata["keywords"] = keyword.data[0]["keywords"];
    newdata["substrate"] = keyword.data[0]["substrate"];
    return newdata;
  }
);

export const jdataSlice = createSlice({
  name: "jdata",
  initialState,
  reducers: {
    // addJData : (state, action) => {
    //     state.data.push(action.payload);
    // },
    toIdle(state, action) {
      state.status = "idle";
    },
    resetJData(state, action) {
      // console.log(action)
      // console.log("resetJ")
      state.data = []
      state.idList = []
      state.status = "idle"
      state.error = null
      state.watchList = []
    },
    addtoWatchList: (state, action) => {
      const index = state.watchList.indexOf(action.payload);
      if (index > -1) {
        // only splice array when item is found
        state.watchList.splice(index, 1); // 2nd parameter means remove one item only
      }
      state.watchList.push(action.payload);
    },
    move_id_up: (state, action) => {
      const { payload: elementName } = action;
      const index = state.idList.findIndex(
        (element) => element.id === elementName
      );

      if (index > 0) {
        // Swap the element with the previous one
        [state.idList[index - 1], state.idList[index]] = [
          state.idList[index],
          state.idList[index - 1],
        ];
      }
    },
    move_id_down: (state, action) => {
      const { payload: elementName } = action;
      const index = state.idList.findIndex(
        (element) => element.id === elementName
      );

      if (index < state.idList.length - 1) {
        // Swap the element with the previous one
        [state.idList[index], state.idList[index + 1]] = [
          state.idList[index + 1],
          state.idList[index],
        ];
      }
    },
  },
  extraReducers: {
    [fetchJData.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchJData.fulfilled]: (state, action) => {
      state.status = "succeeded";
      console.log(action.payload);
      console.log("action.payload");
      // state.data = state.data.concat(action.payload.data)
      // state.idList.push({"id":action.payload.id, "keywords": action.payload.keywords})

      action.payload.data.forEach((newElement) => {
        const elementName = newElement.SampleID;
        const existingElementIndex = state.data.findIndex(
          (element) => element.SampleID === elementName
        );

        // If the element with the same name already exists, delete it before appending the new element
        if (existingElementIndex !== -1) {
          state.data.splice(existingElementIndex, 1);
        }
        // Append the newElement to state.data
        state.data.push(newElement);
      });

      const newId = {
        id: action.payload.id,
        keywords: action.payload.keywords,
      };

      const existingElementIndex = state.idList.findIndex(
        (element) => element.id === newId.id
      );
      if (existingElementIndex !== -1) {
        state.idList.splice(existingElementIndex, 1);
      }
      // Append the newElement to state.data
      state.idList.push(newId);
    },
    [fetchJData.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

// export const addJDataAsync = (id) => async (dispatch) => {
//     try {
//         const response = await axios.post(API_URL, JSON.stringify({ runNumber: id }));
//         let newdata = response.data
//         newdata['id'] = id

//         dispatch(addJData(newdata));
//       } catch (err) {
//         throw new Error(err);
//       }
//   };

// export const { addJData, toIdle } = jdataSlice.actions;
// export const showJData = (state) => state.jdata.data;
// export default jdataSlice.reducer;

export const { toIdle, addtoWatchList, move_id_up, move_id_down, resetJData } =
  jdataSlice.actions;
export default jdataSlice.reducer;
