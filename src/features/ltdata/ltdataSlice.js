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
  const snapshot = await axios.post(
    "http://ltquickview.udc.local/api/v1.0/data/life", JSON.stringify([{ "sampleID": id }])
  );
  console.log(snapshot)
//   const snapshot = await axios.get(`http://ltquickview.udc.local/api/v1.0/data/life${id}`);
  const keyword = await axios.post(
    "http://ltquickview/api/v1.0/data/keywords", JSON.stringify([{ "sampleID": id }])
  );
  console.log(keyword)
  if (snapshot.status === 200){
    newdata = {
        ...newdata,
        ...snapshot.data[0],
    }
  }
  if (keyword.status === 200){
    newdata = {
        ...newdata,
        ...keyword.data[0]
    }
  }
  return newdata;
});

export const ltdataSlice = createSlice({
  name: "ltdata",
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
    [fetchLTData.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchLTData.fulfilled]: (state, action) => {
      state.status = "succeeded";
      console.log(action.payload)
      state.data = state.data.concat(action.payload)
      state.idList.push({"id":action.payload.key, "keywords": action.payload.keywords})
    },
    [fetchLTData.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});


export const { toIdle,  addtoWatchList} = ltdataSlice.actions;
export default ltdataSlice.reducer;
