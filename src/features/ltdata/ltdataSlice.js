import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import _ from "lodash";
const API_URL = "http://ltquickview.udc.local/api/v1.0/data/life";
const axios = require('axios')

const initialState = {
  data: [],
  idList: [],
  status: "idle",
  error: null,
  watchList: [],
};

export const fetchLTData = createAsyncThunk("users/fetchLTData", async (id) => {
  let newdata = {};
  const snapshot = await axios.get(
    `http://tmdata.udc.local/api/life/${id}`
  )
 
  if (snapshot.status === 200){
    newdata = snapshot.data
  }
  return newdata;
});

// export const fetchLTData = createAsyncThunk("users/fetchLTData", async (id) => {
//   let newdata = {};
//   console.log("fetch", id)
//   // const snapshot = await axios.get(
//   //   `http://tmdata.udc.local/api/life/${id}`
//   // )
 
//   // if (snapshot.status === 200){
//   //   newdata = snapshot.data
//   // }
//   return newdata;
// });

export const ltdataSlice = createSlice({
  name: "ltdata",
  initialState,
  reducers: {
    toIdle(state, action) {
      state.status = "idle";
    },

  },
  extraReducers: {
    [fetchLTData.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchLTData.fulfilled]: (state, action) => {
      state.status = "succeeded";

      const newData = action.payload;
      const groupedData = _.groupBy(newData, 'SampleID');
      state.data = state.data.filter(item => !groupedData[item.key]);
      for (const [sampleID, data] of Object.entries(groupedData)) {
        state.data.push({ "key": sampleID, "data":data });
      }

      const newSampleIDs = Object.keys(groupedData);
      state.idList = _.uniq(state.idList.concat(newSampleIDs));
    },
    [fetchLTData.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});


export const { toIdle,  addtoWatchList} = ltdataSlice.actions;
export default ltdataSlice.reducer;
