import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import _ from "lodash";
// const axios = require("axios");
const API_URL = "https://jvldata.udc.local/getPlotData";
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

export const fetchJData = createAsyncThunk("users/fetchJData", async (id) => {
  let newdata = {};
  const snapshot = await axios.get(`http://tmdata.udc.local/api/spectral/log/${id}`);
  const snapshot2 = await axios.get(`http://tmdata.udc.local/api/jvl/summary/${id}`);
  const keyword = await axios.post(
    "http://ltquickview/api/v1.0/data/keywords", JSON.stringify([{ "sampleID": id+"-1d1" }])
  );
  let merged = snapshot.data.map( 
    function(d ) {
      console.log(snapshot2.data)
      console.log(d.SampleID)
      let e = _.filter(snapshot2.data, function (o) {
          return (
            o.Filename === d.SampleID
          );
        })
      console.log(e)
      return (
        {
          ...d,
          ...e[0]
    }
      )
    }
  )
  // console.log("merged")
  // console.log(merged)
  
  newdata['data'] = merged;
  newdata['id'] = id;
  newdata['keywords'] = keyword.data[0]['keywords'];
  newdata['substrate'] = keyword.data[0]['substrate'];
  return newdata;
});


export const fetchSpectral = createAsyncThunk("users/fetchSpectral", async (id) => {
  let newdata = {};
  const snapshot = await axios.get(`http://tmdata.udc.local/api/spectral/${id}`);
  const keyword = await axios.post(
    "http://ltquickview/api/v1.0/data/keywords", JSON.stringify([{ "sampleID": id+"-1d1" }])
  );
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
  // console.log("merged")
  // console.log(merged)
  
  newdata['data'] = merged;
  newdata['id'] = id;
  newdata['keywords'] = keyword.data[0]['keywords'];
  newdata['substrate'] = keyword.data[0]['substrate'];
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
      console.log(action.payload)
      state.data = state.data.concat(action.payload.data)
      state.idList.push({"id":action.payload.id, "keywords": action.payload.keywords})
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
