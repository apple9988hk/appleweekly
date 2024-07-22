import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import _ from "lodash";
// const axios = require("axios");
// const API_URL = "https://jvldata.udc.local/getPlotData";
// const https = require('https');
const axios = require('axios')
// const https = require('https');

const initialState = {
  data: [],
  idList: [],
  status: "idle",
  error: null,
  watchList: [],
};

export const fetchJVLF = createAsyncThunk("users/fetchJVLFData", async (id) => {
  let newdata = {};
  const snapshot = await axios.get(`http://tmdata.udc.local/api/jvl/forward/${id}`);
  const snapshot2 = await axios.get(`http://tmdata.udc.local/api/jvl/summary/${id}`);
  // const keyword = await axios.post(
  //   "http://ltquickview/api/v1.0/data/keywords", JSON.stringify([{ "sampleID": id+"-1d1" }])
  // );
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
  let merged = snapshot.data.map( 
    function(d ) {
      // console.log(snapshot2.data)
      // console.log(d.SampleID)
      let e = _.filter(snapshot2.data, function (o) {
          return (
            o.Filename === d.SampleID
          );
        })
      // console.log(e)
      // console.log(d)
      // console.log(d.CdA/ e[0].Cie_y)
      return (
        {
          ...d,
          ...e[0],
        }
      )
    }
  )
  console.log(merged)
  console.log("merged")
  
  newdata['data'] = merged;
  newdata['id'] = id;
  newdata['keywords'] = keyword.data[0]['keywords'];
  newdata['substrate'] = keyword.data[0]['substrate'];
  return newdata;
});


export const jvlfdataSlice = createSlice({
  name: "jvlfdata",
  initialState,
  reducers: {
    // addJData : (state, action) => {
    //     state.data.push(action.payload);
    // },
    toIdle(state, action) {
      state.status = "idle";
    },
    addtoWatchList: (state, action) => {
        const index = state.watchList.indexOf(action.payload);
        if (index > -1) { // only splice array when item is found
            state.watchList.splice(index, 1); // 2nd parameter means remove one item only
        }
        state.watchList.push(action.payload)
      },
  },
  extraReducers: {
    [fetchJVLF.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchJVLF.fulfilled]: (state, action) => {
      state.status = "succeeded";
      console.log(action.payload)
      console.log("action.payload")
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

      const newId = {id: action.payload.id, keywords:action.payload.keywords}

      const existingElementIndex = state.idList.findIndex(
        (element) => element.id === newId.id
      );
      if (existingElementIndex !== -1) {
        state.idList.splice(existingElementIndex, 1);
      }
      // Append the newElement to state.data
      state.idList.push(newId);

    },
    [fetchJVLF.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});


export const { toIdle, addtoWatchList } = jvlfdataSlice.actions;
export default jvlfdataSlice.reducer;
