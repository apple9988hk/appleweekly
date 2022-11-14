import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counter/counterSlice'
import jdataReducer from './features/jdata/jdataSlice'
import sdataReducer from './features/sdata/sdataSlice'

export const store = configureStore({
    reducer: {
      counter: counterReducer,
      jdata: jdataReducer,
      sdata: sdataReducer,
    },
  })