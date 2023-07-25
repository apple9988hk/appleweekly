import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import _ from "lodash";
const axios = require("axios");

const initialState = {
  data: [],
  idList: [],
  cdList: [],
  status: "idle",
  error: null,
  watchList: [],
};

export const fetchOJData = createAsyncThunk("users/fetchOJData", async (id) => {
  let newdata = {};
  const snapshot = await axios.get(
    `http://tmdata.udc.local/api/spectral/oj/${id}`
  );
  console.log(snapshot);
  if (snapshot.status === 200) {
    newdata = snapshot.data;
    console.log(newdata);
  }
  newdata = newdata.map((d) => {
    return {
      ...d,
      LE: (d.Luminance / d.CurrentDensity) * 0.1,
    };
  });

  return newdata;
});

export const ojdataSlice = createSlice({
  name: "ojdata",
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
      if (index > -1) {
        // only splice array when item is found
        state.watchList.splice(index, 1); // 2nd parameter means remove one item only
      }
      state.watchList.push(action.payload);
    },
  },
  extraReducers: {
    [fetchOJData.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchOJData.fulfilled]: (state, action) => {
      state.status = "succeeded";
      console.log(action.payload);
      state.data = state.data.concat(action.payload);
      const uniqueFilenames = [
        ...new Set(state.data.map((d) => d.Title.slice(0, -4))),
      ];
      uniqueFilenames.forEach((d) => {
        if (!state.idList.includes(d)) {
          state.idList.push({ id: d, keywords: "" });
        }
      });
      const uniqueCD = [...new Set(state.data.map((d) => d.CurrentDensity))];
      uniqueCD.forEach((d) => {
        if (!state.cdList.some((item) => item.cd === d)) {
          state.cdList.push({ cd: d });
        }
      });
    },
    [fetchOJData.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const { toIdle, addtoWatchList } = ojdataSlice.actions;
export default ojdataSlice.reducer;
