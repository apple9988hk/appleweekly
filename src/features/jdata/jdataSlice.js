import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const axios = require("axios");
const API_URL = "https://jvldata.udc.local/getPlotData";

const initialState = {
  data: [],
  status: "idle",
  error: null,
  watchList: [],
};

export const fetchJData = createAsyncThunk("users/fetchJData", async (id) => {
  const headers = {
    "accept-encoding" : "gzip, deflate, br",
    "accept-language" : "en-US,en;q=0.9",
    "content-length": "26",
  }
  const snapshot = await axios.post(API_URL, JSON.stringify({ runNumber: id }), headers);
  let newdata = snapshot.data;
  newdata["id"] = id;
  return newdata;
});


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
    addtoWatchList: (state, action) => {
        const index = state.watchList.indexOf(action.payload);
        if (index > -1) { // only splice array when item is found
            state.watchList.splice(index, 1); // 2nd parameter means remove one item only
        }
        state.watchList.push(action.payload)
      },
  },
  extraReducers: {
    [fetchJData.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchJData.fulfilled]: (state, action) => {
      state.status = "succeeded";
      // console.log('hihihih')
      // console.log(action)
      // if (action.payload){
      state.data.push(action.payload);
      // }
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

export const { toIdle, addtoWatchList } = jdataSlice.actions;
export default jdataSlice.reducer;
