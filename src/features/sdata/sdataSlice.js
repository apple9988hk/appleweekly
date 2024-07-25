import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import _ from "lodash";
const API_URL = "https://jvldata.udc.local/getPlotData";
const axios = require('axios')

const initialState = {
  data: [],
  idList: [],
  status: "idle",
  error: null,
  watchList: [],
  singlePlotCouponList:[],
  multiPlotCouponList:[]
};

export const fetchSData = createAsyncThunk("users/fetchSData", async (id) => {
  let newdata = {};
  const snapshot = await axios.get(`http://tmdata.udc.local/api/spectral/${id}`);
  // const keyword = await axios.post(
  //   "http://ltquickview/api/v1.0/data/keywords", JSON.stringify([{ "sampleID": id+"-1d1" }])
  // )
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
    function( d ) {
      console.log(snapshot.data)
      console.log(d.SampleID)
      return (
        {
          ...d,
    }
      )
    }
  )
  console.log("merged")
  console.log(merged)
  newdata['data'] = merged;
  newdata['id'] = id;
  if (keyword === ""){
    newdata["keywords"] = ""
    newdata["substrate"] = ""
  } else {
    newdata["keywords"] = keyword.data[0]["keywords"];
    newdata["substrate"] = keyword.data[0]["substrate"];
  }
  // newdata['keywords'] = keyword.data[0]['keywords'];
  // newdata['substrate'] = keyword.data[0]['substrate'];
  return newdata;
});



export const sdataSlice = createSlice({
  name: "sdata",
  initialState,
  reducers: {
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
    addtoSinglePlotCouponList: (state, action) =>{
      const index = state.singlePlotCouponList.indexOf(action.payload);
      if (index > -1) { // only splice array when item is found
          state.singlePlotCouponList.splice(index, 1); // 2nd parameter means remove one item only
          console.log('item removed')
      } else {
        state.singlePlotCouponList.push(action.payload)
      }
    },
    addtoMultiPlotCouponList: (state, action) =>{
      const index = state.multiPlotCouponList.indexOf(action.payload);
      if (index > -1) { // only splice array when item is found
          state.multiPlotCouponList.splice(index, 1); // 2nd parameter means remove one item only
          console.log('item removed')
      } else {
        state.multiPlotCouponList.push(action.payload)
      }
    },
    //   console.log("addtoSinglePlotCouponList")
    //   console.log(action.payload)
    //   state.singlePlotCouponList.push(action.payload)
    // },
    // removeFmSinglePlotCouponList: (state, action) =>{
    //   console.log("removeFmSinglePlotCouponList")
    //   const index = state.singlePlotCouponList.indexOf(action.payload);
    //   if (index > -1) { // only splice array when item is found
    //     state.singlePlotCouponList.splice(index, 1); // 2nd parameter means remove one item only
    //   }
    // },
  },
  extraReducers: {
    [fetchSData.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchSData.fulfilled]: (state, action) => {
      state.status = "succeeded";
      console.log(action.payload)
      state.data = state.data.concat(action.payload.data)
      state.idList.push({"id":action.payload.id, "keywords": action.payload.keywords})
    },
    [fetchSData.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const { toIdle, addtoWatchList, addtoSinglePlotCouponList, addtoMultiPlotCouponList} = sdataSlice.actions;
export default sdataSlice.reducer;
